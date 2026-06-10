/**
 * 工具函数集合
 * 包含类型判断、DOM 操作、属性构建等常用工具方法
 */
import { warn } from 'vue'
import { isClient, isIOS } from '@vueuse/core'
import { CircleCheck, CircleClose, Loading } from '@element-plus/icons-vue'
import { fromPairs } from 'lodash-unified'

type UtilValue = any
type AnyFunction = (...args: UtilValue[]) => UtilValue

export { isClient, isIOS }

/** 判断是否为数组 */
export const isArray = Array.isArray

/** 将任意值转换为类型字符串 */
const objectToString: typeof Object.prototype.toString = Object.prototype.toString
export const toTypeString = (value: unknown): string => objectToString.call(value)

/** 判断是否为对象 */
export const isObject = (val: unknown): val is Record<UtilValue, UtilValue> =>
  val !== null && typeof val === 'object'

/** 判断是否为函数 */
export const isFunction = (val: unknown): val is AnyFunction => typeof val === 'function'

/** 判断是否为 undefined */
export const isUndefined = (val: UtilValue): val is undefined => val === undefined

/** 判断是否为布尔值 */
export const isBoolean = (val: UtilValue): val is boolean => typeof val === 'boolean'

/** 判断是否为数字 */
export const isNumber = (val: UtilValue): val is number => typeof val === 'number'

/** 判断是否为字符串 */
export const isString = (val: unknown): val is string => typeof val === 'string'

/** 判断是否为空值（null、undefined、空数组、空对象） */
export const isEmpty = (val: unknown) =>
  (!val && val !== 0) ||
  (isArray(val) && val.length === 0) ||
  (isObject(val) && !Object.keys(val).length)

/** 判断是否为普通对象（非数组、非 null） */
export const isPlainObject = (val: any): val is object => toTypeString(val) === '[object Object]'

/** 判断对象是否包含指定属性 */
const hasOwnProperty = Object.prototype.hasOwnProperty
export const hasOwn = (val: object, key: string | symbol): key is keyof typeof val =>
  hasOwnProperty.call(val, key)

/** 判断是否包含韩文字符 */
export const isKorean = (text: string) => /([\uAC00-\uD7AF\u3130-\u318F])+/gi.test(text)

/** 判断是否为 DOM 元素 */
export const isElement = (e: unknown): e is Element => {
  if (typeof Element === 'undefined') return false
  return e instanceof Element
}

/** 判断是否为 Promise */
export const isPromise = <T = any>(a: unknown): a is Promise<T> => {
  return typeof a === 'object' && a !== null && typeof (a as any).then === 'function'
}

/** 确保返回数组类型（支持单个值或数组） */
type Many<T> = T | ReadonlyArray<T>
export const ensureArray = <T>(arr: Many<T>): T[] => {
  if (!arr && (arr as UtilValue) !== 0) return []
  return isArray(arr) ? arr : [arr as T]
}

/** 转义正则表达式特殊字符 */
export const escapeStringRegexp = (string = '') =>
  string.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d')

/** Element Plus 自定义错误类 */
class ElementPlusError extends Error {
  constructor(m: string) {
    super(m)
    this.name = 'ElementPlusError'
  }
}

/** 抛出错误 */
export function throwError(scope: string, m: string): never {
  throw new ElementPlusError(`[${scope}] ${m}`)
}

/** 开发环境警告 */
export function debugWarn(scope: string | Error, message?: string): void {
  if (process.env.NODE_ENV !== 'production') {
    const error: Error = isString(scope) ? new ElementPlusError(`[${scope}] ${message}`) : scope
    console.warn(error)
  }
}

/** 滚动元素到可视区域 */
export function scrollIntoView(container: HTMLElement, selected: HTMLElement): void {
  if (!isClient) return

  if (!selected) {
    container.scrollTop = 0
    return
  }

  const offsetParents: HTMLElement[] = []
  let pointer = selected.offsetParent
  while (pointer !== null && container !== pointer && container.contains(pointer)) {
    offsetParents.push(pointer as HTMLElement)
    pointer = (pointer as HTMLElement).offsetParent
  }
  const top = selected.offsetTop + offsetParents.reduce((prev, curr) => prev + curr.offsetTop, 0)
  const bottom = top + selected.offsetHeight
  const viewRectTop = container.scrollTop
  const viewRectBottom = viewRectTop + container.clientHeight

  if (top < viewRectTop) {
    container.scrollTop = top
  } else if (bottom > viewRectBottom) {
    container.scrollTop = bottom - container.clientHeight
  }
}

/** 验证状态对应的图标映射 */
export const ValidateComponentsMap = {
  validating: Loading,
  success: CircleCheck,
  error: CircleClose,
}

/** Element Plus 属性标识 Key */
export const epPropKey = '__epPropKey'
const isEpProp = (val: unknown) => isObject(val) && !!(val as any)[epPropKey]

/**
 * 构建单个组件属性
 * 支持 values 枚举验证和自定义 validator
 */
export const buildProp = (prop: UtilValue, key?: string) => {
  // 过滤原生属性类型和嵌套属性
  if (!isObject(prop) || isEpProp(prop)) return prop as any

  const { values, required, default: defaultValue, type, validator } = prop

  // 构建验证器
  const _validator =
    values || validator
      ? (val: unknown) => {
          let valid = false
          let allowedValues: unknown[] = []

          if (values) {
            allowedValues = Array.from(values)
            if (hasOwn(prop, 'default')) {
              allowedValues.push(defaultValue)
            }
            valid ||= allowedValues.includes(val)
          }
          if (validator) valid ||= validator(val)

          if (!valid && allowedValues.length > 0) {
            const allowValuesText = [...new Set(allowedValues)]
              .map((value) => JSON.stringify(value))
              .join(', ')
            warn(
              `Invalid prop: validation failed${
                key ? ` for prop "${key}"` : ''
              }. Expected one of [${allowValuesText}], got value ${JSON.stringify(val)}.`,
            )
          }
          return valid
        }
      : undefined

  const epProp: any = {
    type,
    required: !!required,
    validator: _validator,
    [epPropKey]: true,
  }
  if (hasOwn(prop, 'default')) epProp.default = defaultValue
  return epProp
}

/** 批量构建组件属性 */
export const buildProps = (props: UtilValue) =>
  fromPairs(
    Object.entries(props).map(([key, option]) => [key, buildProp(option as any, key)]),
  ) as any

/** 查找匹配指定 class 的父元素 */
export const findAllProTableParents = (targetElement: HTMLElement, matchStr: string) => {
  if (!targetElement || !(targetElement instanceof HTMLElement)) {
    return null
  }

  let result
  let currentElement = targetElement.parentElement
  while (currentElement) {
    if (currentElement.classList && currentElement.classList.contains(matchStr)) {
      result = currentElement
      break
    }
    currentElement = currentElement.parentElement
  }
  return result
}
