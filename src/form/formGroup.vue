<template>
  <div
    class="group_box"
    :style="{ display: formContext?.labelPosition === 'top' ? 'block' : 'flex' }"
  >
    <div class="group_label" :style="{ width: formContext?.labelWidth, ...getLabelPositionStyle }">
      {{ props?.label }}
      {{ formContext?.labelSuffix }}
    </div>
    <div class="group_content" :style="{ ...getLabelInline }">
      <slot></slot>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { GroupProps } from './form.types'
import { inject, computed } from 'vue'

defineOptions({
  name: 'FormGroup',
})

const props = defineProps<{ label: string }>()

const formContext = inject<GroupProps>('proformPosition')

const getLabelPositionStyle = computed(() => {
  if (formContext?.labelPosition === 'top') {
    return {
      display: 'block',
      'margin-bottom': '8px',
    }
  } else if (formContext?.labelPosition === 'right') {
    return {
      'justify-content': 'flex-end',
    }
  } else {
    return {
      'justify-content': 'flex-start',
    }
  }
})

const getLabelInline = computed(() => {
  return formContext?.inline ? { display: 'flex' } : { display: 'block' }
})
</script>

<style scoped lang="less">
.group_box {
  display: flex;
  align-items: flex-start;
}

.group_label {
  box-sizing: border-box;
  display: flex;
  color: var(--el-text-color-regular);
  font-size: var(--el-form-label-font-size);
  padding: 0 12px 0 0;
}

.group_content {
  flex-direction: column;
  flex-wrap: wrap;
}
</style>
