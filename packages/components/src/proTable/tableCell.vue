<template>
  <div
    :class="cellClass"
    :style="props.style"
    @click="props.onClick"
    @dblclick="props.onDoubleClick"
  >
    <RenderCustom :content="domVNode" />
  </div>
</template>
<script lang="ts" setup generic="T extends ProComponentObject">
import { computed, inject, h, toRefs, shallowRef, watch, toRaw, provide } from 'vue'
import type { ComputedRef, CSSProperties, VNode } from 'vue'
import { getValue } from '../utils/value'
import { RenderCustom } from '../utils/renderCustom'
import { omit } from './utils'
import { ProTableCellProvide } from './variable'
import type { ProComponentObject, ProComponentAny } from '../common.types'
import type {
  ProColumn,
  ProTableFieldProps,
  ProCellRendererParams,
  ProTableProviderProps,
  ProTableCellProvideType,
  ProTableGetRowKey,
} from './table.types'
import type { ProTableEditProviderProps } from './proTableEdit.types'
import ProFormField from '../form/formField.vue'
// import type { ProFormFieldInstance } from '../form/form.types'
import ProField from '../proField'
import type { TextSpecifiledProps, ElTextProps } from '../proField/components/text/type'
import type { ProFieldPropsType, ProFieldValueType } from '../proField/index.type'
import { isUndefined, isFunction, isArray } from '../utils'

export type ProTableCellProps<
  T extends ProComponentObject,
  ValueType extends ProFieldValueType = ProFieldValueType,
> = ProCellRendererParams<T> &
  Pick<ProColumn<T>, 'required' | 'editable' | 'cellRenderer' | 'editCellRenderer'> &
  Omit<TextSpecifiledProps, 'copyText'> &
  Pick<ElTextProps, 'lineClamp'> &
  ProTableFieldProps<ValueType> & {
    class?: string
    style?: CSSProperties
    editing?: boolean
    onClick?: () => void
    onDoubleClick?: () => void
    onBlur?: () => void
    'onKeydown:enter'?: () => void
    getRowKey: ProTableGetRowKey<T>
  }

defineOptions({
  name: 'TableCell',
  inheritAttrs: false,
})
const props = defineProps<ProTableCellProps<T>>()
const {
  ellipsis,
  copyable,
  lineClamp,
  tooltip,
  required,
  column,
  getRowKey,
  rowData,
  cellData,
  columns,
  columnIndex,
  rowIndex,
} = toRefs(props)
const realColumn = computed(() => props.column || ({} as ProColumn<T>))
const cellKey = computed(() => props.cellKey || realColumn.value.dataKey!)
const ProTableData = inject<ProTableProviderProps<T>>('ProTableData')
const ProEditTableData = inject<ProTableEditProviderProps<T>>(
  'ProEditTableData',
  {} as ProTableEditProviderProps<T>,
)
const handleValueChange = (value: ProComponentAny) => {
  const onValueChange = realColumn.value.proFieldProps?.onValueChange
  // 修改 table 的值，但不会触发 tableData 的 watch，同一个对象会自动同步
  // setValue(props.rowData, cellKey.value, value)
  ProEditTableData.setEditRecord?.(props.rowData, cellKey.value)
  if (onValueChange) {
    onValueChange(value, props.rowData)
  }
}
const params = computed(() => ({
  cellKey: cellKey.value,
  cellData: cellData.value,
  column: column.value,
  columns: columns.value,
  columnIndex: columnIndex.value,
  rowIndex: rowIndex.value,
  rowData: rowData.value,
}))

