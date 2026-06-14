<script setup lang="ts">
// import type { ProFieldValueTypeWithFieldComponentProps } from '../proField/index.type'
import type { FiledForm } from '../form/form.types'
import { computed, useSlots, h, type VNode, type ComputedRef } from 'vue'
import type { Slots } from 'vue' // 导入 Slots 类型
import { getComponentMap, defaultComponentMap } from '../components/utils'
import { ProFormCustom } from '../components/index'
// 添加组件名称
defineOptions({
  name: 'FieldsComponent',
})
const slots: Slots = useSlots()
const props = withDefaults(defineProps<FiledForm>(), {
  showMessage: undefined,
  colon: undefined,
  hasLabelSpace: undefined,
})

const defaultRenderText = (props: FiledForm): VNode => {
  // 获取全局组件映射，已包含内置组件
  const componentMap = getComponentMap()
  const Component = componentMap[props.valueType || 'text']
  if (props?.valueType && props.valueType in defaultComponentMap) {
    const components = h(Component, props, slots)
    return components
  } else {
    return h(ProFormCustom, props, () => {
      return h(Component, {}, slots)
    })
  }
}

// 使用 computed 计算渲染的 DOM
const renderedDom: ComputedRef<VNode> = computed(() => {
  return defaultRenderText(props)
})
</script>

<template>
  <component :is="renderedDom" />
</template>
