import { isRef } from 'vue'
import type { ProFormValueType, PropFormFieldProps, FiledForm } from './form.types'
type AnyObject = Record<PropertyKey, any>
/* eslint-disable @typescript-eslint/no-explicit-any */
export const structuredClone = (obj: any, map = new WeakMap()) => {
  if (obj === null || typeof obj !== 'object') {
    return obj // 处理基本类型和 null
  }
  if (map.has(obj)) {
    return map.get(obj) // 处理循环引用
  }
  let clone: any
  if (obj instanceof Date) {
    clone = new Date(obj.getTime())
  } else if (obj instanceof RegExp) {
    clone = new RegExp(obj.source, obj.flags)
  } else if (Array.isArray(obj)) {
    clone = []
    map.set(obj, clone)
    obj.forEach((item, index) => {
      clone[index] = structuredClone(item, map)
    })
  } else {
    clone = Object.create(Object.getPrototypeOf(obj))
    map.set(obj, clone)
    Object.keys(obj).forEach((key) => {
      clone[key] = structuredClone(obj[key], map)
    })
  }
  return clone
}

// 处理表单数据中存在 null 和 undefined 的情况
export const disposeDataByEmpty = (data: AnyObject): AnyObject => {
  // 需要判断，否则会被当做 object 处理没了
  if (data instanceof Date) {
    return data
  } else if (data instanceof RegExp) {
    return data
  } else if (Array.isArray(data)) {
    return data
      .map((item) => disposeDataByEmpty(item))
      .filter((item) => item !== null && item !== undefined)
  } else if (typeof data === 'object' && data !== null) {
    return Object.fromEntries(
      Object.entries(data)
        .map(([key, value]) => [key, disposeDataByEmpty(value)])
        .filter(([, value]) => value !== null && value !== undefined),
    )
  }
  return data
}

export const omitProps = <T extends Record<string, any>>(props: T, omitKeys: Array<keyof T>) => {
  const restProps = Object.fromEntries(
    Object.entries(props).filter(([key]) => !omitKeys.includes(key)),
  )
  return restProps
}
// 处理 params 参数
export const transferParams = (params: PropFormFieldProps['params'], values: ProFormValueType) => {
  if (!params) {
    return {}
  }
  const res: typeof values = {}
  const keys = Array.isArray(params) ? params : [params]
  keys.forEach((key) => {
    const val = values?.[key]
    if (val) {
      res[key] = val
    }
  })
  return res
}

export const getPureData = (initialValues: ProFormValueType, omitNil?: boolean) => {
  const res = structuredClone(isRef(initialValues) ? initialValues.value : initialValues)
  return omitNil ? disposeDataByEmpty(res) : res
}

// 返回格式 string[]
export const getRealColumnKeys = (columns: FiledForm[]) => {
  const res: string[] = []
  if (columns) {
    columns.forEach((col) => {
      const name = Array.isArray(col.name) ? col.name.join('.') : col.name
      if (col.valueType === 'group' && col.columns) {
        res.push(...getRealColumnKeys(col.columns))
      } else {
        res.push(name)
      }
    })
  }
  return res
}
