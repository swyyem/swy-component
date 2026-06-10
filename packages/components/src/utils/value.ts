/**
 * 值操作工具
 * 支持深层嵌套对象和数组的取值和设值
 */
import { isArray } from './index'

type AnyObject = Record<PropertyKey, any>

/**
 * 从对象中获取值（支持深层路径和数组索引）
 * @param data 目标对象
 * @param key 键名（支持 'a.b.c' 和 'a[0].b' 格式）
 * @returns 获取的值
 */
export const getValue = (data: AnyObject, key: PropertyKey) => {
  if (typeof key === 'string') {
    const keyArr = key.split('.')
    if (keyArr.length === 1) {
      return data[key]
    }
    // 处理深层路径
    return keyArr.reduce((obj, k) => {
      // 处理数组索引：a[0]
      if (k.includes('[') && k.includes(']')) {
        const [arrayKey, indexStr] = k.split('[')
        const index = parseInt(indexStr.replace(']', ''))
        return obj?.[arrayKey]?.[index]
      }
      return obj?.[k]
    }, data)
  }
  return data[key]
}

/**
 * 设置对象值（支持深层路径和数组索引）
 * @param data 目标对象
 * @param key 键名（支持 'a.b.c' 和 'a[0].b' 格式）
 * @param value 要设置的值
 */
export const setValue = (data: AnyObject, key: PropertyKey, value: any) => {
  if (typeof key === 'string') {
    const keyArr = key.split('.')
    if (keyArr.length === 1) {
      data[key] = value
    } else {
      const lastKey = keyArr.pop()!
      // 找到目标对象
      const target = keyArr.reduce((obj, k) => {
        // 处理数组索引
        if (k.includes('[') && k.includes(']')) {
          const [arrayKey, indexStr] = k.split('[')
          const index = parseInt(indexStr.replace(']', ''))
          if (!obj[arrayKey]) obj[arrayKey] = []
          if (!obj[arrayKey][index]) obj[arrayKey][index] = {}
          return obj[arrayKey][index]
        }
        if (!obj[k]) obj[k] = {}
        return obj[k]
      }, data)

      // 设置最后一层的值
      if (lastKey.includes('[') && lastKey.includes(']')) {
        const [arrayKey, indexStr] = lastKey.split('[')
        const index = parseInt(indexStr.replace(']', ''))
        if (!target[arrayKey]) target[arrayKey] = []
        target[arrayKey][index] = value
      } else {
        target[lastKey] = value
      }
    }
  } else {
    data[key] = value
  }
}

/**
 * 根据多选状态获取默认值
 * @param value 值
 * @param multiple 是否多选
 * @returns 单选返回值，多选返回数组
 */
export const getDefaultValueByMultiple = <T>(value: T, multiple?: boolean): T | T[] => {
  if (multiple) {
    // 多选：确保返回数组
    return isArray(value) ? value : value ? [value] : []
  }
  // 单选：直接返回值
  return value
}
