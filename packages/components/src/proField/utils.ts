import dayjs from 'dayjs'
import { h } from 'vue'
import type { Component, Ref, VNode } from 'vue'
import { isEqual as lodashEqual } from 'lodash-unified'
import Input from './components/input'
import Autocomplete from './components/autocomplete'
import Checkbox from './components/checkbox'
import InputNumber from './components/inputNumber'
import Select from './components/select'
import Radio from './components/radio'
import Rate from './components/rate'
import Slider from './components/slider'
import Switch from './components/switch'
import Avatar from './components/avatar'
import Image from './components/image'
import Cascader from './components/cascader'
import ColorPicker from './components/colorPicker'
import Segmented from './components/segmented'
import Divider from './components/divider'
import InputTag from './components/inputTag'
import Mention from './components/mention'
import SelectV2 from './components/selectV2'
import TimePicker from './components/timePicker'
import TimeSelect from './components/timeSelect'
import TreeSelect from './components/treeSelect'
import Transfer from './components/transfer'
import Upload from './components/upload'
import ModalUpload from './components/modalUpload'
import Button from './components/button'
// import DatePicker from './components/datePicker'
import SelectEnhance from './components/selectEnhance'
import InputPrice from './components/inputPrice'
import datePickerV2 from './components/datePickerV2'
import dateTimePicker from './components/dateTimePicker'
import dateRangePicker from './components/dateRangePicker'
import dateTimeRangePicker from './components/dateTimeRangePicker'
import Table from './components/table'
import type { ProSchemaValueEnumType } from './index.type'

const defaultComponentMap: Record<string, Component> = {
  text: Input,
  autocomplete: Autocomplete,
  checkbox: Checkbox,
  inputNumber: InputNumber,
  select: Select,
  radio: Radio,
  rate: Rate,
  slider: Slider,
  switch: Switch,
  avatar: Avatar,
  image: Image,
  cascader: Cascader,
  colorPicker: ColorPicker,
  segmented: Segmented,
  divider: Divider,
  inputTag: InputTag,
  mention: Mention,
  selectV2: SelectV2,
  timePicker: TimePicker,
  timeSelect: TimeSelect,
  treeSelect: TreeSelect,
  transfer: Transfer,
  upload: Upload,
  modalUpload: ModalUpload,
  button: Button,
  datePicker: datePickerV2,
  dateTimePicker: dateTimePicker,
  dateRangePicker: dateRangePicker,
  dateTimeRangePicker: dateTimeRangePicker,
  option: Select, // 为了操作栏配置
  selectEnhance: SelectEnhance,
  price: InputPrice,
  table: Table,
}

// 定义全局的组件映射，默认内置的
const componentMap: Record<string, Component> = { ...defaultComponentMap }

/**
 * 检查组件是否已注册，并输出错误
 * @param name 组件名称
 */
const checkComponentRegistration = (name: string): boolean => {
  if (componentMap[name]) {
    console.error(`Component "${name}" is already registered. It will be overwritten.`)
    return false
  }
  return true
}

/**
 * 注册单个组件
 * @param name 组件名称
 * @param component 组件实例
 */
const registerSingleComponent = (name: string, component: Component): void => {
  if (!name || !component) {
    console.error('Component name and component are required.')
    return
  }
  checkComponentRegistration(name)
  // 允许覆盖
  componentMap[name] = component
}

/**
 * 注册组件
 * @param param 组件名称（字符串）或组件对象（键值对）
 * @param component 组件实例（当 param 为字符串时必填）
 */
export const registerComponent = (
  param: string | Record<string, Component>,
  component?: Component,
): void => {
  if (!param) {
    console.error('Param is required.')
    return
  }

  if (typeof param === 'string') {
    // 处理单个组件注册
    if (!component) {
      console.error('Component is required when param is a string.')
      return
    }
    registerSingleComponent(param, component)
  } else if (typeof param === 'object' && !Array.isArray(param)) {
    // 处理批量组件注册
    Object.entries(param).forEach(([name, comp]) => {
      registerSingleComponent(name, comp)
    })
  } else {
    console.error('Invalid param type. Expected a string or an object.')
  }
}

/**
 * 获取组件映射，包含内置的组件
 */
export const getComponentMap = () => {
  return componentMap
}

// 防抖函数
const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): ((...args: Parameters<T>) => Promise<ReturnType<T>>) => {
  let timeout: any = null

  return function (this: ThisParameterType<T>, ...args: Parameters<T>): Promise<ReturnType<T>> {
    if (timeout !== null) {
      clearTimeout(timeout)
    }

    return new Promise((resolve) => {
      timeout = setTimeout(async () => {
        const data = await func.apply(this, args)
        resolve(data)
      }, wait)
    })
  }
}

