/**
 * Props 访问 Hook
 * 用于在 setup 中访问组件 props
 */
import { computed, getCurrentInstance } from 'vue'
import type { ComputedRef } from 'vue'

/**
 * 使用 Props
 * @param name props 名称
 * @returns 计算属性形式的 props 值
 */
export const useProp = <T>(name: string): ComputedRef<T | undefined> => {
  const vm = getCurrentInstance()
  return computed(() => (vm?.proxy?.$props as any)?.[name])
}
