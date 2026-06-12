<template>
  <div class="el-date-editor el-input" :style="setStyle" :class="{ 'is-disabled': getDisabled }">
    <div
      class="keyboard-date-wrapper"
      tabindex="-1"
      :class="[dateStyle, { 'is-focus': isFocus }]"
      @focus="addFocusClass"
      @blur="removeFocusClass"
    >
      <div class="custom-date-input">
        <input
          ref="inputRef"
          class="date-input el-input__inner"
          :style="{ ...setStyle }"
          :value="displayValue"
          :disabled="getDisabled"
          @input="onInput"
          @keydown="handleKeydown"
          @focus="handleFocus"
          @blur="removeFocusClass"
          @mouseup="handleMouseSetActivePart"
          :placeholder="props.placeholder || ''"
        />
        <span class="icon-wrapper" v-if="props.hasIcon">
          <el-icon
            color="#c0c4cc"
            class="clear-icon"
            :style="setStyle"
            v-show="props.clearable && !getDisabled && getModelValue"
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
      </div>
      <el-date-picker
        ref="pickerRef"
        v-bind="getProps"
        v-model="getModelValue"
        class="calendar-picker"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed, nextTick, useAttrs } from 'vue'
import dayjs, { type Dayjs } from 'dayjs'
import { ElIcon, ElDatePicker } from 'element-plus'
import { Calendar, CircleClose } from '@element-plus/icons-vue'
import type { DateType, ProDatePickerProps } from './datePicker.data'
import {
  updateParts,
  getDynamicPartRange,
  ranges,
  typeFormatMap,
  partMap,
} from './utils/dateHelper'

defineOptions({
  name: 'ProDatePicker',
})

const attrs = useAttrs()

const props = withDefaults(defineProps<ProDatePickerProps>(), {
  hasIcon: true,
  clearable: true,
  showCalendarIcon: true,
})
const emit = defineEmits(['update:modelValue', 'isFocus', 'keydown:enter', 'keydown'])

const getModelValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
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

// const setInputStyle = computed(() => {
//   if (ranges.includes(props.type ?? '')) {
//     return {
//       textAlign: 'center' as unknown as undefined,
//     }
//   }
//   return {}
// })

// 响应式数据
const parts = reactive({
  year: '',
  month: '',
  day: '',
  hour: '',
  minute: '',
  second: '',
})
// 统一 format 获取逻辑
const effectiveFormat = computed(() => props.format || typeFormatMap[props.type ?? 'date'])
const displayValue = computed({
  get() {
    if (!props.modelValue) return ''
    let raw = props.modelValue
    if (Array.isArray(raw)) raw = raw[0] || ''
    if (!['x'].includes(props.valueFormat ?? '')) {
      if (raw instanceof Date) raw = String(raw)
    }
    let date = dayjs(raw, props.valueFormat || effectiveFormat.value)
    if (!date.isValid()) date = dayjs(raw)
    return date.isValid() ? date.format(effectiveFormat.value) : String(raw)
  },
  set(val: string) {
    const date = dayjs(val, effectiveFormat.value)
    if (date.isValid()) {
      if (['x'].includes(props.valueFormat ?? '')) {
        const curVal: number = dayjs(date).valueOf()
        emit('update:modelValue', curVal)
      } else {
        const curVal: string = dayjs(date).format(props.valueFormat || effectiveFormat.value)
        emit('update:modelValue', curVal)
      }
    } else {
      emit('update:modelValue', val)
    }
  },
})
const activePart = ref<DateType | null>(null)
const inputRef = ref<HTMLInputElement>()
const isFocus = ref(false)
const inputBuffer = ref('')
let lastSelection: [number, number] | null = null
const lastValidValue = ref('')
const pickerRef = ref()

// typePartsMap 提前声明
const typePartsMap: Record<string, DateType[]> = {
  year: ['year'],
  years: ['year'],
  yearrange: ['year'],
  month: ['year', 'month'],
  months: ['year', 'month'],
  monthrange: ['year', 'month'],
  date: ['year', 'month', 'day'],
  dates: ['year', 'month', 'day'],
  week: ['year', 'month', 'day'],
  daterange: ['year', 'month', 'day'],
  datetime: ['year', 'month', 'day', 'hour', 'minute', 'second'],
  datetimerange: ['year', 'month', 'day', 'hour', 'minute', 'second'],
}

