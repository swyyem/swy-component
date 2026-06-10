/**
 * 防抖请求函数测试
 */
import { describe, it, expect, vi } from 'vitest'
import { createFetch } from '../src/createFetch'

describe('createFetch', () => {
  it('应该执行请求并返回结果', async () => {
    const mockFn = vi.fn().mockResolvedValue('success')
    const fetch = createFetch(mockFn)

    const result = await fetch({ id: 1 })
    expect(result).toBe('success')
    expect(mockFn).toHaveBeenCalledWith({ id: 1 })
  })

  it('应该只返回最后一次请求的结果', async () => {
    const mockFn = vi.fn()
    const fetch = createFetch(mockFn)

    // 快速调用三次
    mockFn.mockResolvedValueOnce('result1')
    mockFn.mockResolvedValueOnce('result2')
    mockFn.mockResolvedValueOnce('result3')

    const promise1 = fetch({ id: 1 })
    const promise2 = fetch({ id: 2 })
    const promise3 = fetch({ id: 3 })

    const [result1, result2, result3] = await Promise.all([promise1, promise2, promise3])

    // 前两次应该返回 null，只有最后一次返回实际结果
    expect(result1).toBe(null)
    expect(result2).toBe(null)
    expect(result3).toBe('result3')
  })

  it('应该只 reject 最后一次请求的错误', async () => {
    const mockFn = vi.fn()
    const fetch = createFetch(mockFn)

    mockFn.mockRejectedValueOnce(new Error('error1'))
    mockFn.mockRejectedValueOnce(new Error('error2'))
    mockFn.mockResolvedValueOnce('success')

    const promise1 = fetch({ id: 1 })
    const promise2 = fetch({ id: 2 })
    const promise3 = fetch({ id: 3 })

    // 前两次应该返回 null，不会 reject
    await expect(promise1).resolves.toBe(null)
    await expect(promise2).resolves.toBe(null)
    // 最后一次应该正常返回
    await expect(promise3).resolves.toBe('success')
  })

  it('应该在最后一次请求完成后执行回调', async () => {
    const mockFn = vi.fn().mockResolvedValue('success')
    const cb = vi.fn()
    const fetch = createFetch(mockFn, cb)

    await fetch({ id: 1 })

    expect(cb).toHaveBeenCalledTimes(1)
  })

  it('应该在没有请求函数时返回 null 并执行回调', async () => {
    const cb = vi.fn()
    const fetch = createFetch(undefined, cb)

    const result = await fetch()

    expect(result).toBe(null)
    expect(cb).toHaveBeenCalledTimes(1)
  })

  it('应该处理并发请求的竞争条件', async () => {
    const mockFn = vi.fn()
    const fetch = createFetch(mockFn)

    // 第一个请求慢，第二个请求快
    mockFn.mockImplementationOnce(() => new Promise((resolve) => setTimeout(() => resolve('slow'), 100)))
    mockFn.mockImplementationOnce(() => Promise.resolve('fast'))

    const promise1 = fetch({ id: 1 })
    const promise2 = fetch({ id: 2 })

    const [result1, result2] = await Promise.all([promise1, promise2])

    // 第一个请求虽然慢，但已经不是最后一次，应该返回 null
    expect(result1).toBe(null)
    // 第二个请求是最后一次，应该返回结果
    expect(result2).toBe('fast')
  })

  it('应该正确传递参数', async () => {
    const mockFn = vi.fn().mockResolvedValue('ok')
    const fetch = createFetch(mockFn)

    await fetch({ type: 'user', id: 123 })

    expect(mockFn).toHaveBeenCalledWith({ type: 'user', id: 123 })
  })

  it('应该处理无参数调用', async () => {
    const mockFn = vi.fn().mockResolvedValue('ok')
    const fetch = createFetch(mockFn)

    const result = await fetch()

    expect(result).toBe('ok')
    expect(mockFn).toHaveBeenCalledWith(undefined)
  })
})
