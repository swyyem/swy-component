import { computed, ref, watch, type Ref } from 'vue'
import type { CheckboxValueType } from 'element-plus'
import type { ProSelectDefaultProps, ProSelectEmits } from './select.types'
import type { ProSchemaValueEnumType } from '../proField'
import { CHANGE_EVENT, UPDATE_MODEL_EVENT, UPDATE_OPTION } from '../utils/constants'
import { filterDisabledOptions } from './helper'
import { isArray } from '../utils'

const getLength = (v?: ProSchemaValueEnumType[]) => {
  return filterDisabledOptions(v || []).length
}
export const useCheck = (
  props: ProSelectDefaultProps,
  emit: ProSelectEmits,
  options: {
    valueEnum: Ref<ProSchemaValueEnumType[]>
    getOptionDataList: (v?: CheckboxValueType[]) => ProSchemaValueEnumType[]
  },
) => {
  // 开启全选状态
  const checkStatus = computed(() => {
    return props.multiple && props.checkAll
  })
  const defaultValue = isArray(props.modelValue) ? props.modelValue : [props.modelValue]
  const isAll = ref(
    defaultValue.length > 0 && defaultValue.length === getLength(options.valueEnum.value),
  )
  const isIndeterminate = ref(checkStatus.value ? defaultValue.length > 0 && !isAll.value : false)

  watch([() => props.modelValue, options.valueEnum], ([newModelValue, newValueEnum]) => {
    // console.log('=useCheck=', newModelValue, newValueEnum)
    const realVal = (newModelValue as []) || []
    if (realVal.length === 0) {
      isAll.value = false
      isIndeterminate.value = false
    } else if (realVal.length === getLength(newValueEnum)) {
      isAll.value = true
      isIndeterminate.value = false
    } else {
      isIndeterminate.value = true
    }
  })

  const handleCheckAll = (val: CheckboxValueType) => {
    isIndeterminate.value = false
    let values = []
    let optionDataList: ProSchemaValueEnumType[] = []
    if (val) {
      values = options.valueEnum.value.filter((item) => !item.disabled).map((item) => item.value)
      optionDataList = options.getOptionDataList(values)
    }
    emit(UPDATE_MODEL_EVENT, values)
    emit(UPDATE_OPTION, optionDataList)
    emit(CHANGE_EVENT, values)
  }

  return {
    checkStatus,
    handleCheckAll,
    checkAll: isAll,
    checkIndeterminate: isIndeterminate,
  }
}
