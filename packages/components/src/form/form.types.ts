/* eslint-disable @typescript-eslint/no-explicit-any */
import type { VNode, Ref } from 'vue'
import type {
  ButtonProps,
  FormProps,
  FormItemProps,
  FormValidationResult,
  FormValidateCallback,
} from 'element-plus'
import type {
  ProFieldPropsType,
  ProSchemaValueEnumType,
  ProFieldInstance,
} from '../proField/index.type'
import type { Responsive } from '../grid/grid.types'
import type { ProFormListProps } from '../proFormList/index.types'
import type { ProComponentObject } from '../common.types'

export type ProFormFieldValue = any
export type ProFormValueType = Record<string, ProFormFieldValue>
export type DisplayEnum = 'none' | 'visible' | 'hidden'

export type ProFieldValueTypeWithFieldComponentProps = {
  text: FiledForm
  passWord: FiledForm
  textArea: FiledForm
  digit: FiledForm
  autocomplete: FiledForm
  inputNumber: FiledForm
  select: FiledForm
  radio: FiledForm
  rate: FiledForm
  slider: FiledForm
  cascader: FiledForm
  colorPicker: FiledForm
  segmented: FiledForm
  inputTag: FiledForm
  mention: FiledForm
  selectV2: FiledForm
  timePicker: FiledForm
  timeSelect: FiledForm
  treeSelect: FiledForm
  uploadButton: FiledForm
  uploadDragger: FiledForm
  checkbox: FiledForm
  switch: FiledForm
  datePicker: FiledForm
  dateTimePicker: FiledForm
  dateRangePicker: FiledForm
  dateTimeRangePicker: FiledForm
  formList: ProFormListProps
  group: FiledForm
  option: FiledForm // 仅做 table 中的操作判断
  table: FiledForm // 表格类型
}
export type ProFieldComponentValueType =
  | Extract<keyof ProFieldValueTypeWithFieldComponentProps, unknown>
  | (string & {})

export type ProEffectContextObject = {
  value: any
  rules: FormItemProps['rules']
  option?: ProSchemaValueEnumType | ProSchemaValueEnumType[]
}
export type EffectCallbackType = (k: string, v: any) => void
export type EffectContextType = {
  $self: ProEffectContextObject
  $target: ProEffectContextObject | ProEffectContextObject[]
}
type TriggerType = 'change' | 'blur'
export type EffectType = {
  /** 触发方式 */
  trigger?: TriggerType
  /** 将改变的字段名 */
  target: string | string[]
  /** ProFormField 的属性配置 */
  decorator?: {
    display?: string | ((ctx: EffectContextType, value: ProFormValueType) => DisplayEnum)
    value?: string | ((ctx: EffectContextType, value: ProFormValueType) => any)
    required?: string | ((ctx: EffectContextType, value: ProFormValueType) => boolean)
    rules?: string | ((ctx: EffectContextType, value: ProFormValueType) => FormItemProps['rules'])
    valueEnum?: string | ((ctx: EffectContextType, value: ProFormValueType) => any[])
  }
  /** ProFormField 内子组件的配置 */
  component?: Partial<Record<string, string | ((ctx: EffectContextType) => any)>>
  /** 异步一对多的场景 */
  batchLogic?: (
    v: ProFormFieldValue,
    methods: {
      getValue: (key: string) => ProFormFieldValue
      setFormValues: (data: ProFormValueType) => void
    },
  ) => any
}

export type ProFormInstance<T extends ProComponentObject = ProComponentObject> = {
  /** 表单中和 getFormValues 一致，编辑表格中会返回内部的 key */
  getFormFullValues: () => T
  /** 表单的值 */
  getFormValues: () => T
  /** 设置表单的值，isCover 是否覆盖，默认不覆盖 */
  setFormValues: (data: T, isCover?: boolean) => void
  /** 删除传入的值 */
  removeFormValues: (data: T) => void
  /** 表单校验方法 */
  validate: (cb?: FormValidateCallback) => FormValidationResult
  /** 表单重置 */
  resetFields: () => void
  /** 调用 onSubmit */
  submit: () => Promise<any>
  /** 调用 onReset */
  reset: (e: MouseEvent) => void
  /** 表单值是否有修改 */
  hasEditorStatus: () => boolean
  /** 获取表单所有组件的实例 */
  getFormInstances: () => Record<string, any>[]
}

export type PropFormFieldProps = Partial<Omit<FormItemProps, 'prop'>> &
  Pick<ProFieldPropsType, 'mode' | 'fieldProps' | 'valueEnum' | 'request'> & {
    /** 键名，同 formItem 的 prop */
    name: string | string[]
    /** 表单项联动配置 */
    effects?: EffectType[]
    /** 隐藏 label */
    hasLabelSpace?: boolean
    /** 仅做布局使用 */
    layout?: boolean
    /** values 中的 key，和 ProField 的 params 不一致 */
    params?: string | string[]
    /** 提示 */
    tooltip?: string
    /** 表单项的初始值 */
    initialValue?: any
    /**
     * columns json配置
     */
    columns?: FiledForm[]
    colProps?: Responsive
    /** label 后的冒号 */
    colon?: boolean
    /** profield 空态 */
    emptyText?: string
    /** 控制显示 */
    display?: DisplayEnum
    /** 设置控件是否获得焦点，用于 table edit 场景 */
    immFocus?: boolean
    /** 是否校验通过才能触发回车 */
    validateBeforeEnter?: boolean
    /** value 变化的回调 */
    onValueChange?: (value: any) => void
  } & { [key: string]: any }

export type SearchConfig = {
  /** 重置按钮的文本 */
  resetText?: string | VNode
  /** 提交按钮的文本 */
  submitText?: string | VNode
}

