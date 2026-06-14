import { isArray } from './index'

type AnyObject = Record<PropertyKey, any>

export const getValue = (data: AnyObject, key: PropertyKey) => {
  if (typeof key === 'string') {
    const keyArr = key.split('.')
    if (keyArr.length === 1) {
      return data[key]
    }
    return keyArr.reduce((obj, k) => {
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

export const setValue = (data: AnyObject, key: PropertyKey, value: any) => {
  if (typeof key === 'string') {
    const keyArr = key.split('.')
    if (keyArr.length === 1) {
      data[key] = value
    } else {
      const lastKey = keyArr.pop()!
      const target = keyArr.reduce((obj, k) => {
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

// 根据多选获取默认的值
export const getDefaultValueByMultiple = <T>(value: T, multiple?: boolean): T | T[] => {
  if (multiple) {
    return isArray(value) ? value : value ? [value] : []
  }
  return value
}
