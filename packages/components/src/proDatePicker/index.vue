<template>
  <template v-if="ranges.includes(props.type ?? '')">
    <DateRangPicker
      ref="datePickerRef"
      v-bind="getRangeProps"
      v-model="getModelValue"
      @isFocus="isFocus"
    >
    </DateRangPicker>
  </template>
  <template v-else>
    <DatePicker ref="datePickerRef" v-bind="getProps" v-model="getModelValue" @isFocus="isFocus" />
  </template>
</template>

<script setup lang="ts">
import { computed, useAttrs, ref, onMounted, watch } from 'vue'
import type { ProDatePickerProps } from './datePicker.data'
import DatePicker from './datePicker.vue'
import DateRangPicker from './dateRangPicker.vue'
import { ranges, typeFormatMap } from './utils/dateHelper'
import { useFormItem } from 'element-plus'
import { debugWarn } from '../utils'
import dayjs from 'dayjs'

const attrs = useAttrs()
const props = withDefaults(defineProps<ProDatePickerProps>(), {
  clearable: true,
  showCalendarIcon: true,
})

defineOptions({
  name: 'proDatePicker',
})

const emit = defineEmits(['update:modelValue', 'focus', 'blur'])

const datePickerRef = ref()
const { formItem } = useFormItem()

const isRangeTypeComputed = computed(() => ranges.includes(props.type ?? ''))

const effectiveFormatComputed = computed(
  () => props.valueFormat || typeFormatMap[String(props.type)],
)

const toFormatted = (val: any) => {
  const effectiveFormat = effectiveFormatComputed.value
  let d
  if (val instanceof Date) d = dayjs(val)
  else if (typeof val === 'number') d = dayjs(val)
  else if (typeof val === 'string') {
    if (effectiveFormat === 'x' || /^\d+$/.test(val)) d = dayjs(Number(val))
    else d = dayjs(val, effectiveFormat)
    if (!d.isValid()) d = dayjs(val)
  } else return val
  return effectiveFormat === 'x' ? d.valueOf() : d.format(effectiveFormat)
}

const normalizedDefaultValue = computed<any>(() => {
  if (props.defaultValue === undefined || props.defaultValue === null) return undefined
  if (isRangeTypeComputed.value) {
    const dv = props.defaultValue as any
    if (Array.isArray(dv) && dv.length === 2) {
      const start = toFormatted(dv[0])
      const end = toFormatted(dv[1])
      if (start !== undefined && end !== undefined) return [start, end]
    }
    return undefined
  } else {
    const dv = props.defaultValue as any
    if (Array.isArray(dv)) return undefined
    const val = toFormatted(dv)
    return val
  }
})

const innerValue = ref<any>(undefined)
const hasInitDefault = ref(false)

const getModelValue = computed({
  get: () => {
    if (isRangeTypeComputed.value) {
      const mv = props.modelValue as any
      if (Array.isArray(mv) && mv.length === 2) return mv
      if (innerValue.value !== undefined) return innerValue.value
      return undefined as any
    } else {
      const mv = props.modelValue as any
      const hasMv = mv !== undefined && mv !== null && mv !== ''
      if (hasMv) return mv
      if (innerValue.value !== undefined) return innerValue.value
      return mv
    }
  },
  set: (val) => {
    innerValue.value = val
    emit('update:modelValue', val)
    formItem?.validate('change').catch((err) => debugWarn(err))
  },
})

const getRangeProps = computed(() => {
  return {
    ...props,
    showCalendarIcon: props.showCalendarIcon ?? true,
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
    ...getRangeProps.value,
    hasIcon: true,
  }
})

const isFocus = (focus: boolean) => {
  if (focus) {
    emit('focus')
  } else {
    emit('blur')
  }
}

const focus = () => {
  datePickerRef.value.addFocusClass()
}

const blur = () => {
  datePickerRef.value.removeFocusClass()
}

onMounted(() => {
  const isRangeType = isRangeTypeComputed.value
  const mv = props.modelValue as any
  const hasModel = isRangeType
    ? Array.isArray(mv) && mv.length === 2
    : mv !== undefined && mv !== null && mv !== ''

  if (!hasModel && normalizedDefaultValue.value !== undefined && !hasInitDefault.value) {
    innerValue.value = normalizedDefaultValue.value
    hasInitDefault.value = true
    emit('update:modelValue', normalizedDefaultValue.value)
    formItem?.validate('change').catch((err) => debugWarn(err))
  }
})

watch(
  () => props.defaultValue,
  (nv) => {
    const isRangeType = isRangeTypeComputed.value
    const mv = props.modelValue as any
    const hasModel = isRangeType
      ? Array.isArray(mv) && mv.length === 2
      : mv !== undefined && mv !== null && mv !== ''
    if (!hasModel && !hasInitDefault.value && nv !== undefined && nv !== null) {
      const val = normalizedDefaultValue.value
      if (val !== undefined) {
        innerValue.value = val
        hasInitDefault.value = true
        emit('update:modelValue', val)
        formItem?.validate('change').catch((err) => debugWarn(err))
      }
    }
  },
)

defineExpose({
  focus: focus,
  blur: blur,
})
</script>

<style scoped></style>
