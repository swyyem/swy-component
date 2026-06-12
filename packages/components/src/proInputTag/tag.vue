<template>
  <div ref="tagRef" v-click-outside:[poperSideRef]="handleClickOutside" :class="[nsSelect.b()]">
    <ElTooltip
      ref="tooltipRef"
      pure
      trigger="click"
      :visible="expanded && valueEnum.length > 0"
      :effect="props.effect"
      :popper-class="[nsSelect.e('popper'), props.popperClass]"
    >
      <template #default>
        <ElInput
          ref="inputRef"
          @keyup.enter="handleEnter"
          @focus="handleFocus"
          v-model="inputValue"
          v-bind="inputProps"
        />
      </template>
      <template #content>
        <ProInputTagDropdown
          :tagRef="tagRef"
          :popperClass="props.popperClass"
          :contentWidth="props.contentWidth"
          :fitInputWidth="props.fitInputWidth"
        >
          <div :class="nsSelect.be('dropdown', 'header')" @click.stop>
            共 {{ valueEnum.length }} 条记录
          </div>
          <ElScrollbar
            v-show="valueEnum.length > 0"
            :id="contentId"
            tag="ul"
            :wrap-class="nsSelect.be('dropdown', 'wrap')"
            :view-class="nsSelect.be('dropdown', 'list')"
            role="listbox"
          >
            <li
              v-for="item in valueEnum"
              :class="[nsSelect.be('dropdown', 'item'), 'pro-inputtag-item']"
              :key="String(item.value)"
            >
              {{ item.label }}
              <el-icon @click="handleClick(item.value)">
                <Close />
              </el-icon>
            </li>
          </ElScrollbar>
        </ProInputTagDropdown>
      </template>
    </ElTooltip>
  </div>
</template>
<style lang="less">
.pro-inputtag-item {
  position: relative;

  &:hover {
    background-color: var(--el-fill-color-light);
  }

  .el-icon {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
<script setup lang="ts">
import { computed, ref, type Directive } from 'vue'
import { uniq } from 'lodash-unified'
import {
  ElTooltip,
  ElScrollbar,
  ElInput,
  ElIcon,
  ClickOutside,
  type InputInstance,
  type TooltipInstance,
} from 'element-plus'
import { Close } from '@element-plus/icons-vue'
import { useNamespace, useId } from '../utils/hooks'
import ProInputTagDropdown from './dropdown.vue'
import type { ProInputTagProps, ProInputTagEmits, ProInputTagInstance } from './tag.types'

defineOptions({
  name: 'ProInputTag',
})
const vClickOutside: Directive = ClickOutside
const contentId = useId()
const nsSelect = useNamespace('select')
const props = withDefaults(defineProps<ProInputTagProps>(), {
  effect: 'light',
  popperClass: '',
  fitInputWidth: true,
})
const inputProps = computed(() => {
  const { placeholder, clearable, disabled, ..._rest } = props
  return { placeholder, clearable, disabled }
})
const emit = defineEmits<ProInputTagEmits>()
const tagRef = ref<HTMLElement>()
const tooltipRef = ref<TooltipInstance>()
const popperRef = computed(() => {
  return tooltipRef.value?.popperRef?.contentRef
})
const poperSideRef = popperRef as any
const inputRef = ref<InputInstance>()
const expanded = ref(false)
const inputValue = ref('')
// value
const modelValue = computed(() => props.modelValue || [])
// options
const valueEnum = computed(() => {
  const values = modelValue.value
  return values.map((item) => ({
    label: item,
    value: item,
  }))
})
const handleEnter = () => {
  if (inputValue.value !== '') {
    const values = modelValue.value.slice()
    values.unshift(inputValue.value)
    emit('update:modelValue', uniq(values))
    inputValue.value = ''
  }
}
const handleClick = (value: any) => {
  const values = modelValue.value.slice()
  const idx = values.indexOf(value)
  if (idx > -1) {
    values.splice(idx, 1)
    emit('update:modelValue', values)
    emit('remove-tag', value)
  }
}
const handleClickOutside = () => {
  expanded.value = false
}
const handleFocus = () => {
  expanded.value = true
}

defineExpose<ProInputTagInstance>({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur(),
})
</script>
