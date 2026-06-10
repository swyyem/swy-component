/**
 * 管道模式测试
 */
import { describe, it, expect, vi } from 'vitest'
import { Pipeline } from '../src/pipeline'

describe('Pipeline', () => {
  it('应该创建管道实例', () => {
    const pipeline = new Pipeline()
    expect(pipeline).toBeInstanceOf(Pipeline)
  })

  it('应该支持添加函数', () => {
    const pipeline = new Pipeline()
    const fn1 = vi.fn((v) => v)
    const fn2 = vi.fn((v) => v)

    const result = pipeline.add(fn1).add(fn2)

    expect(result).toBeInstanceOf(Pipeline) // 支持链式调用
  })

  it('应该按顺序执行函数', () => {
    const pipeline = new Pipeline()
    const log: number[] = []

    pipeline
      .add(() => {
        log.push(1)
        return { a: 1 }
      })
      .add(() => {
        log.push(2)
        return { b: 2 }
      })
      .add(() => {
        log.push(3)
        return { c: 3 }
      })

    pipeline.run()

    expect(log).toEqual([1, 2, 3])
  })

  it('应该合并所有函数的返回结果', () => {
    const pipeline = new Pipeline()

    pipeline
      .add(() => ({ a: 1 }))
      .add(() => ({ b: 2 }))
      .add(() => ({ c: 3 }))

    const result = pipeline.run()

    expect(result).toEqual({ a: 1, b: 2, c: 3 })
  })

  it('应该处理空对象返回', () => {
    const pipeline = new Pipeline()

    pipeline
      .add(() => ({}))
      .add(() => ({ a: 1 }))

    const result = pipeline.run()

    expect(result).toEqual({ a: 1 })
  })

  it('应该处理非对象返回', () => {
    const pipeline = new Pipeline()

    pipeline
      .add(() => 'string' as any)
      .add(() => 123 as any)
      .add(() => ({ a: 1 }))

    const result = pipeline.run()

    expect(result).toEqual({ a: 1 }) // 只合并对象
  })

  it('应该支持传入初始参数', () => {
    const pipeline = new Pipeline()

    pipeline.add((params) => {
      return { result: params.input * 2 }
    })

    const result = pipeline.run({ input: 5 })

    expect(result).toEqual({ result: 10 })
  })

  it('应该支持覆盖相同键', () => {
    const pipeline = new Pipeline()

    pipeline
      .add(() => ({ a: 1, b: 1 }))
      .add(() => ({ b: 2, c: 2 }))
      .add(() => ({ c: 3, d: 3 }))

    const result = pipeline.run()

    expect(result).toEqual({ a: 1, b: 2, c: 3, d: 3 })
  })

  it('空管道执行应该返回空对象', () => {
    const pipeline = new Pipeline()

    const result = pipeline.run()

    expect(result).toEqual({})
  })

  it('应该支持复杂的数据处理流程', () => {
    const pipeline = new Pipeline()

    pipeline
      .add(() => ({ name: 'test' }))
      .add((params) => ({ age: params.name ? 18 : 0 }))
      .add((params) => ({
        greeting: `Hello, ${params.name}!`,
      }))

    const result = pipeline.run()

    // 注意：Pipeline 的每个函数都接收原始参数，而不是累积结果
    // 所以 params.name 在第二个函数中是 undefined
    expect(result).toEqual({
      name: 'test',
      age: 0, // params.name 是 undefined
      greeting: 'Hello, undefined!',
    })
  })

  describe('链式调用', () => {
    it('应该支持连续链式调用', () => {
      const pipeline = new Pipeline()

      const result = pipeline
        .add(() => ({ a: 1 }))
        .add(() => ({ b: 2 }))
        .add(() => ({ c: 3 }))
        .run()

      expect(result).toEqual({ a: 1, b: 2, c: 3 })
    })

    it('add 方法应该返回 this', () => {
      const pipeline = new Pipeline()
      const fn = vi.fn()

      expect(pipeline.add(fn)).toBe(pipeline)
    })
  })
})
