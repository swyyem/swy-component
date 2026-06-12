<template>
  <el-button type="primary" :loading="loading" @click="handleClick">{{ buttonText }}</el-button>
</template>
<script setup lang="ts" generic="T extends ProComponentObject">
// 导出数据需要从接扣拉取所有数据，按每页 100 条循环拉取
import { ref, inject, computed } from 'vue'
import { ElButton, ElMessage } from 'element-plus'
import { exportMethod } from './utils/tools'
import type { ProComponentObject } from '../common.types'
import type { ProTableProviderProps, ProTableToolbarExportProps } from './table.types'

defineOptions({
  name: 'ProTableToolbarExport',
})
const props = defineProps<ProTableToolbarExportProps>()
const buttonText = computed(() => {
  return props.buttonText || '导出'
})
const loading = ref(false)
const ProTableData = inject<ProTableProviderProps<T>>('ProTableData')!
const pureFetch = ProTableData.pureFetch
const columns = ProTableData.columns
const getCellRef = ProTableData.getCellRef
// 点击触发导出 excel
const handleClick = () => {
  // 如果开启了选中模式
  if (loading.value) {
    return
  }
  loading.value = true
  exportMethod({
    ...props,
    getSelectionRows: ProTableData.getSelectionRows,
    pureFetch: pureFetch,
    columns: columns,
    getTableData: ProTableData.getTableData,
    getCellRef: getCellRef,
  })
    .then(() => {
      loading.value = false
    })
    .catch((e) => {
      loading.value = false
      console.error(e)
      ElMessage.error(e.message)
    })
}
</script>
