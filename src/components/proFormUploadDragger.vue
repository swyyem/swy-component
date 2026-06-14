<script setup lang="ts">
import { ProFormField, ProField } from '../index'
import type { PropFormFieldProps } from '../form/form.types'
import type { ProFieldPropsType } from '../proField/index.type'
import { unref, h, computed, useSlots, type Ref, type VNode, type ComputedRef } from 'vue'
import type { Slots } from 'vue' // 导入 Slots 类型
import { ElIcon } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import { getProFormFieldInitProps, getProFormFieldProps, getProFieldProps } from './utils'

type FormUploadDraggerProps = PropFormFieldProps & Omit<ProFieldPropsType<'upload'>, 'valueType'>
// showMessage 如果不设置默认值 true，则会被设置成 false
const props = withDefaults(
  defineProps<FormUploadDraggerProps>(),
  getProFormFieldInitProps({
    labelWidth: '',
    labelPosition: '',
    inlineMessage: '',
    mode: 'edit',
    fieldProps: {},
    title: '单击或拖动文件到此区域进行上传',
    description: '支持单次或批量上传',
  }),
) as FormUploadDraggerProps

const ProFormFieldProps: Ref<PropFormFieldProps> = computed(() => {
  return getProFormFieldProps<'upload'>(props, {
    drag: true,
    multiple: true,
  })
})

const ProFieldProps: Ref<ProFieldPropsType> = computed(() => {
  return getProFieldProps(props, 'upload', {
    title: props.title,
    icon: props.icon,
  })
})

const renderSolts = () => {
  return () => [
    h(
      ElIcon,
      {
        style: {
          color: '#1677FF',
          fontSize: '2em',
        },
      },
      () => h(props.icon || UploadFilled),
    ),
    h(
      'p',
      {
        style: {
          margin: '0 0 4px',
          color: 'rgba(42, 46, 54, 0.88)',
          fontSize: '1.1em',
        },
      },
      props.title,
    ),
    h(
      'p',
      {
        style: {
          color: 'rgba(42, 46, 54, 0.45)',
          fontSize: '1em',
        },
      },
      props.description,
    ),
  ]
}

const slots: Slots = useSlots() // 添加类型注解
const hasSlots = Object.keys(slots || {}).length > 0
// console.log('slotsslots', slots, hasSlots)

// 使用 computed 计算渲染的 DOM，添加类型注解
const renderedDom: ComputedRef<VNode> = computed(() => {
  return h(ProFormField, unref(ProFormFieldProps), () => {
    // 正确传递插槽内容
    return h(ProField, unref(ProFieldProps), hasSlots ? slots : renderSolts())
  })
})
</script>
<template>
  <component :is="renderedDom" />
</template>

<style scoped></style>
