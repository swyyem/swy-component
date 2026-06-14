<script setup lang="ts">
import type { ProFieldPropsType, ProFieldControlInstance, ProFieldInstance } from './index.type'
import { useSlots, h, ref } from 'vue'
import type { Slots, VNode } from 'vue'
import { getComponentMap } from './utils' // 引入获取组件映射的方法

// 添加组件名称
defineOptions({
  name: 'ProField',
})
type MergePropsType = ProFieldPropsType & {
  'onKeydown:enter'?: () => void
}
const slots: Slots = useSlots()
// 使用 withDefaults 定义默认值并确保类型正确
const props = withDefaults(defineProps<ProFieldPropsType>(), {
  valueType: 'text',
  mode: 'edit',
  fieldProps: {},
  emptyText: '',
})

// 获取全局组件映射，已包含内置组件
const componentMap = getComponentMap()
const emit = defineEmits(['update:modelValue', 'update:option', 'keydown:enter'])

// 创建一个 ref 来存储子组件的 ref
const childRef = ref(null)
const selfRef = ref<ProFieldControlInstance>()

const defaultRenderText = (props: ProFieldPropsType): VNode => {
  const Component = componentMap[props.valueType || 'text']
  // 属性
  const compProps = {
    ...props.fieldProps,
    modelValue: props.modelValue, // 传递 modelValue
    'onUpdate:modelValue': (value: unknown) => {
      emit('update:modelValue', value) // 触发父组件更新
    },
    'onUpdate:option': (option: unknown) => {
      emit('update:option', option) // 触发父组件更新
    },
  }
  // 只有 selectEnhance 组件才放在 fieldProps 上
  if (props.valueType === 'selectEnhance') {
    compProps['onKeydown:enter'] = () => {
      emit('keydown:enter')
    }
  }
  const mergeProps = {
    ...props,
    fieldProps: compProps,
    ref: selfRef, // 绑定 ref
    childRef: childRef,
  } as MergePropsType
  // 其他的放在 props 上
  if (props.valueType !== 'selectEnhance') {
    mergeProps['onKeydown:enter'] = () => {
      emit('keydown:enter')
    }
  }
  // 渲染的组件
  const components = h(Component, mergeProps, slots)

  // 处理自定义只读渲染
  if (props.mode === 'read' && props.render) {
    return props.render(props.modelValue, compProps)
  }

  // 处理自定义编辑渲染
  if (props.mode === 'edit' && props.renderFormItem) {
    return props.renderFormItem(props.modelValue, compProps, components)
  }

  return components
}

// 使用 computed 计算渲染的 DOM
const renderComponent = () => {
  return defaultRenderText(props)
}

// 暴露 childRef
defineExpose<ProFieldInstance>({
  childRef: selfRef.value?.childRef || childRef,
  getControlRef: () => {
    if (selfRef.value) {
      return selfRef.value.getChild?.() || selfRef.value.childRef?.value
    }
    return childRef.value
  },
  getText: (v: any) => {
    if (selfRef.value && selfRef.value.getText) {
      return selfRef.value.getText(v)
    }
    return v
  },
})
</script>

<template>
  <component :is="renderComponent()" />
</template>
