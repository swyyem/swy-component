/**
 * 批量重置标志位 Hook
 * 用于防抖重置状态，避免频繁触发
 */
import { ref } from 'vue'

/**
 * 使用批量重置标志位
 * @param initial 初始值
 * @param resetValue 重置后的值
 */
export function useBatchedResetFlag<T>(initial: T, resetValue: T) {
  const flag = ref<T>(initial) // 标志位
  let scheduled = false // 是否已调度

  /** 调度重置（防抖） */
  const scheduleReset = () => {
    if (scheduled) {
      return // 已调度，不再重复
    }
    scheduled = true
    Promise.resolve().then(() => {
      flag.value = resetValue
      scheduled = false
    })
  }

  /** 立即重置 */
  const reset = () => {
    scheduled = false
    flag.value = resetValue
  }

  return {
    flag,
    scheduleReset,
    reset,
  }
}
