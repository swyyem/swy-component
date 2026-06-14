// CookieUtil.ts
import { isJSONString } from './common'
import type { ProCookieAttributes } from './index.types'

const encode = (value: string): string => {
  return encodeURIComponent(value).replace(
    /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
    decodeURIComponent,
  )
}
const decode = (value: string): string => {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}
const serialize = (name: string, value: string, options: ProCookieAttributes): string => {
  let str = `${encode(name)}=${encode(value)}`
  if (options.expires) {
    const expires =
      typeof options.expires === 'number'
        ? new Date(Date.now() + options.expires * 864e5)
        : options.expires
    str += `; Expires=${expires.toUTCString()}`
  }
  if (options.path) str += `; Path=${options.path}`
  if (options.domain) str += `; Domain=${options.domain}`
  if (options.sameSite) str += `; SameSite=${options.sameSite}`
  if (options.secure) str += `; Secure`
  return str
}

class CookieClass {
  private defaultAttributes: ProCookieAttributes

  constructor(defaultAttributes: ProCookieAttributes = {}) {
    this.defaultAttributes = defaultAttributes
  }

  set(name: string, value: any, options: ProCookieAttributes = {}) {
    const mergedOptions = { ...this.defaultAttributes, ...options }
    const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value)
    document.cookie = serialize(name, stringValue, mergedOptions)
  }

  get<T = string>(name: string): T | undefined {
    const cookies = document.cookie ? document.cookie.split('; ') : []
    for (const pair of cookies) {
      const [rawKey, ...rawVal] = pair.split('=')
      if (decode(rawKey) === name) {
        const val = decode(rawVal.join('='))
        // 检查是否是简单字符串（不是 JSON 格式）
        if (isJSONString(val)) {
          try {
            return JSON.parse(val)
          } catch {
            return val as T
          }
        }
        return val as T
      }
    }
    return undefined
  }

  remove(name: string, options: ProCookieAttributes = {}) {
    this.set(name, '', { ...options, expires: -1 })
  }

  withAttributes(defaults: ProCookieAttributes): CookieClass {
    return new CookieClass({ ...this.defaultAttributes, ...defaults })
  }
}

export { CookieClass }
const cookieUtil = new CookieClass({ path: '/', sameSite: 'Lax' })
export default cookieUtil
