<script setup lang="ts">
import { ElIcon } from 'element-plus'
import { ref } from 'vue'
import { CloseBold, DocumentCopy, Select } from '@element-plus/icons-vue'
import copy from 'copy-to-clipboard'

defineOptions({ inheritAttrs: false })
const props = defineProps<{ text?: string; class?: string }>()

const copyStatus = ref<'default' | 'success' | 'error'>('default')
const onCopy = async () => {
  if (props.text) {
    try {
      await copy(props.text)
      copyResult('success')
    } catch {
      copyResult('error')
    }
  }
}

const copyResult = (type: 'success' | 'error') => {
  copyStatus.value = type
  setTimeout(() => {
    copyStatus.value = 'default'
  }, 2200)
}
</script>

<template>
  <div :class="['copyable', props.class]">
    <el-icon v-if="copyStatus === 'default'" color="var(--el-color-primary)" @click="onCopy">
      <DocumentCopy />
    </el-icon>
    <el-icon v-if="copyStatus === 'success'" color="var(--el-color-success)">
      <Select />
    </el-icon>
    <el-icon v-if="copyStatus === 'error'" color="var(--el-color-danger)">
      <CloseBold />
    </el-icon>
  </div>
</template>

<style scoped>
.copyable {
  display: flex;
  align-items: center;
}
</style>
