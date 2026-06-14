<script setup lang="ts">
import { ProFormField, ProField } from '../index'
import { unref, h, computed, useSlots, type Ref, type VNode, type ComputedRef } from 'vue'
import type { Slots } from 'vue' // 导入 Slots 类型
import type { FiledForm } from '../form/form.types'
import { getProFormFieldInitProps, getProFormFieldProps } from './utils'

type ProFormCustom = FiledForm & {
  custom?: boolean
}

const props = withDefaults(
  defineProps<ProFormCustom>(),
  getProFormFieldInitProps({
    custom: false,
  }),
) as ProFormCustom
const slots: Slots = useSlots() // 添加类型注解

const ProFormFieldProps: Ref<ProFormCustom> = computed(() => {
  return getProFormFieldProps(props)
})

const ProFieldProps = computed(() => {
  return {
    valueType: props.valueType,
    renderFormItem: props.renderFormItem,
    render: props.render,
    debounceTime: props.debounceTime,
  }
})

// 使用 computed 计算渲染的 DOM，添加类型注解
const renderedDom: ComputedRef<VNode> = computed(() => {
  return h(
    ProFormField,
    unref(ProFormFieldProps),
    props.custom
      ? slots
      : () => {
          return h(ProField, unref(ProFieldProps), slots)
        },
  )
})
</script>

<template>
  <component :is="renderedDom" />
</template>

<style scoped></style>
