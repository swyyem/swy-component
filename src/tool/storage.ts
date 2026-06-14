import { isJSONString } from './common'
/**
 * web storage 封装
 */
type StorageType = 'local' | 'session'
const createStorage = (type: StorageType = 'local') => {
  const innerStorage = window[`${type}Storage`]
  const storage = {
    /**
     * 设置
     * @param key 键名
     * @param value 值
     * @param merge 是否合并已有对象 (默认为 false)
     */
    set(key: string, value: any, merge = false): void {
      try {
        // 处理字符串类型，避免重复序列化
        const valueToStore = typeof value === 'string' ? value : JSON.stringify(value)
        // 当 value 是对象时，需要合并之前的值
        if (merge && typeof value === 'object') {
          const oldValue = this.get(key, {})
          if (typeof oldValue === 'object') {
            const mergedValue = { ...oldValue, ...value }
            innerStorage.setItem(key, JSON.stringify(mergedValue))
            return
          }
        }
        innerStorage.setItem(key, valueToStore)
      } catch (e) {
        console.error('=web storage error=', e instanceof Error ? e.message : e)
      }
    },

    /**
     * 获取
     * @param key 键名
     * @param defaultValue 默认值
     * @returns 解析后的值或默认值
     */
    get<T = string>(key: string, defaultValue?: T): T {
      const value = innerStorage.getItem(key)
      if (value === null) {
        return defaultValue as T
      }
      // 检查是否是简单字符串（不是 JSON 格式）
      if (isJSONString(value)) {
        try {
          return JSON.parse(value)
        } catch {
          return value as T
        }
      }
      return value as T
    },

    /**
     * 移除
     * @param key 键名
     */
    remove(key: string): void {
      innerStorage.removeItem(key)
    },

    /**
     * 清空所有
     */
    clear(): void {
      innerStorage.clear()
    },
  }
  return storage
}
export const localStorage = createStorage()
export const sessionStorage = createStorage('session')
