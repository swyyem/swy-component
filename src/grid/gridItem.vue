<template>
  <template v-if="isShow">
    <component
      :is="isCol ? ElCol : 'div'"
      v-bind="setProps"
      :style="[computedCombinedStyle, style, colStyle]"
    >
      <slot></slot>
    </component>
  </template>
</template>

<script setup lang="ts">
import { computed, inject, ref, useAttrs, watch, provide } from 'vue'
import { ElCol } from 'element-plus'
import type { Responsive, GridConifgType } from './grid.types'
import type { searchFormConfigType } from '../queryFilter/queryFilter.types'

defineOptions({
  name: 'GridItem',
})

const props = withDefaults(
  defineProps<{
    inline?: boolean
    colStyle?: any
    isCol?: boolean
    offset?: number
    span?: number
    suffix?: boolean
    xs?: Responsive
    sm?: Responsive
    md?: Responsive
    lg?: Responsive
    xl?: Responsive
  }>(),
  {
    isCol: true,
    offset: 0,
    suffix: false,
  },
)

const attrs = useAttrs() as { index: string }
const isShow = ref(true)

// 状态管理
const formFieldIsNone = ref(false)
const formFieldIsHidden = ref(false)

// 提供给子组件修改。子组件改了这里，父组件会响应，但子组件本身不会被卸载。
provide('gridItemChildDisplay', { formFieldIsNone, formFieldIsHidden })

const searchFormConfig = inject<searchFormConfigType>('searchFormConfig', {} as any)
const gridConifg = inject<GridConifgType>('gridConifg', {
  breakPoint: ref('xl'),
  shouldHiddenIndex: ref(-1),
  cols: ref(4),
})

// 监听折叠逻辑
watch(
  () => [gridConifg.shouldHiddenIndex.value, gridConifg.breakPoint.value],
  ([hiddenIndex]) => {
    if (!searchFormConfig?.searchBtn || !searchFormConfig?.showCollapse) {
      isShow.value = true
    } else {
      if (attrs.index) {
        isShow.value = !(hiddenIndex !== -1 && parseInt(attrs.index) >= Number(hiddenIndex))
      }
    }
  },
  { immediate: true },
)

/**
 * 核心逻辑：
 * 1. 隐藏逻辑优先 (display: none)
 * 2. 非 Col 模式下使用 contents 穿透布局
 */
const computedCombinedStyle = computed(() => {
  const s: any = {}

  // 1. 处理隐藏逻辑（优先级最高）
  if (formFieldIsNone.value || formFieldIsHidden.value) {
    s.display = 'none'
    return s
  }

  // 2. 处理非 Col 模式下的布局穿透
  if (props.inline && !props.isCol) {
    // display: contents 使容器不产生任何盒模型，子元素直接参与外层布局
    // 这将解决 el-form (inline) 布局被多余 div 破坏的问题
    s.display = 'contents'
  }

  return s
})

const style = computed(() => {
  if (searchFormConfig?.searchForm && props.suffix) {
    return {
      textAlign: 'end',
      marginLeft: 'auto',
    }
  }
  return {}
})

const setProps = computed(() => {
  if (searchFormConfig?.searchForm) {
    const bp = gridConifg.breakPoint.value as keyof Responsive
    const span = props[bp]?.['span'] ?? props.span ?? 24 / gridConifg.cols.value
    const offset = props[bp]?.['offset'] ?? props.offset
    return { span, offset }
  }
  return {
    span: props.span,
    offset: props.offset,
    xs: props.xs,
    sm: props.sm,
    md: props.md,
    lg: props.lg,
    xl: props.xl,
  }
})
</script>
