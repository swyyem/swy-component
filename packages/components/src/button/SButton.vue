<script setup lang="ts">
import type { SButtonProps } from './types'

withDefaults(defineProps<SButtonProps>(), {
  type: 'default',
  size: 'medium',
  disabled: false,
  loading: false,
})

defineEmits<{
  click: [e: MouseEvent]
}>()
</script>

<template>
  <button
    class="s-button"
    :class="[`s-button--${type}`, `s-button--${size}`, { 'is-disabled': disabled, 'is-loading': loading }]"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="s-button__loading">⏳</span>
    <slot />
  </button>
</template>

<style scoped>
.s-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}
.s-button--primary { background: #409eff; color: #fff; border-color: #409eff; }
.s-button--success { background: #67c23a; color: #fff; border-color: #67c23a; }
.s-button--warning { background: #e6a23c; color: #fff; border-color: #e6a23c; }
.s-button--danger  { background: #f56c6c; color: #fff; border-color: #f56c6c; }
.s-button--default { background: #fff; color: #606266; }
.s-button--small  { padding: 5px 12px; font-size: 12px; }
.s-button--large  { padding: 12px 20px; font-size: 16px; }
.is-disabled { opacity: 0.6; cursor: not-allowed; }
</style>