// 存储不同 request 函数的防抖实例
const debouncedRequests = new Map<
  (...args: any[]) => Promise<any>,
  (...args: any[]) => Promise<any>
>()

// 处理 options 和 valueEnum
export const handleValueEnum = (props: any) => {
  const { valueEnum, fieldProps } = props
  let result: ProSchemaValueEnumType[] = []
  if (fieldProps.options?.length) {
    result = fieldProps.options
  }
  if (valueEnum.length) {
    result = valueEnum
  }
  return result
}
export const handleOnlyRequest = async (props: any) => {
  const { request, params, debounceTime } = props
  let result: ProSchemaValueEnumType[] = []
  try {
    if (typeof request === 'function') {
      // 如果 Map 中没有当前 request 的防抖实例，则创建一个新的
      if (!debouncedRequests.has(request)) {
        debouncedRequests.set(request, debounce(request, debounceTime))
      }

      // 获取防抖函数并调用
      const debouncedRequest = debouncedRequests.get(request)
      result = await debouncedRequest!(params)
    }
  } catch (error) {
    console.error(error)
    result = []
  }
  return result
}
// 处理 request 和 valueEnum 的数据
export const handleRequest = async (props: any) => {
  const { request, valueEnum, params, fieldProps, debounceTime } = props
  let result: any[] = []

  try {
    if (fieldProps.options?.length) {
      result = fieldProps.options
    }

    if (valueEnum.length) {
      result = valueEnum
    }

    if (typeof request === 'function') {
      // 如果 Map 中没有当前 request 的防抖实例，则创建一个新的
      if (!debouncedRequests.has(request)) {
        debouncedRequests.set(request, debounce(request, debounceTime))
      }

      // 获取防抖函数并调用
      const debouncedRequest = debouncedRequests.get(request)
      result = await debouncedRequest!(params)
    }
  } catch (error) {
    console.error(error)
    result = []
  }

  return result
}

// 判断两个对象是否相等
export const isEqual = lodashEqual

// 构建 value 和 label 的映射,用于只读时候获取label
export const buildValueLabelMap = (options: any[], map = new Map<string | number, string>()) => {
  for (const option of options) {
    map.set(option.value, option.label) // 将 value 和 label 存入 Map
    if (option.children && option.children.length) {
      buildValueLabelMap(option.children, map) // 递归处理子节点
    }
  }
  return map
}

// 根据 modelValue 查找对应的 label
export const getLabelFromValue = (
  value: any,
  valueLabelMap: Ref<Map<string | number, string>>,
): string => {
  if (Array.isArray(value)) {
    return value
      .map((val) => {
        if (typeof val === 'object' && val !== null) {
          return valueLabelMap.value.get(val.value) || ''
        }
        return valueLabelMap.value.get(val) || ''
      })
      .filter((label) => label)
      .join(' / ')
  }

  if (typeof value === 'object' && value !== null) {
    return valueLabelMap.value.get(value?.value) || ''
  }

  return valueLabelMap.value.get(value) || ''
}

// 只读模式下渲染方法
export const renderRead = (options: any, props: any) => {
  const { modelValue } = props

  // 将 value 替换为 label
  const data = options.value.filter((option: any) => {
    return Array.isArray(modelValue)
      ? modelValue.includes(option.value)
      : option.value === modelValue
  })

  const renderChildH: VNode[] = []
  let text: string = ''
  data.forEach((res: any, index: number) => {
    const label = res.label ?? ''
    const isLast = index === data.length - 1
    const children = isLast ? label : label + ','
    // 如果options的项中如有自定义类名或者自定义styles进行添加
    if (res.status || res.color) {
      const statusSpan = h('span', {
        style: {
          marginRight: '5px',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: res.color,
          display: 'inline-block',
        },
        class: {
          [res.status]: res.status,
        },
      })
      renderChildH.push(statusSpan, h('span', {}, children))
    } else {
      renderChildH.push(h('span', {}, children))
    }
    text = text + children
  })
  return { renderChildH, text }
}

const formatDate = (date: any, format?: string): string => {
  const realFormat = format || 'YYYY-MM-DD HH:mm:ss'
  return dayjs(date).format(realFormat)
}

export const formatModelValue = (modelValue: any, text?: string, format?: string): string => {
  if (!modelValue || modelValue === '-') {
    return text || ''
  }
  if (Array.isArray(modelValue)) {
    if (modelValue.length === 2) {
      return formatDate(modelValue[0], format) + '-' + formatDate(modelValue[1], format)
    }
    return formatDate(modelValue[0], format)
  }
  return formatDate(modelValue, format)
}

export const isEmpty = (value: any) => {
  return value === undefined || value === null
}

export const filterDisabledOptions = (options: any[]) => {
  return (options || []).filter((item) => !item.disabled)
}