export type SubmitterProps<T = ProFormValueType> = {
  align?: 'left' | 'center' | 'right'
  /** 提交方法 */
  onSubmit?: () => void
  /** 重置方法 */
  onReset?: (e: MouseEvent) => void
  /** 搜索的配置，一般用来配置文本 */
  searchConfig?: SearchConfig
  /** 提交按钮的 props */
  submitButtonProps?: false | Partial<ButtonProps>
  /** 重置按钮的 props */
  resetButtonProps?: false | Partial<ButtonProps>
  /** 自定义操作的渲染 */
  render?:
    | ((
        props: SubmitterProps &
          T & {
            submit: () => void
            reset: (e: MouseEvent) => void
          },
        doms: VNode[],
      ) => VNode[] | VNode | false)
    | false
}
type SelectOption = {
  label: string
  value: string | number | boolean
}
type BaseFormSchemaProperties = {
  label?: string
  component: string
  componentProps?: Record<string, any>
  rules?: object[]
  effects?: object[]
  options?: SelectOption[]
}
// 基础类型的属性
type PrimitiveProperties = BaseFormSchemaProperties & {
  type: 'string' | 'number' | 'boolean'
  properties?: never
}
// 复杂类型的属性（必须包含 properties）
type ComplexProperties = BaseFormSchemaProperties & {
  type: 'object' | 'array' | 'void'
  properties: {
    [key: string]: FormSchemaProperties
  }
}
type FormSchemaProperties = PrimitiveProperties | ComplexProperties
export type ProFormFieldJson = {
  type: 'object' | 'array' | 'void'
  properties: {
    [key: string]: FormSchemaProperties
  }
}
export type ProFormPromiseReturn = Promise<any>
export interface ProFormProps<T extends ProComponentObject = ProComponentObject>
  extends
    Partial<Omit<FormProps, 'model'>>,
    Pick<ProFieldPropsType, 'mode'>,
    Pick<PropFormFieldProps, 'colon' | 'emptyText'> {
  /** 标签 v-model */
  modelValue?: T
  /** JSON 配置生成表单项 */
  columns?: FiledForm[]
  /** 表单初始值 */
  initialValues?: T
  /** 表单请求数据的方法 */
  request?: (params: ProFormValueType) => ProFormPromiseReturn
  /** 请求参数 */
  params?: ProFormValueType
  /** 是否忽略空值 */
  omitNil?: boolean
  /** 是否自动聚焦第一个输入框 */
  autoFocusFirstInput?: boolean
  /** 提交按钮配置 */
  submitter?: SubmitterProps | false
  /** 是否为搜索表单 */
  searchForm?: boolean
  /** 是否显示搜索按钮 */
  searchBtn?: boolean
  /** 表单标题 */
  formTitle?: string
  /** 表单标题样式 */
  formTitleClass?: string
  /** field 错误提示方式 */
  fieldErrorType?: 'icon' | 'tip'
  /** 初始化时执行 effects，支持定制 */
  initEffect?: boolean | string[]
  /** 是否grid布局 */
  grid?: boolean
  /** 栅格间隔 */
  gutter?: number
  /** 表单列限制 */
  colLimit?: number
  /** 格式化表单的值 */
  formatValue?: (value: T) => T
  /** 开启键盘 enter 跳转下一个 */
  keyboard?: boolean
  /** 开启键盘后，指定回车跳转的顺序，默认 fieldForm 的书写顺序 */
  keyboardColumnKeys?: string[]
}

export interface ProFormEmits<T extends ProComponentObject = ProComponentObject> {
  /** 配合 v-model 的值回调 */
  (e: 'update:modelValue', val: T): void
  /** 重置按钮的回调 */
  (e: 'reset', v: MouseEvent): void
  /** 提交按钮的回调，传入 form 的 value */
  (e: 'submit', v: T): void | ProFormPromiseReturn
  /** 和 submit 的区别在于，finish 是在 form 校验通过后执行 */
  (e: 'finish', v: T): void | ProFormPromiseReturn
  /** form 校验失败的回调 */
  (e: 'finishFailed', v: T): void
  /** form 中任何值变化后的回调 */
  (e: 'valuesChange', v: T, allValues: T): void
  /** form 初始化后的回调 */
  (e: 'init', v: T, form: ProFormInstance<T>): void
}

export type ProFormEvents<T extends ProComponentObject = ProComponentObject> = {
  onReset?: (v: MouseEvent) => void
  onSubmit?: (v: T) => void | ProFormPromiseReturn
  onFinish?: (v: T) => void | ProFormPromiseReturn
  onFinishFailed?: (v: T) => void
  onValuesChange?: (v: T, allValues: T) => void
  onInit?: (v: T, form: ProFormInstance<T>) => void
}

export type ProFormInjectEvents = {
  onKeydownEnter?: (key: string) => void
}

export type GroupProps = {
  labelPosition: 'left' | 'right' | 'top'
  labelWidth: string
  labelSuffix: string
  inline: boolean
  colon?: boolean
  emptyText?: string
  fieldErrorType: string
  initEffect: boolean
  grid: boolean
}

export type FormJsonType = {
  inline?: boolean
  columns?: FiledForm[]
}

export type FiledForm = PropFormFieldProps &
  Omit<ProFieldPropsType, 'mode' | 'fieldProps' | 'valueEnum' | 'request' | 'valueType'> & {
    valueType?: ProFieldComponentValueType
  }

export type ProFormFieldInstance = {
  getFieldRef: () => Ref<ProFieldInstance | undefined>
}

export type ProFormColumnKeyResult = {
  [key: string]: string | ProFormColumnKeyResult[]
}
