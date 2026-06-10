import { describe, it, expect } from 'vitest'
import { debounce, throttle, isObject, generateId } from '../src/index'

describe('debounce', () => {
  it('should delay execution', async () => {
    let count = 0
    const fn = debounce(() => count++, 100)

    fn()
    fn()
    fn()
    expect(count).toBe(0) // 还没执行

    await new Promise(r => setTimeout(r, 150))
    expect(count).toBe(1) // 只执行了一次
  })
})

describe('throttle', () => {
  it('should limit execution frequency', () => {
    let count = 0
    const fn = throttle(() => count++, 100)

    fn() // 执行
    fn() // 忽略
    fn() // 忽略
    expect(count).toBe(1)
  })
})

describe('isObject', () => {
  it('should return true for objects', () => {
    expect(isObject({})).toBe(true)
    expect(isObject([])).toBe(true)
  })

  it('should return false for primitives', () => {
    expect(isObject(null)).toBe(false)
    expect(isObject(undefined)).toBe(false)
    expect(isObject(1)).toBe(false)
    expect(isObject('str')).toBe(false)
  })
})

describe('generateId', () => {
  it('should generate unique ids with prefix', () => {
    const id1 = generateId('btn')
    const id2 = generateId('btn')

    expect(id1).toMatch(/^btn_/)
    expect(id2).toMatch(/^btn_/)
    expect(id1).not.toBe(id2) // 唯一
  })
})
