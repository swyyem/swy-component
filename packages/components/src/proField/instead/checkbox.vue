<template>
  <span
    ref="spanRef"
    tabindex="0"
    :class="className"
    @focusin="handleFocus"
    @focusout="handleFocusOut"
    @click="handleClick"
  >
    <el-checkbox ref="checkboxRef" v-model="innerValue" v-bind="otherProps" @change="handleChange">
      <template v-if="$slots.default">
        <slot />
      </template>
      <template v-else>
        {{ otherProps.label }}
      </template>
    </el-checkbox>
  </span>
</template>
<style lang="less">
.pro-checkbox--wrap {
  display: inline-block;
  // padding: 4px;
  outline: 0;

  &__nolabel {
    .el-checkbox__label {
      display: none;
    }
  }

  &__border {
    border: 1px #999 dashed;
  }

  // .el-checkbox {
  //   height: 14px;
  // }

  &.is-focus {
    .el-checkbox__inner {
      border-radius: var(--el-checkbox-border-radius);
      outline: 2px solid var(--el-checkbox-input-border-color-hover);
      outline-offset: 1px;
    }
  }
}
</style>
<script lang="ts" setup>
import { computed, ref, watch, onMounted } from 'vue'
import { ElCheckbox } from 'element-plus'
import type { ProSingleCheckboxProps } from '../index.type'
import { omit } from 'lodash-unified'
import { isSpace } from '../../utils/keyboard'
import { isUndefined } from '../../utils'

export type ProCheckboxEmits = {
  (e: 'update:modelValue', val: ProSingleCheckboxProps['modelValue']): void
  (e: 'focus', v: FocusEvent): void
  (e: 'blur', v: FocusEvent): void
  (e: 'keydown', v: KeyboardEvent): void
  (e: 'change', v: ProSingleCheckboxProps['modelValue']): void
  (e: 'click', v: MouseEvent): void
}
const props = defineProps<ProSingleCheckboxProps>()
const emit = defineEmits<ProCheckboxEmits>()
defineOptions({
  name: 'ProCheckbox',
  inheritAttrs: false,
})
const handleChange = (v: ProSingleCheckboxProps['modelValue']) => {
  emit('change', v)
}
const handleClick = (e: MouseEvent) => {
  e.stopPropagation()
  emit('click', e)
}
const className = computed(() => {
  const cls = ['pro-checkbox--wrap']
  if (!props.label) {
    cls.push('pro-checkbox--wrap__nolabel')
  }
  if (focusRef.value) {
    cls.push('is-focus')
  }
  return cls.join(' ')
})
const innerValue = ref(props.modelValue)
const otherProps = computed(() => {
  return omit(props, ['modelValue', 'onUpdate:modelValue'])
})
const spanRef = ref<HTMLSpanElement>()
const checkboxRef = ref()
const focusRef = ref(false)
const handleFocus = (e: FocusEvent) => {
  // console.log('=handle focus=')
  focusRef.value = true
  checkboxRef.value?.$el?.querySelector('input').focus()
  emit('focus', e)
}
const handleFocusOut = (e: FocusEvent) => {
  const currentTarget = e.currentTarget as HTMLElement
  const relatedTarget = e.relatedTarget as HTMLElement | null
  // console.log('=handleFocusOut=', currentTarget, relatedTarget)
  if (currentTarget.contains(relatedTarget)) {
    // 如果是子元素获得焦点，不触发 onBlur
    return
  }
  // console.log('=handle blur=')
  focusRef.value = false
  emit('blur', e)
}

watch(
  () => props.modelValue,
  (v) => {
    if (innerValue.value !== v) {
      innerValue.value = v
    }
  },
)

watch(innerValue, (v) => {
  if (!isUndefined(v)) {
    emit('update:modelValue', v)
  }
})

const handleKeydown = (e: KeyboardEvent) => {
  e.preventDefault()
  // console.log('=keydown=', e.key)
  // 空格键切换
  if (isSpace(e)) {
    const res = !innerValue.value
    innerValue.value = res
  }
  emit('keydown', e)
}

onMounted(() => {
  const inputEl = checkboxRef.value?.$el?.querySelector('input')
  if (inputEl) {
    inputEl.addEventListener('keydown', handleKeydown, true)
  }
})

defineExpose({
  focus: () => {
    spanRef.value?.focus()
  },
  blur: () => {
    spanRef.value?.blur()
  },
})
</script>
