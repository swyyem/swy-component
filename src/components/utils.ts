import type { PropFormFieldProps } from '../form/form.types'
import type {
  ProFieldPropsType,
  ProFieldValueType,
  ProFieldValueTypeWithFieldProps,
} from '../proField/index.type'
import type { Component } from 'vue'
import { registerComponent } from '../proField/utils'

import {
  ProFormText,
  ProFormPassWord,
  ProFormTextArea,
  ProFormDigit,
  ProFormAutocomplete,
  ProFormInputNumber,
  ProFormSelect,
  ProFormRadio,
  ProFormRate,
  ProFormSlider,
  ProFormCascader,
  ProFormColorPicker,
  ProFormSegmented,
  ProFormInputTag,
  ProFormMention,
  ProFormSelectV2,
  ProFormTimePicker,
  ProFormTimeSelect,
  ProFormTreeSelect,
  ProFormUploadButton,
  ProFormUploadDragger,
  ProFormCheckbox,
  ProFormSwitch,
  ProFormDatePicker,
  ProFormDateTimePicker,
  ProFormDateRangePicker,
  ProFormDateTimeRangePicker,
  ProFormSelectEnhance,
  ProFormInputPrice,
  ProFormTable,
} from './index'
import FormList from '../proFormList/index'
import Group from '../form/formGroup.vue'

export function getProFormFieldInitProps(params?: any) {
  const addProps = params || {}
  return {
    showMessage: undefined,
    hasLabelSpace: undefined,
    required: undefined,
    colon: undefined,
    ...addProps,
  }
}

export const getProFormFieldProps = <
  T extends keyof ProFieldValueTypeWithFieldProps,
>(
  props: PropFormFieldProps,
  fieldProps?: Partial<ProFieldValueTypeWithFieldProps[T]>,
) => {
  const lastFieldProps = fieldProps || {}
  return {
    name: props.name,
    effects: props.effects,
    layout: props.layout,
    label: props.label,
    labelWidth: props.labelWidth,
    labelPosition: props.labelPosition,
    required: props.required,
    rules: props.rules,
    error: props.error,
    validateStatus: props.validateStatus,
    inlineMessage: props.inlineMessage,
    showMessage: props.showMessage,
    size: props.size,
    for: props.size,
    colon: props.colon,
    hasLabelSpace: props.hasLabelSpace,
    display: props.display,
    request: props.request,
    mode: props.mode,
    fieldProps: { ...props.fieldProps, ...lastFieldProps },
    params: props.params,
    valueEnum: props.valueEnum,
    onValueChange: props.onValueChange,
  }
}

export const getProFieldProps = (
  props: ProFieldPropsType,
  valueType: ProFieldValueType,
  params?: any,
) => {
  const addProps = params || {}
  return {
    valueType,
    renderFormItem: props.renderFormItem,
    render: props.render,
    debounceTime: props.debounceTime,
    ...addProps,
  }
}

export const defaultComponentMap: Record<string, Component> = {
  text: ProFormText,
  // TODO: 暂时保留
  passWord: ProFormPassWord,
  textArea: ProFormTextArea,
  password: ProFormPassWord,
  textarea: ProFormTextArea,
  digit: ProFormDigit,
  autocomplete: ProFormAutocomplete,
  inputNumber: ProFormInputNumber,
  select: ProFormSelect,
  radio: ProFormRadio,
  rate: ProFormRate,
  slider: ProFormSlider,
  cascader: ProFormCascader,
  colorPicker: ProFormColorPicker,
  segmented: ProFormSegmented,
  inputTag: ProFormInputTag,
  mention: ProFormMention,
  selectV2: ProFormSelectV2,
  timePicker: ProFormTimePicker,
  timeSelect: ProFormTimeSelect,
  treeSelect: ProFormTreeSelect,
  uploadButton: ProFormUploadButton,
  upload: ProFormUploadButton,
  uploadDragger: ProFormUploadDragger,
  checkbox: ProFormCheckbox,
  switch: ProFormSwitch,
  datePicker: ProFormDatePicker,
  dateTimePicker: ProFormDateTimePicker,
  dateRangePicker: ProFormDateRangePicker,
  dateTimeRangePicker: ProFormDateTimeRangePicker,
  formList: FormList,
  group: Group,
  option: ProFormSelect,
  selectEnhance: ProFormSelectEnhance,
  price: ProFormInputPrice,
  table: ProFormTable,
}

const componentMap: Record<string, Component> = { ...defaultComponentMap }

/**
 * 检查组件是否已注册，并输出错误
 * @param name 组件名称
 */
const checkComponentRegistration = (name: string): boolean => {
  if (componentMap[name]) {
    console.error(
      `Component "${name}" is already registered. It will be overwritten.`,
    )
    return false
  }
  return true
}

/**
 * 注册单个组件
 * @param name 组件名称
 * @param component 组件实例
 */
const registerSingleComponent = (name: string, component: Component): void => {
  if (!name || !component) {
    console.error('Component name and component are required.')
    return
  }
  checkComponentRegistration(name)
  // 允许覆盖
  componentMap[name] = component
}

/**
 * 注册组件
 * @param param 组件名称（字符串）或组件对象（键值对）
 * @param component 组件实例（当 param 为字符串时必填）
 */
export const registerFieldComponent = (
  param: string | Record<string, Component>,
  component?: Component,
): void => {
  if (!param) {
    console.error('Param is required.')
    return
  }

  if (typeof param === 'string') {
    // 处理单个组件注册
    if (!component) {
      console.error('Component is required when param is a string.')
      return
    }
    registerSingleComponent(param, component)
  } else if (typeof param === 'object' && !Array.isArray(param)) {
    // 处理批量组件注册
    Object.entries(param).forEach(([name, comp]) => {
      registerSingleComponent(name, comp)
    })
  } else {
    console.error('Invalid param type. Expected a string or an object.')
  }

  registerComponent(param, component)
}

/**
 * 获取组件映射，包含内置的组件
 */
export const getComponentMap = () => {
  return componentMap
}
