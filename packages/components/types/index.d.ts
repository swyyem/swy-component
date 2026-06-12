import { DefineComponent, Ref, ComputedRef, Component } from 'vue'
import type {
  ElInput,
  ElInputNumber,
  ElSelect,
  ElCheckbox,
  ElSwitch,
  ElDatePicker,
  ElTable,
  ElForm,
  ElDialog,
  ElButton,
  ElRow,
  ElCol,
  ElTransfer,
  ElRate,
  ElSlider,
  ElColorPicker,
  ElPopconfirm,
  ElIcon,
} from 'element-plus'

// ProField 相关类型
export type ProFieldMode = 'edit' | 'read'
export type ProFieldValueType =
  | 'text'
  | 'inputNumber'
  | 'select'
  | 'datePicker'
  | 'checkbox'
  | 'switch'
  | 'rate'
  | 'slider'
  | 'colorPicker'

export interface ProFieldProps {
  mode?: ProFieldMode
  valueType?: ProFieldValueType
  modelValue?: any
  placeholder?: string
  emptyText?: string
  fieldProps?: Record<string, any>
  valueEnum?: Array<{ label: string; value: any }>
}

export declare const ProField: DefineComponent<ProFieldProps>
export declare const ProText: DefineComponent<ProFieldProps>

// ProForm 相关类型
export interface ProFormProps {
  model?: Record<string, any>
  columns?: ProColumnOptions<any>[]
  [key: string]: any
}

export declare const ProForm: DefineComponent<ProFormProps>
export declare const ProFormField: DefineComponent<ProFormProps>
export declare const ModalForm: DefineComponent<ProFormProps>
export declare const UploadForm: DefineComponent<ProFormProps>
export declare const DrawerForm: DefineComponent<ProFormProps>

// ProTable 相关类型
export interface ProColumnOptions<T = any> {
  title?: string
  label?: string
  field?: string
  prop?: string
  dataIndex?: string
  type?: string
  align?: 'left' | 'center' | 'right'
  width?: number | string
  [key: string]: any
}

export interface ProTableProps<T = any> {
  columns?: ProColumnOptions<T>[]
  dataSource?: T[]
  request?: (...args: any[]) => Promise<any>
  pagination?: boolean | Record<string, any>
  [key: string]: any
}

declare const _ProTable: DefineComponent<ProTableProps>
export default _ProTable
export { _ProTable as ProTable }
export type { ProColumnOptions as ProColumn }

// ProSelect 相关类型
export interface ProOption {
  label: string
  value: any
  [key: string]: any
}

export interface ProSelectProps {
  modelValue?: any
  options?: ProOption[]
  [key: string]: any
}

export declare const ProSelect: DefineComponent<ProSelectProps>
export declare const ProOption: DefineComponent<ProOption>

// ProTransfer
export interface ProTransferProps {
  modelValue?: any[]
  dataSource?: any[]
  [key: string]: any
}

export declare const ProTransfer: DefineComponent<ProTransferProps>

// ProDialog
export interface ProDialogProps {
  visible?: boolean
  title?: string
  width?: string | number
  [key: string]: any
}

export declare const ProDialog: DefineComponent<ProDialogProps>
export declare const ProFormDialog: DefineComponent<ProDialogProps>

// QueryFilter
export interface QueryFilterProps {
  model?: Record<string, any>
  columns?: ProColumnOptions<any>[]
  [key: string]: any
}

export declare const QueryFilter: DefineComponent<QueryFilterProps>

// ActionButton
export interface ActionButtonProps {
  label?: string
  onClick?: (...args: any[]) => void
  [key: string]: any
}

export declare const ActionButton: DefineComponent<ActionButtonProps>

// ProDatePicker
export interface ProDatePickerProps {
  modelValue?: string | Date
  placeholder?: string
  [key: string]: any
}

export declare const ProDatePicker: DefineComponent<ProDatePickerProps>

// ProInputTag
export interface ProInputTagProps {
  modelValue?: string[]
  placeholder?: string
  [key: string]: any
}

export declare const ProInputTag: DefineComponent<ProInputTagProps>

// ProTool
export declare const ProTool: Component

// ProFormList
export interface ProFormListProps {
  name?: string
  children?: any
  [key: string]: any
}

export declare const ProFormList: DefineComponent<ProFormListProps>

// 内置包装组件
export declare const ProInnerInput: DefineComponent
export declare const ProInnerInputNumber: DefineComponent
export declare const ProInnerCheckbox: DefineComponent
export declare const ProInnerSelect: DefineComponent
export declare const ProInnerInputPrice: DefineComponent
export declare const ProInnerDatePicker: DefineComponent
export declare const ProInnerSelectEnhance: DefineComponent

// ProInternalAddPrefix
export declare const ProInternalAddPrefix: DefineComponent

// ProTableCellProvide
export declare const ProTableCellProvide: Component

// HisColumn (ProColumn 别名)
export declare const HisColumn: DefineComponent<ProColumnOptions>

// registerComponent / registerFieldComponent
export function registerFieldComponent(
  name: string,
  component: Component,
  options?: Record<string, any>
): void

export const registerComponent: typeof registerFieldComponent

// 导出 element-plus 所有组件和类型
export * from 'element-plus'
export type * from 'element-plus'
