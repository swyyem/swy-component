/**
 * 值操作工具函数测试
 */
import { describe, it, expect } from 'vitest'
import { getValue, setValue, getDefaultValueByMultiple } from '../src/value'

describe('值操作工具', () => {
  describe('getValue', () => {
    it('应该获取简单属性的值', () => {
      const obj = { name: 'test', age: 18 }
      expect(getValue(obj, 'name')).toBe('test')
      expect(getValue(obj, 'age')).toBe(18)
    })

    it('应该获取深层嵌套属性的值', () => {
      const obj = {
        user: {
          profile: {
            name: 'test',
          },
        },
      }
      expect(getValue(obj, 'user.profile.name')).toBe('test')
    })

    it('应该获取数组元素的值', () => {
      const obj = {
        users: [{ name: 'Alice' }, { name: 'Bob' }],
      }
      expect(getValue(obj, 'users[0].name')).toBe('Alice')
      expect(getValue(obj, 'users[1].name')).toBe('Bob')
    })

    it('应该获取嵌套数组的值', () => {
      const obj = {
        data: {
          items: [{ id: 1 }, { id: 2 }],
        },
      }
      expect(getValue(obj, 'data.items[0].id')).toBe(1)
      expect(getValue(obj, 'data.items[1].id')).toBe(2)
    })

    it('应该处理不存在的属性', () => {
      const obj = { name: 'test' }
      expect(getValue(obj, 'address')).toBe(undefined)
      expect(getValue(obj, 'user.profile')).toBe(undefined)
    })

    it('应该处理 null 和 undefined', () => {
      const obj = {
        user: null,
        data: undefined,
      }
      expect(getValue(obj, 'user.name')).toBe(undefined)
      expect(getValue(obj, 'data.value')).toBe(undefined)
    })

    it('应该支持 Symbol 键', () => {
      const sym = Symbol('key')
      const obj = { [sym]: 'value' }
      expect(getValue(obj, sym)).toBe('value')
    })
  })

  describe('setValue', () => {
    it('应该设置简单属性的值', () => {
      const obj: any = {}
      setValue(obj, 'name', 'test')
      expect(obj.name).toBe('test')
    })

    it('应该设置深层嵌套属性的值', () => {
      const obj: any = {}
      setValue(obj, 'user.profile.name', 'test')
      expect(obj.user.profile.name).toBe('test')
    })

    it('应该设置数组元素的值', () => {
      const obj: any = { users: [] }
      setValue(obj, 'users[0].name', 'Alice')
      expect(obj.users[0].name).toBe('Alice')
    })

    it('应该创建不存在的中间对象', () => {
      const obj: any = {}
      setValue(obj, 'a.b.c.d', 'value')
      expect(obj.a.b.c.d).toBe('value')
    })

    it('应该创建不存在的中间数组', () => {
      const obj: any = {}
      setValue(obj, 'data.items[0].id', 1)
      expect(obj.data.items[0].id).toBe(1)
    })

    it('应该处理混合路径', () => {
      const obj: any = {}
      setValue(obj, 'users[0].profile.name', 'test')
      expect(obj.users[0].profile.name).toBe('test')
    })

    it('应该支持 Symbol 键', () => {
      const sym = Symbol('key')
      const obj: any = {}
      setValue(obj, sym, 'value')
      expect(obj[sym]).toBe('value')
    })
  })

  describe('getDefaultValueByMultiple', () => {
    describe('单选模式', () => {
      it('应该直接返回值', () => {
        expect(getDefaultValueByMultiple('test', false)).toBe('test')
        expect(getDefaultValueByMultiple(123, false)).toBe(123)
        expect(getDefaultValueByMultiple(null, false)).toBe(null)
      })

      it('undefined 模式应该返回原值', () => {
        expect(getDefaultValueByMultiple('test')).toBe('test')
        expect(getDefaultValueByMultiple(123)).toBe(123)
      })
    })

    describe('多选模式', () => {
      it('应该将单个值转换为数组', () => {
        expect(getDefaultValueByMultiple('test', true)).toEqual(['test'])
        expect(getDefaultValueByMultiple(123, true)).toEqual([123])
      })

      it('应该保持数组不变', () => {
        expect(getDefaultValueByMultiple(['a', 'b'], true)).toEqual(['a', 'b'])
        expect(getDefaultValueByMultiple([1, 2, 3], true)).toEqual([1, 2, 3])
      })

      it('应该处理空值', () => {
        expect(getDefaultValueByMultiple(null, true)).toEqual([])
        expect(getDefaultValueByMultiple(undefined, true)).toEqual([])
        // 空字符串在 JavaScript 中是 falsy 值，所以会被转换为空数组
        expect(getDefaultValueByMultiple('', true)).toEqual([])
        // 0 也是 falsy 值，会被转换为空数组
        expect(getDefaultValueByMultiple(0, true)).toEqual([])
      })
    })
  })
})
