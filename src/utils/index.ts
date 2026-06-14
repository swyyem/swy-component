import { warn } from 'vue'
import { isClient, isIOS } from '@vueuse/core'
import { CircleCheck, CircleClose, Loading } from '@element-plus/icons-vue'
import { fromPairs } from 'lodash-unified'

type UtilValue = any
type AnyFunction = (...args: UtilValue[]) => UtilValue

export { isClient, isIOS }
export const isArray = Array.isArray
const objectToString: typeof Object.prototype.toString = Object.prototype.toString
export const toTypeString = (value: unknown): string => objectToString.call(value)
export const isObject = (val: unknown): val is Record<UtilValue, UtilValue> =>
  val !== null && typeof val === 'object'
export const isFunction = (val: unknown): val is AnyFunction => typeof val === 'function'
export const isUndefined = (val: UtilValue): val is undefined => val === undefined
export const isBoolean = (val: UtilValue): val is boolean => typeof val === 'boolean'
export const isNumber = (val: UtilValue): val is number => typeof val === 'number'
export const isString = (val: unknown): val is string => typeof val === 'string'
export const isEmpty = (val: unknown) =>
  (!val && val !== 0) ||
  (isArray(val) && val.length === 0) ||
  (isObject(val) && !Object.keys(val).length)
export const isPlainObject = (val: any): val is object => toTypeString(val) === '[object Object]'
const hasOwnProperty = Object.prototype.hasOwnProperty
export const hasOwn = (val: object, key: string | symbol): key is keyof typeof val =>
  hasOwnProperty.call(val, key)
export const isKorean = (text: string) => /([\uAC00-\uD7AF\u3130-\u318F])+/gi.test(text)
export const isElement = (e: unknown): e is Element => {
  if (typeof Element === 'undefined') return false
  return e instanceof Element
}
export const isPromise = <T = any>(a: unknown): a is Promise<T> => {
  return typeof a === 'object' && a !== null && typeof (a as any).then === 'function'
}

type Many<T> = T | ReadonlyArray<T>
export const ensureArray = <T>(arr: Many<T>): T[] => {
  if (!arr && (arr as UtilValue) !== 0) return []
  return isArray(arr) ? arr : [arr as T]
}

export const escapeStringRegexp = (string = '') =>
  string.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d')

class ElementPlusError extends Error {
  constructor(m: string) {
    super(m)
    this.name = 'ElementPlusError'
  }
}

export function throwError(scope: string, m: string): never {
  throw new ElementPlusError(`[${scope}] ${m}`)
}

export function debugWarn(scope: string | Error, message?: string): void {
  if (process.env.NODE_ENV !== 'production') {
    const error: Error = isString(scope) ? new ElementPlusError(`[${scope}] ${message}`) : scope

    console.warn(error)
  }
}

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

export const ValidateComponentsMap = {
  validating: Loading,
  success: CircleCheck,
  error: CircleClose,
}

export const epPropKey = '__epPropKey'
const isEpProp = (val: unknown) => isObject(val) && !!(val as any)[epPropKey]
export const buildProp = (prop: UtilValue, key?: string) => {
  // filter native prop type and nested prop, e.g `null`, `undefined` (from `buildProps`)
  if (!isObject(prop) || isEpProp(prop)) return prop as any

  const { values, required, default: defaultValue, type, validator } = prop

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
export const buildProps = (props: UtilValue) =>
  fromPairs(
    Object.entries(props).map(([key, option]) => [key, buildProp(option as any, key)]),
  ) as any

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
