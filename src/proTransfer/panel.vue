<template>
  <div class="pro-transfer--panel">
    <ProTable v-bind="tableProps" />
  </div>
</template>
<script setup lang="ts" generic="T extends ProComponentObject">
import { computed, reactive, watch } from 'vue'
import ProTable, { type ProTableProps } from '../proTable'
import type { ProComponentObject } from '../common.types'
import type { ProTransferPanelProps } from './transfer.types'
const props = withDefaults(defineProps<ProTransferPanelProps<T>>(), {
  valueKey: 'value',
})

defineOptions({
  name: 'ProTransferPanel',
})

const checked = props.checked.map((item) => item[props.valueKey])
watch(
  () => props.checked,
  (newChecked) => {
    const keys = newChecked.map((item) => item[props.valueKey])
    rowSelection.selectedRowKeys = keys
  },
)

const rowSelection = reactive({
  type: 'checkbox',
  selectedRowKeys: checked,
  reserveSelection: true,
  rowClick: true,
  onChange: props.checkedChange,
})
const tableProps = computed(() => {
  return {
    toolbar: false,
    pagination: false,
    sameMaxHeight: true,
    emptyText: '',
    rowKey: props.valueKey,
    highlightCurrentRow: false,
    ...(props.tableProps || {}),
    data: props.data,
    rowSelection: rowSelection,
  } as ProTableProps
})
</script>
