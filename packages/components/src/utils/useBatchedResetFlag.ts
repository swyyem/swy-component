import { ref } from 'vue'

export function useBatchedResetFlag<T>(initial: T, resetValue: T) {
  const flag = ref<T>(initial)
  let scheduled = false

  const scheduleReset = () => {
    if (scheduled) {
      return
    }
    scheduled = true
    Promise.resolve().then(() => {
      flag.value = resetValue
      scheduled = false
    })
  }

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
