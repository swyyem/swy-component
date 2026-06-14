<template>
  <div
    class="el-date-editor rang-date el-input"
    :style="setStyle"
    :class="[dateStyle, { 'is-disabled': getDisabled }]"
  >
    <div
      tabindex="-1"
      class="date-border el-input el-input__wrapper"
      :class="[dateStyle, { 'is-focus': isFocus }]"
      @keydown="onKeydown"
    >
      <DatePicker
        ref="datePickerLeftRef"
        v-bind="{ ...getDateRangeProps, placeholder: props.startPlaceholder }"
        v-model="getModelValue1"
        @isFocus="handleFocus"
        @keydown="(type: string) => onRangeKeydown(type, 'left')"
      />
      <span class="el-range-separator">{{ props.rangeSeparator || '-' }}</span>
      <DatePicker
        ref="datePickerRightRef"
        v-bind="{ ...getDateRangeProps, placeholder: props.endPlaceholder }"
        v-model="getModelValue2"
        @isFocus="handleFocus"
        @keydown="(type: string) => onRangeKeydown(type, 'right')"
      />
      <span class="icon-wrapper">
        <el-icon
          color="#c0c4cc"
          v-show="props.clearable && !getDisabled && getModelValue?.length"
          class="clear-icon"
          :style="setStyle"
          @click.stop="clear"
        >
          <CircleClose />
        </el-icon>
        <el-icon
          v-if="props.showCalendarIcon"
          color="#c0c4cc"
          class="calendar-icon"
          :style="setStyle"
          @click.stop="togglePicker"
        >
          <Calendar />
        </el-icon>
      </span>
      <el-date-picker
        ref="pickerRef"
        class="range-picker"
        v-bind="getProps"
        v-model="getModelValue"
      ></el-date-picker>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, useAttrs } from 'vue'
import DatePicker from './datePicker.vue'
import { ElIcon, ElDatePicker } from 'element-plus'
import type { ProDatePickerProps } from './datePicker.data'
import { Calendar, CircleClose } from '@element-plus/icons-vue'
import { typeFormatMap } from './utils/dateHelper'

const props = withDefaults(defineProps<ProDatePickerProps>(), {})

const attrs = useAttrs()

const emit = defineEmits(['update:modelValue', 'keydown:enter', 'isFocus'])

const datePickerLeftRef = ref()
const datePickerRightRef = ref()

const getModelValue = computed({
  get: () => {
    return props.modelValue as [any, any] | undefined
  },
  set: (val) => emit('update:modelValue', val),
})

const getModelValue1 = computed({
  get: () => {
    return (props.modelValue as [any, any] | undefined)?.[0]
  },
  set: (val) => emit('update:modelValue', [val, getModelValue2.value]),
})

const getModelValue2 = computed({
  get: () => (props.modelValue as [any, any] | undefined)?.[1],
  set: (val) => emit('update:modelValue', [getModelValue1.value, val]),
})

const dateStyle = computed(() => {
  if (['daterange', 'monthrange', 'yearrange'].includes(props.type ?? '')) {
    return 'date-range-picker'
  } else if (props.type === 'datetimerange') {
    return 'date-time-range-picker'
  } else {
    return ''
  }
})

const getDateRangeProps = computed(() => {
  return {
    ...props,
    hasIcon: false,
    onChange: attrs.onChange,
    onblur: attrs.onblur,
    onFocus: attrs.onFocus,
    onClear: attrs.onClear,
    calendarChange: attrs.calendarChange,
    panelChange: attrs.panelChange,
    onVisibleChange: attrs.onVisibleChange,
  }
})

const getProps = computed(() => {
  return {
    ...props,
    valueFormat: props.valueFormat || typeFormatMap[String(props.type)],
    onChange: attrs.onChange,
    onblur: attrs.onblur,
    onFocus: attrs.onFocus,
    onClear: attrs.onClear,
    calendarChange: attrs.calendarChange,
    panelChange: attrs.panelChange,
    onVisibleChange: attrs.onVisibleChange,
  }
})

const getDisabled = computed(() => props.disabled)

const setStyle = computed(() => {
  if (getDisabled.value) {
    return {
      cursor: 'not-allowed',
    }
  }
  return ''
})

const isFocus = ref(false)
const pickerRef = ref()

function handleFocus(focus: boolean) {
  isFocus.value = focus
  emit('isFocus', focus)
}

const clear = () => {
  getModelValue.value = undefined
  onChange()
  ;(attrs.onClear as () => void)?.()
}

const togglePicker = () => {
  if (getDisabled.value) {
    return
  }
  pickerRef.value?.handleOpen?.()
}

const onChange = () => {
  ;(attrs.onChange as (val: string[] | undefined) => void)?.(
    getModelValue.value as string[] | undefined,
  )
}

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    if (getModelValue.value && getModelValue.value.length > 0) {
      onChange()
      return
    }
    emit('keydown:enter')
  }
}

const onRangeKeydown = (type: string, current: string) => {
  if (type === 'right' && current === 'left') {
    datePickerRightRef.value?.addFocusClass()
    datePickerLeftRef.value?.removeFocusClass()
  } else if (type === 'left' && current === 'right') {
    datePickerLeftRef.value?.addFocusClass()
    datePickerRightRef.value?.removeFocusClass()
  }
}

const addFocusClass = () => {
  datePickerLeftRef.value.addFocusClass()
  handleFocus(true)
}

const removeFocusClass = () => {
  datePickerLeftRef.value.removeFocusClass()
  datePickerRightRef.value.removeFocusClass()
  handleFocus(false)
}

defineExpose({
  addFocusClass,
  removeFocusClass,
})
</script>

<style scoped lang="less">
.el-date-editor {
  --el-date-editor-monthrange-width: 220px;
  --el-date-editor-daterange-width: 220px;
  --el-date-editor-datetimerange-width: 330px;
}

.date-range-picker {
  display: flex;
  align-items: center;
  // width: fit-content;
  width: var(--el-date-editor-daterange-width);
}

.date-time-range-picker {
  display: flex;
  align-items: center;
  // width: fit-content;
  width: var(--el-date-editor-datetimerange-width);
}

.icon-wrapper {
  display: flex;
  align-items: center;
  margin-left: auto;
}

:deep(.range-picker) {
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  visibility: hidden;
}

.rang-date:hover .clear-icon {
  visibility: visible;
  opacity: 1;
}

.clear-icon {
  visibility: hidden;
  opacity: 0;
  cursor: pointer;
  margin-left: auto;
  margin-right: 5px;
}

.calendar-icon {
  margin-left: 6px;
  font-size: 16px;
  cursor: pointer;
  margin-left: auto;
}
</style>
