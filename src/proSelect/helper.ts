import { isFunction, isPlainObject, isArray } from '../utils'
import type { AnyObject } from '../index'
import type { ProSelectDefaultProps, ProOptionValue } from './select.types'

const getLableKey = (props: ProSelectDefaultProps) => {
  if (isFunction(props.labelKey)) {
    return props.labelKey
  }
  const labelKey = props.labelKey || 'label'
  return (item: AnyObject) => item && item[labelKey]
}
// const getValueKey = (data: any, valueKey?: string) => {
//   return valueKey && isPlainObject(data) ? (data as Record<string, any>)[valueKey] : data
// }
export const getSelectEnhanceText = (value: ProOptionValue, props: ProSelectDefaultProps) => {
  let labels = []
  const getLabel = getLableKey(props)
  const isTableMode = !!props.tableProps
  const arrValue = isArray(value) ? value : value ? [value] : []
  if (isTableMode) {
    labels = arrValue.map((item) => {
      const label = getLabel(item)
      return label
    })
  } else {
    const valueEnum = props.valueEnum || props.defaultValueEnum || []
    labels = arrValue
      .map((item) => {
        // 如果值是 object 类型，直接从 value 中解析 label
        if (isPlainObject(item)) {
          return getLabel(item)
        } else {
          const val = valueEnum.find((option) => {
            return option.value === item
          })
          return val ? val.label : null
        }
      })
      .filter((item) => !!item)
  }
  if (labels.length > 0) {
    return labels.join(',')
  }
  const defaultLabel = props.defaultLabel
  const arrLabel = isArray(defaultLabel) ? defaultLabel : defaultLabel ? [defaultLabel] : []
  const label = arrLabel.length > 0 ? arrLabel : arrValue
  return label.join(',')
}

export const filterDisabledOptions = (options: any[]) => {
  return (options || []).filter((item) => !item.disabled)
}
