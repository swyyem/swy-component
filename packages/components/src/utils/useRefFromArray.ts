/**
 * 从数组中创建一个 ref 对象，并保持同步
 */
import { ref, watch, type Ref, type ComputedRef } from 'vue'
import type { ProTableGetRowKey } from '../proTable/table.types'
import type { ProComponentObject } from '../common.types'

export const useRefFromArray = <T extends ProComponentObject, U extends Record<string, T>>(
  arr: Ref<T[]>,
  getRowKey: ComputedRef<ProTableGetRowKey<T>>,
) => {
  const obj = ref({} as U)

  // 初始化
  arr.value.forEach((item) => {
    const key = getRowKey.value(item) as string
    obj.value[key] = item
  })

  watch(arr, (newVal: T[]) => {
    // uniqueKey 的值必然是 string
    const keys = newVal.map((item) => getRowKey.value(item)) as string[]
    Object.keys(obj.value).forEach((key) => {
      if (!keys.includes(key)) {
        Reflect.deleteProperty(obj.value, key)
      }
    })
    newVal.forEach((item) => {
      const key = getRowKey.value(item) as string
      obj.value[key] = item
    })
  })

  return obj
}