// 计算属性
const showParts = computed(() => typePartsMap[props.type ?? 'date'] || ['year', 'month', 'day'])
const dateStyle = computed(() => {
  if (ranges.includes(props.type ?? '')) {
    return ''
  }
  return 'el-input el-input__wrapper'
})
const getProps = computed(() => {
  let type = props.type
  if (props.type === 'daterange') type = 'date'
  else if (props.type === 'monthrange') type = 'month'
  else if (props.type === 'yearrange') type = 'year'
  else if (props.type === 'datetimerange') type = 'datetime'

  return {
    ...props,
    valueFormat: props.valueFormat || typeFormatMap[String(props.type)],
    type,
    onChange: attrs.onChange,
    onblur: attrs.onblur,
    onFocus: attrs.onFocus,
    onClear: attrs.onClear,
    calendarChange: attrs.calendarChange,
    panelChange: attrs.panelChange,
    onVisibleChange: attrs.onVisibleChange,
  }
})

// watch
watch(
  getModelValue,
  (newVal) => {
    updateParts(parts, newVal ? String(newVal) : '')
    lastValidValue.value = newVal ? String(newVal) : ''
  },
  { immediate: true },
)
watch(displayValue, () => {
  if (lastSelection !== null && inputRef.value) {
    nextTick(() => {
      inputRef.value?.setSelectionRange(lastSelection![0], lastSelection![1])
    })
  }
})

// 事件处理
function handleFocus(e?: FocusEvent) {
  addFocusClass()

  // 1. 获取输入框当前光标位置
  let cursor = 0
  if (e && e.target && (e.target as HTMLInputElement).selectionStart != null) {
    cursor = (e.target as HTMLInputElement).selectionStart!
  } else if (inputRef.value && inputRef.value.selectionStart != null) {
    cursor = inputRef.value.selectionStart
  }

  // 2. 如果 activePart 不存在，或者光标在字符串末尾（通常是初次聚焦的默认行为）
  // 我们强制跳转到第一个有效分段
  const valLen = displayValue.value?.length || 0

  if (!activePart.value || cursor >= valLen) {
    activePart.value = showParts.value[0]
  } else {
    // 3. 如果是点击中间位置，则根据光标位置计算属于哪个部分
    for (const part of showParts.value) {
      const range = getDynamicPartRange(effectiveFormat.value, part)
      if (!range) continue
      const [start, end] = range
      if (cursor >= start && cursor <= end) {
        activePart.value = part
        break
      }
    }
  }

  // 4. 执行选中
  selectPart()
  ;(attrs.onFocus as (e: Event) => void)?.(e as Event)
}

function onInput(e: Event) {
  const value = (e.target as HTMLInputElement).value
  const isNumber = /^\d+$/.test(value)
  if (isNumber) {
    displayValue.value = (e.target as HTMLInputElement).value
  }
}

const onChange = () => {
  ;(attrs.onChange as (val: string) => void)?.(getModelValue.value as string)
}

function handleKeydown(e: KeyboardEvent) {
  if (getDisabled.value) {
    return
  }
  if (/^[0-9]$/.test(e.key) && activePart.value) {
    handleNumberInput(e)
    return
  }
  if (e.key === 'Backspace' || e.key === 'Delete') {
    handleDeleteKey(e)
    return
  }
  if (
    e.key === 'ArrowLeft' ||
    e.key === 'ArrowRight' ||
    e.key === 'ArrowUp' ||
    e.key === 'ArrowDown'
  ) {
    handleArrowKey(e)
    return
  }
  if (e.key === 'Enter') {
    if (!ranges.includes(props.type ?? '') && getModelValue.value) {
      onChange()
    }
    emit('keydown:enter')
  }
}

const getDisabledData = (date: Dayjs) => {
  if (Reflect.has(props, 'disabledDate')) {
    if (typeof props.disabledDate === 'function') {
      const val = props.disabledDate(date.toDate())
      return val ? true : false
    }
  } else {
    return false
  }
}

function fixZeroMonthDay(input: string): string {
  return input.replace(/-(00)(?=[-\sT]|$)/g, '-01')
}

