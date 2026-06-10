/**
 * 延迟执行器测试
 */
import { describe, it, expect, vi } from 'vitest'
import { createDeferredExecutor } from '../src/defer'

describe('createDeferredExecutor', () => {
  it('应该创建执行器实例', () => {
    const executor = createDeferredExecutor()
    expect(executor).toHaveProperty('reset')
    expect(executor).toHaveProperty('add')
    expect(executor).toHaveProperty('exec')
  })

  describe('add', () => {
    it('在未执行时应该将回调加入队列', () => {
      const executor = createDeferredExecutor()
      const cb = vi.fn()

      executor.add(cb)

      expect(cb).not.toHaveBeenCalled()
    })

    it('在执行后添加的回调应该立即执行', () => {
      const executor = createDeferredExecutor()
      const cb1 = vi.fn()
      const cb2 = vi.fn()

      executor.add(cb1)
      executor.exec()
      executor.add(cb2)

      expect(cb1).toHaveBeenCalled()
      expect(cb2).toHaveBeenCalled()
    })

    it('应该支持添加多个回调', () => {
      const executor = createDeferredExecutor()
      const cb1 = vi.fn()
      const cb2 = vi.fn()
      const cb3 = vi.fn()

      executor.add(cb1)
      executor.add(cb2)
      executor.add(cb3)
      executor.exec()

      expect(cb1).toHaveBeenCalledTimes(1)
      expect(cb2).toHaveBeenCalledTimes(1)
      expect(cb3).toHaveBeenCalledTimes(1)
    })
  })

  describe('exec', () => {
    it('应该执行队列中的所有回调', () => {
      const executor = createDeferredExecutor()
      const results: number[] = []

      executor.add(() => results.push(1))
      executor.add(() => results.push(2))
      executor.add(() => results.push(3))
      executor.exec()

      expect(results).toEqual([1, 2, 3])
    })

    it('执行后应该清空队列', () => {
      const executor = createDeferredExecutor()
      const cb = vi.fn()

      executor.add(cb)
      executor.exec()
      executor.exec() // 再次执行

      expect(cb).toHaveBeenCalledTimes(1) // 只执行一次
    })

    it('空队列执行应该无效果', () => {
      const executor = createDeferredExecutor()

      expect(() => executor.exec()).not.toThrow()
    })

    it('执行后应该标记为就绪', () => {
      const executor = createDeferredExecutor()
      const cb1 = vi.fn()
      const cb2 = vi.fn()

      executor.add(cb1) // 先添加一个回调
      executor.exec() // 执行后 ready 变为 true
      executor.add(cb2) // 执行后添加应该立即执行

      expect(cb1).toHaveBeenCalled()
      expect(cb2).toHaveBeenCalled()
    })
  })

  describe('reset', () => {
    it('应该重置执行状态', () => {
      const executor = createDeferredExecutor()
      const cb1 = vi.fn()
      const cb2 = vi.fn()

      executor.add(cb1)
      executor.exec()
      executor.reset()
      executor.add(cb2)

      expect(cb1).toHaveBeenCalledTimes(1)
      expect(cb2).not.toHaveBeenCalled() // 重置后应该重新加入队列
    })

    it('重置后应该可以重新执行', () => {
      const executor = createDeferredExecutor()
      const cb = vi.fn()

      executor.add(cb)
      executor.exec()
      executor.reset()
      executor.add(cb)
      executor.exec()

      expect(cb).toHaveBeenCalledTimes(2)
    })
  })

  describe('集成测试', () => {
    it('应该支持完整的使用流程', () => {
      const executor = createDeferredExecutor()
      const log: string[] = []

      // 添加初始任务
      executor.add(() => log.push('task1'))
      executor.add(() => log.push('task2'))

      // 执行
      executor.exec()

      // 执行后添加新任务（应该立即执行）
      executor.add(() => log.push('task3'))

      // 重置
      executor.reset()

      // 重置后添加任务（应该加入队列）
      executor.add(() => log.push('task4'))

      // 再次执行
      executor.exec()

      expect(log).toEqual(['task1', 'task2', 'task3', 'task4'])
    })

    it('回调执行顺序应该正确', () => {
      const executor = createDeferredExecutor()
      const order: number[] = []

      executor.add(() => order.push(1))
      executor.add(() => order.push(2))
      executor.add(() => order.push(3))

      executor.exec()

      expect(order).toEqual([1, 2, 3])
    })
  })
})
