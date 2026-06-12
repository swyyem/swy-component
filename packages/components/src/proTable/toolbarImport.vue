<template>
  <div class="pro-import">
    <input
      ref="fileInput"
      class="pro-import--input"
      type="file"
      @change="handleFile"
      accept=".xlsx,.xls,.csv"
    />
    <el-button type="primary" :loading="loading" @click="handleClick">{{ buttonText }}</el-button>
  </div>
</template>
<style scoped>
.pro-import {
  display: inline-block;
  position: relative;
}
.pro-import--input {
  display: none;
}
</style>
<script setup lang="ts" generic="T extends ProComponentObject">
// 导出数据需要从接扣拉取所有数据，按每页 100 条循环拉取
import { ref, computed } from 'vue'
import { ElButton } from 'element-plus'
import { getDelayRes } from './utils'
import { importMethod } from './utils/tools'
import type { ProComponentObject } from '../common.types'
import type { ProTableToolbarImportProps } from './table.types'

defineOptions({
  name: 'ProTableToolbarImport',
})
const fileInput = ref<HTMLInputElement | null>(null)
const props = defineProps<ProTableToolbarImportProps<T>>()
const buttonText = computed(() => {
  return props.buttonText || '导入'
})
const loading = ref(false)
const handleClick = () => {
  fileInput.value?.click()
}
// 点击触发导出 excel
const handleFile = (e: Event) => {
  const target = e.target as HTMLInputElement
  const files = target.files
  if (!files || files.length === 0) {
    return
  }
  if (loading.value) {
    return
  }
  loading.value = true
  disposeExcel(files[0])
}
// 导入
const disposeExcel = (file: Blob) => {
  importMethod(file, props).then((list) => {
    const delayRes = getDelayRes(() => (loading.value = false))
    props.onSuccess?.(list, delayRes.asyncEvent)
    if (!delayRes.getDelay()) {
      loading.value = false
    }
  })
}
</script>