function handleNumberInput(e: KeyboardEvent) {
  e.preventDefault()
  if (!activePart.value) return // 类型保护，确保不为 null
  let inputValStr = displayValue.value
  if (Array.isArray(inputValStr)) inputValStr = inputValStr[0] || ''
  if (typeof inputValStr !== 'string') inputValStr = String(inputValStr)
  const isFirstYearInput =
    (!inputValStr || /^0+$/.test(inputValStr.replace(/[^0-9]/g, ''))) && activePart.value === 'year'
  inputBuffer.value += e.key
  const range = getDynamicPartRange(effectiveFormat.value, activePart.value)
  if (!range) return
  const [start, end] = range
  let rawVal = displayValue.value
  if (Array.isArray(rawVal)) rawVal = rawVal[0] || ''
  if (typeof rawVal !== 'string') rawVal = String(rawVal)
  let newPart = ''
  if (activePart.value === 'year') {
    newPart = inputBuffer.value.slice(-4).padEnd(4, '0')
    if (isFirstYearInput) {
      const now = dayjs()
      const month = now.format('MM')
      const day = now.format('DD')
      let newVal = newPart
      if (showParts.value.includes('month')) newVal += '-' + month
      if (showParts.value.includes('day')) newVal += '-' + day
      if (showParts.value.includes('hour')) newVal += ' 00'
      if (showParts.value.includes('minute')) newVal += ':00'
      if (showParts.value.includes('second')) newVal += ':00'
      displayValue.value = newVal
      updateParts(parts, newVal)
      selectPart()
      return
    }
  } else {
    newPart = inputBuffer.value.slice(-2).padStart(2, '0')
  }
  const newVal = fixZeroMonthDay(rawVal.slice(0, start) + newPart + rawVal.slice(end))
  const val = getDisabledData(dayjs(newVal, effectiveFormat.value))
  if (val) {
    return
  }
  displayValue.value = newVal
  updateParts(parts, newVal)
  if (
    (activePart.value === 'month' && Number(inputBuffer.value) > 1) ||
    (activePart.value === 'day' && Number(inputBuffer.value) > 3)
  ) {
    inputBuffer.value = ''
    let idx = showParts.value.indexOf(activePart.value)
    if (idx < showParts.value.length - 1) {
      idx = (idx + 1) % showParts.value.length
      activePart.value = showParts.value[idx]
    }
    selectPart()
    return
  }
  if (
    (activePart.value === 'year' && inputBuffer.value.length >= 4) ||
    (activePart.value !== 'year' && inputBuffer.value.length >= 2)
  ) {
    const num = parseInt(newPart)
    let overLimit = false
    if (activePart.value === 'month') {
      if (num > 12 || num < 1) overLimit = true
    } else if (activePart.value === 'day') {
      if (num > 31 || num < 1) overLimit = true
    } else if (activePart.value === 'hour') {
      if (num > 23 || num < 0) overLimit = true
    } else if (activePart.value === 'minute' || activePart.value === 'second') {
      if (num > 59 || num < 0) overLimit = true
    }
    if (overLimit) {
      newPart = ('0' + inputBuffer.value.slice(-1)).slice(-2)
      const fixedVal = rawVal.slice(0, start) + newPart + rawVal.slice(end)
      const val = getDisabledData(dayjs(fixedVal, effectiveFormat.value))
      if (val) {
        return
      }
      displayValue.value = fixedVal
      updateParts(parts, fixedVal)
    }

    inputBuffer.value = ''
    let idx = showParts.value.indexOf(activePart.value)
    if (idx < showParts.value.length - 1) {
      idx = (idx + 1) % showParts.value.length
      activePart.value = showParts.value[idx]
    }
    selectPart()
  } else {
    selectPart()
  }
}

function handleDeleteKey(e: KeyboardEvent) {
  if (getDisabled.value) {
    return
  }
  const input = inputRef.value
  const value = input?.value || ''
  const isAllSelected = input && input.selectionStart === 0 && input.selectionEnd === value.length
  if (!(value && isAllSelected)) {
    e.preventDefault()
    return
  }
  setTimeout(() => {
    if (inputRef.value && inputRef.value.value === '') {
      activePart.value = showParts.value[0]
      lastValidValue.value = ''
      clear()
      setTimeout(() => {
        selectPart()
      }, 0)
    }
  }, 0)
}

