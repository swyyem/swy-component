<template>
  <el-checkbox v-model="checkAll" :indeterminate="indeterminate" @change="handleChange" />
</template>
<script lang="ts" setup generic="T extends ProComponentObject">
import { computed, inject, ref, watch } from 'vue'
import { ElCheckbox, type CheckboxValueType } from 'element-plus'
import { useBatchedResetFlag } from '../utils/useBatchedResetFlag'
import type { ProComponentObject } from '../common.types'
import type { ProTableProviderProps, ProColumn, AnyObject } from './table.types'
import type { ProTableEditProviderProps } from './proTableEdit.types'

type ProTabeHeaderCheckboxProps<T extends ProComponentObject> = Pick<
  ProColumn<T>,
  'tooltip' | 'required' | 'dataKey'
> & {
  column: ProComponentObject
  columnIndex: number
  class?: string
}

defineOptions({
  name: 'ProTableHeaderCheckbox',
})
const props = defineProps<ProTabeHeaderCheckboxProps<T>>()
const ProTableData = inject<ProTableProviderProps<T>>('ProTableData')!
const ProEditTableData = inject<ProTableEditProviderProps<T>>('ProEditTableData')!
const dataKey = computed(() => props.dataKey || 'unknow')
// 全选逻辑
const checkAll = ref(false)
const indeterminate = ref(false)
const makeCheck = (data: AnyObject[]) => {
  checkAll.value = data.length > 0 && data.every((item) => item[dataKey.value])
  indeterminate.value = data.some((item) => item[dataKey.value]) && !checkAll.value
}

// tableData 数组长度变化时
watch(
  () => ProTableData.tableData.value,
  (data: AnyObject[]) => {
    makeCheck(data)
  },
  { immediate: true },
)
// 来自全选的变化
const { flag, scheduleReset } = useBatchedResetFlag<boolean>(false, false)
ProEditTableData.editEventBus.on(`change:${dataKey.value}`, () => {
  if (flag.value) {
    scheduleReset()
    return
  }
  makeCheck(ProTableData.tableData.value)
})

const handleChange = (value: CheckboxValueType) => {
  const mapData = ProTableData.tableData.value.map((item) => {
    // 记录一下，一定要返回新对象引用 form 才会响应
    return {
      ...item,
      [dataKey.value]: value,
    }
  })
  flag.value = true
  ProTableData.setTableData(mapData, true)
}
</script>