const setCurrentRow = (obj: T) => {
  if (obj) {
    // rowData 是响应式对象，覆盖即可
    Object.assign(rowData.value, obj)
  }
}
provide<ProTableCellProvideType<T>>(ProTableCellProvide, {
  currentRow: rowData.value,
  setCurrentRow: setCurrentRow,
})
const mode: ComputedRef<ProFieldPropsType['mode']> = computed(() => {
  return props.editing &&
    (typeof props.editable === 'function' ? props.editable(params.value) : props.editable !== false)
    ? 'edit'
    : 'read'
})
const isCheckbox = computed(() => column.value.valueType === 'checkbox')
const isPrice = computed(() => column.value.valueType === 'price')
const validateBeforeEnter = computed(() => column.value.validateBeforeEnter ?? false)
const rowKeyValue = computed(() => getRowKey.value(rowData.value) as string)
const columnFieldProps = computed(() => ({
  ellipsis: ellipsis.value,
  copyable: copyable.value,
  lineClamp: lineClamp.value,
  required: required.value,
  tooltip: tooltip.value,
  mode: isCheckbox.value ? 'edit' : mode.value,
}))
const rules = computed(() => {
  return typeof column.value.rules === 'function'
    ? column.value.rules(rowKeyValue.value, toRaw(rowData.value))
    : column.value.rules
})
const effects = computed(() => {
  const ief = column.value.effects ? column.value.effects(rowKeyValue.value) : undefined
  return ief
})
// 日期控件
const DateControls = ['datePicker', 'dateTimePicker', 'dateRangePicker', 'dateTimeRangePicker']
const proFieldProps = computed(() => {
  const proFieldProps = column.value.proFieldProps || {}
  // console.log('=proFieldProps=', column.value.dataKey, proFieldProps)
  const omitFieldProps = omit(proFieldProps, ['onValueChange'])
  // const oldKeydown = omitFieldProps.fieldProps?.onKeydown
  const oldBlur = omitFieldProps.fieldProps?.onBlur
  omitFieldProps.fieldProps = {
    ...omitFieldProps.fieldProps,
    onBlur: (e: FocusEvent) => {
      props.onBlur?.()
      oldBlur?.(e)
    },
  }
  // 如果是时间，则隐藏 icon
  if (DateControls.includes(column.value.valueType || '')) {
    omitFieldProps.fieldProps.showCalendarIcon = false
    omitFieldProps.fieldProps.clearable = false
  }
  // 如果是 checkbox，则不需要只读模式
  if (isCheckbox.value && mode.value === 'read') {
    omitFieldProps.fieldProps.readContinue = true
  }
  // 如果是 price
  if (isPrice.value) {
    omitFieldProps.fieldProps.textRight = true
  }
  // 如果fieldProps 上有 extraValueKey，没有 defaultValueEnum，需要处理
  const { extraValueKey, defaultValueEnum, labelKey, valueKey } = omitFieldProps.fieldProps
  if (extraValueKey && labelKey && isUndefined(defaultValueEnum)) {
    const realValue = getValue(rowData.value, extraValueKey)
    if (realValue) {
      // 和 selectEnhance 保持一致
      const realValueKey = valueKey || 'value'
      const values = isArray(realValue) ? realValue : [realValue]
      const res = values.map((item) => ({
        label: isFunction(labelKey) ? labelKey(item) : item[labelKey],
        value: item[realValueKey],
      }))
      omitFieldProps.fieldProps.defaultValueEnum = res
    }
  }
  return omitFieldProps
})
const mergeTextProps = computed(() => {
  return {
    ...proFieldProps.value,
    ellipsis: ellipsis.value,
    copyable: copyable.value,
    lineClamp: lineClamp.value,
  }
})

// 表格导出需要对应的控件实例
const setRef = (ref: ProComponentAny) => {
  if (ref) {
    ProTableData?.setCellRef(cellKey.value, ref)
  }
}
// 编辑态需要从 proFormField 中获取
const setFormRef = (ref: ProComponentAny) => {
  if (ref) {
    const fieldRef = ref.getFieldRef()
    ProTableData?.setCellRef(cellKey.value, fieldRef.value)
  }
}
const dom = () => {
  const dataKey = column.value.dataKey
  // 编辑态统一使用 ProFormField 包裹
  const type = ProTableData?.editableConfig.value?.type
  if (type) {
    const formName = `${rowKeyValue.value}.${dataKey}`
    let dom = h(ProField, {
      key: `${formName}_pro_field`,
      valueType: column.value.valueType,
    })
    if (props.editCellRenderer) {
      dom = props.editCellRenderer(omit(props, ['editCellRenderer', 'cellRenderer', 'render']))
    }
    const title = column.value.title
    const immFocus = type === 'cell' ? true : false
    return h(
      ProFormField,
      {
        ...columnFieldProps.value,
        ...mergeTextProps.value,
        ref: setFormRef,
        key: formName,
        rules: rules.value,
        effects: effects.value,
        label: title,
        hasLabelSpace: false,
        style: { margin: '0' },
        name: formName,
        immFocus,
        validateBeforeEnter: validateBeforeEnter.value,
        onValueChange: handleValueChange,
        'onKeydown:enter': props['onKeydown:enter'],
      },
      {
        default: () => dom,
      },
    )
  }
  let dom = h(ProField, {
    mode: 'read',
    ref: setRef,
    ...mergeTextProps.value,
    valueType: column.value.valueType,
    modelValue: cellData.value,
  })
  if (props.cellRenderer) {
    dom = props.cellRenderer(omit(props, ['editCellRenderer', 'cellRenderer']))
  }
  return dom
}
const domVNode = shallowRef<() => VNode>(() => dom())
watch(
  () => [columnFieldProps.value, mergeTextProps.value, cellData.value],
  () => {
    // console.log('=dataKey=', cellKey.value, cellData.value)
    domVNode.value = dom
  },
)
const cellClass = computed(() => {
  const cClass = mode.value === 'read' ? 'pro-column--read' : ''
  const checkboxClass = realColumn.value.valueType === 'checkbox' ? 'pro-column--checkbox' : ''
  return [props.class, cClass, checkboxClass]
})
// 移除样式 display: 'flex', alignItems: 'center'
</script>
