<script setup lang="ts">
import { ProFormField, ProField } from '../index'
import type { PropFormFieldProps } from '../form/form.types'
import type { ProFieldPropsType } from '../proField/index.type'
import { unref, h, computed, useSlots, type Ref, type VNode, type ComputedRef } from 'vue'
import type { Slots } from 'vue' // 导入 Slots 类型
import { getProFormFieldInitProps, getProFormFieldProps, getProFieldProps } from './utils'

type FormUploadProps = PropFormFieldProps & Omit<ProFieldPropsType<'upload'>, 'valueType'>
const props = withDefaults(
  defineProps<FormUploadProps>(),
  getProFormFieldInitProps(),
) as FormUploadProps

const ProFormFieldProps: Ref<PropFormFieldProps> = computed(() => {
  return getProFormFieldProps<'upload'>(props)
})

const ProFieldProps: Ref<ProFieldPropsType> = computed(() => {
  return getProFieldProps(props, 'upload')
})

const slots: Slots = useSlots() // 添加类型注解

// 使用 computed 计算渲染的 DOM，添加类型注解
const renderedDom: ComputedRef<VNode> = computed(() => {
  return h(ProFormField, unref(ProFormFieldProps), () => {
    // 正确传递插槽内容
    return h(ProField, unref(ProFieldProps), slots)
  })
})
</script>
<template>
  <component :is="renderedDom" />
</template>

<style scoped></style>
