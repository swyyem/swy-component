/**
 * 类型判断工具函数测试
 */
import { describe, it, expect } from 'vitest'
import {
  isArray,
  isObject,
  isFunction,
  isUndefined,
  isBoolean,
  isNumber,
  isString,
  isEmpty,
  isPlainObject,
  hasOwn,
  isKorean,
  isElement,
  isPromise,
  ensureArray,
  escapeStringRegexp,
  toTypeString,
} from '../src/index'

describe('类型判断函数', () => {
  describe('isArray', () => {
    it('应该正确识别数组', () => {
      expect(isArray([])).toBe(true)
      expect(isArray([1, 2, 3])).toBe(true)
      expect(isArray(new Array())).toBe(true)
    })

    it('应该正确识别非数组', () => {
      expect(isArray({})).toBe(false)
      expect(isArray('string')).toBe(false)
      expect(isArray(123)).toBe(false)
      expect(isArray(null)).toBe(false)
      expect(isArray(undefined)).toBe(false)
    })
  })

  describe('isObject', () => {
    it('应该正确识别对象', () => {
      expect(isObject({})).toBe(true)
      expect(isObject({ name: 'test' })).toBe(true)
      expect(isObject(new Object())).toBe(true)
    })

    it('应该正确识别非对象', () => {
      expect(isObject(null)).toBe(false)
      expect(isObject(undefined)).toBe(false)
      expect(isObject(123)).toBe(false)
      expect(isObject('string')).toBe(false)
      expect(isObject([])).toBe(true) // 数组也是对象
    })
  })

  describe('isFunction', () => {
    it('应该正确识别函数', () => {
      expect(isFunction(() => {})).toBe(true)
      expect(isFunction(function () {})).toBe(true)
      expect(isFunction(async () => {})).toBe(true)
      expect(isFunction(Array.isArray)).toBe(true)
    })

    it('应该正确识别非函数', () => {
      expect(isFunction({})).toBe(false)
      expect(isFunction([])).toBe(false)
      expect(isFunction('function')).toBe(false)
      expect(isFunction(123)).toBe(false)
    })
  })

  describe('isUndefined', () => {
    it('应该正确识别 undefined', () => {
      expect(isUndefined(undefined)).toBe(true)
      expect(isUndefined(void 0)).toBe(true)
    })

    it('应该正确识别非 undefined', () => {
      expect(isUndefined(null)).toBe(false)
      expect(isUndefined(0)).toBe(false)
      expect(isUndefined('')).toBe(false)
      expect(isUndefined(false)).toBe(false)
    })
  })

  describe('isBoolean', () => {
    it('应该正确识别布尔值', () => {
      expect(isBoolean(true)).toBe(true)
      expect(isBoolean(false)).toBe(true)
      expect(isBoolean(Boolean(1))).toBe(true)
    })

    it('应该正确识别非布尔值', () => {
      expect(isBoolean(1)).toBe(false)
      expect(isBoolean(0)).toBe(false)
      expect(isBoolean('true')).toBe(false)
      expect(isBoolean(null)).toBe(false)
    })
  })

  describe('isNumber', () => {
    it('应该正确识别数字', () => {
      expect(isNumber(123)).toBe(true)
      expect(isNumber(0)).toBe(true)
      expect(isNumber(-1)).toBe(true)
      expect(isNumber(3.14)).toBe(true)
      expect(isNumber(NaN)).toBe(true)
      expect(isNumber(Infinity)).toBe(true)
    })

    it('应该正确识别非数字', () => {
      expect(isNumber('123')).toBe(false)
      expect(isNumber(null)).toBe(false)
      expect(isNumber(undefined)).toBe(false)
      expect(isNumber([])).toBe(false)
    })
  })

  describe('isString', () => {
    it('应该正确识别字符串', () => {
      expect(isString('')).toBe(true)
      expect(isString('hello')).toBe(true)
      expect(isString(String(123))).toBe(true)
    })

    it('应该正确识别非字符串', () => {
      expect(isString(123)).toBe(false)
      expect(isString(null)).toBe(false)
      expect(isString(undefined)).toBe(false)
      expect(isString([])).toBe(false)
    })
  })

  describe('isEmpty', () => {
    it('应该识别空值', () => {
      expect(isEmpty(null)).toBe(true)
      expect(isEmpty(undefined)).toBe(true)
      expect(isEmpty('')).toBe(true)
      expect(isEmpty(0)).toBe(false) // 0 不是空值
    })

    it('应该识别空数组', () => {
      expect(isEmpty([])).toBe(true)
      expect(isEmpty([1, 2])).toBe(false)
    })

    it('应该识别空对象', () => {
      expect(isEmpty({})).toBe(true)
      expect(isEmpty({ name: 'test' })).toBe(false)
    })
  })

  describe('isPlainObject', () => {
    it('应该识别普通对象', () => {
      expect(isPlainObject({})).toBe(true)
      expect(isPlainObject({ name: 'test' })).toBe(true)
      expect(isPlainObject(Object.create(null))).toBe(true)
    })

    it('应该识别非普通对象', () => {
      expect(isPlainObject([])).toBe(false)
      expect(isPlainObject(null)).toBe(false)
      expect(isPlainObject(new Date())).toBe(false)
      expect(isPlainObject(new RegExp(''))).toBe(false)
    })
  })

  describe('hasOwn', () => {
    it('应该正确判断对象是否包含属性', () => {
      const obj = { name: 'test', age: 18 }
      expect(hasOwn(obj, 'name')).toBe(true)
      expect(hasOwn(obj, 'age')).toBe(true)
      expect(hasOwn(obj, 'address')).toBe(false)
    })

    it('应该正确判断 Symbol 属性', () => {
      const sym = Symbol('test')
      const obj = { [sym]: 'value' }
      expect(hasOwn(obj, sym)).toBe(true)
    })
  })

  describe('isKorean', () => {
    it('应该识别韩文字符', () => {
      expect(isKorean('한글')).toBe(true)
      expect(isKorean('ㄱㄴㄷ')).toBe(true)
      expect(isKorean('가나다')).toBe(true)
    })

    it('应该识别非韩文字符', () => {
      expect(isKorean('hello')).toBe(false)
      expect(isKorean('中文')).toBe(false)
      expect(isKorean('123')).toBe(false)
    })
  })

  describe('isElement', () => {
    it('应该识别 DOM 元素', () => {
      if (typeof document !== 'undefined') {
        const div = document.createElement('div')
        expect(isElement(div)).toBe(true)
      }
    })

    it('应该识别非 DOM 元素', () => {
      expect(isElement({})).toBe(false)
      expect(isElement('div')).toBe(false)
      expect(isElement(null)).toBe(false)
    })
  })

  describe('isPromise', () => {
    it('应该识别 Promise', () => {
      expect(isPromise(Promise.resolve())).toBe(true)
      expect(isPromise(new Promise((resolve) => resolve()))).toBe(true)
    })

    it('应该识别非 Promise', () => {
      expect(isPromise({})).toBe(false)
      expect(isPromise(123)).toBe(false)
      expect(isPromise(null)).toBe(false)
    })

    it('应该识别带有 then 方法的对象（Promise-like）', () => {
      const promiseLike = { then: () => {} }
      expect(isPromise(promiseLike)).toBe(true) // 有 then 方法会被识别为 Promise
    })
  })

  describe('ensureArray', () => {
    it('应该将单个值转换为数组', () => {
      expect(ensureArray(1)).toEqual([1])
      expect(ensureArray('test')).toEqual(['test'])
      expect(ensureArray(null)).toEqual([])
      expect(ensureArray(undefined)).toEqual([])
    })

    it('应该保持数组不变', () => {
      expect(ensureArray([1, 2, 3])).toEqual([1, 2, 3])
      expect(ensureArray([])).toEqual([])
    })

    it('应该正确处理 0', () => {
      expect(ensureArray(0)).toEqual([0])
    })
  })

  describe('escapeStringRegexp', () => {
    it('应该转义正则特殊字符', () => {
      expect(escapeStringRegexp('hello.world')).toBe('hello\\.world')
      expect(escapeStringRegexp('test*value')).toBe('test\\*value')
      expect(escapeStringRegexp('(group)')).toBe('\\(group\\)')
      expect(escapeStringRegexp('[class]')).toBe('\\[class\\]')
    })

    it('应该转义连字符', () => {
      expect(escapeStringRegexp('test-value')).toBe('test\\x2dvalue')
    })

    it('应该正确处理空字符串', () => {
      expect(escapeStringRegexp('')).toBe('')
    })
  })

  describe('toTypeString', () => {
    it('应该返回正确的类型字符串', () => {
      expect(toTypeString({})).toBe('[object Object]')
      expect(toTypeString([])).toBe('[object Array]')
      expect(toTypeString('string')).toBe('[object String]')
      expect(toTypeString(123)).toBe('[object Number]')
      expect(toTypeString(null)).toBe('[object Null]')
      expect(toTypeString(undefined)).toBe('[object Undefined]')
      expect(toTypeString(() => {})).toBe('[object Function]')
    })
  })
})