function handleArrowKey(e: KeyboardEvent) {
  let idx = showParts.value.indexOf(activePart.value ?? showParts.value[0])
  if (e.key === 'ArrowLeft') {
    e.preventDefault()
    if (idx === 0) {
      emit('keydown', 'left')
      return
    }
    idx = (idx - 1 + showParts.value.length) % showParts.value.length
    activePart.value = showParts.value[idx]
    selectPart()
  } else if (e.key === 'ArrowRight') {
    e.preventDefault()

    if (idx + 1 === showParts.value.length) {
      emit('keydown', 'right')
      return
    }
    idx = (idx + 1) % showParts.value.length
    activePart.value = showParts.value[idx]
    selectPart()
  } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
    e.preventDefault()
    const change = e.key === 'ArrowUp' ? -1 : 1
    const part = activePart.value
    if (part) {
      let rawVal = displayValue.value
      if (Array.isArray(rawVal)) rawVal = rawVal[0] || ''
      if (typeof rawVal !== 'string') rawVal = String(rawVal)
      const dateStr = rawVal
      const format = effectiveFormat.value
      let date = dayjs(dateStr, format)
      if (!date.isValid()) date = dayjs()
      date = date.add(change, partMap[part])
      const val = getDisabledData(date)
      if (val) {
        return
      }
      const newVal = date.format(format)
      displayValue.value = newVal
      updateParts(parts, newVal)
      nextTick(() => {
        selectPart()
      })
      return
    }
  }
}

function handleMouseSetActivePart(e: MouseEvent) {
  let cursor = 0
  if (e && e.target && (e.target as HTMLInputElement).selectionStart != null) {
    cursor = (e.target as HTMLInputElement).selectionStart!
  } else if (inputRef.value && inputRef.value.selectionStart != null) {
    cursor = inputRef.value.selectionStart
  }
  let found = false
  for (const part of showParts.value) {
    const range = getDynamicPartRange(effectiveFormat.value, part)
    if (!range) continue
    const [start, end] = range
    if (cursor >= start && cursor <= end) {
      activePart.value = part
      found = true
      break
    }
  }
  if (!found) {
    activePart.value = showParts.value[0]
  }
  // 延迟设置高亮，确保样式不会被浏览器覆盖
  setTimeout(() => {
    selectPart()
  }, 0)
}

function selectPart() {
  if (getDisabled.value) return
  if (!inputRef.value || !activePart.value) return
  let range = getDynamicPartRange(effectiveFormat.value, activePart.value)
  if (!range) {
    // fallback: 高亮第一个分段
    activePart.value = showParts.value[0]
    range = getDynamicPartRange(effectiveFormat.value, activePart.value)
    if (!range) return
  }
  const [start, end] = range
  lastSelection = [start, end]
  if (document.activeElement !== inputRef.value) {
    inputRef.value.focus()
  }
  if (inputRef.value.selectionStart !== start || inputRef.value.selectionEnd !== end) {
    nextTick(() => {
      inputRef.value?.setSelectionRange(start, end)
    })
  }
}

const clear = () => {
  if (getDisabled.value) {
    return
  }

  getModelValue.value = undefined
  Object.assign(parts, {
    year: '',
    month: '',
    day: '',
    hour: '',
    minute: '',
    second: '',
  })
  displayValue.value = ''
  onChange()
  ;(attrs.onClear as () => void)?.()
}

const togglePicker = () => {
  if (getDisabled.value) {
    return
  }
  pickerRef.value?.handleOpen?.()
}

function addFocusClass() {
  isFocus.value = true
  emit('isFocus', true)
}

function removeFocusClass(e: FocusEvent) {
  isFocus.value = false
  emit('isFocus', false)
  ;(attrs.onBlur as (e: Event) => void)?.(e as Event)
}

defineExpose({
  addFocusClass: handleFocus,
  removeFocusClass,
})
</script>

<style lang="less" scoped>
.is-disabled {
  cursor: not-allowed;
}

.keyboard-date-wrapper {
  flex: 1;
  display: flex;
}

.custom-date-input {
  width: 100%;
  display: flex;
  align-items: center;
  text-align: center;
  // padding: 6px 11px;
  font-size: 14px;
  line-height: 1;
  font-family: inherit;
  color: var(--el-text-color-regular, #606266);
  cursor: text;
  outline: none;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);

  .date-input {
    flex: 1;
    border: none;
    background: transparent;
    font-size: inherit;
    color: inherit;
    padding: 0;
    width: 100%;
  }
}

.custom-date-input .calendar-icon {
  margin-left: 6px;
  font-size: 16px;
  cursor: pointer;
  margin-left: auto;
}

.keyboard-date-wrapper :deep(.el-date-editor) {
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  visibility: hidden;
}

.icon-wrapper {
  display: flex;
  align-items: center;
  margin-left: auto;
}

.clear-icon {
  visibility: hidden;
  opacity: 0;
  cursor: pointer;
  margin-left: auto;
  margin-right: 5px;
}

.custom-date-input:hover .clear-icon {
  visibility: visible;
  opacity: 1;
}

.custom-date-input:hover .calendar-icon {
  margin-left: unset;
}
</style>
