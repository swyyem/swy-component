<template>
  <ElRow :gutter="props.gutter">
    <slot></slot>
  </ElRow>
</template>

<script setup lang="ts">
import {
  ref,
  watch,
  useSlots,
  computed,
  provide,
  onBeforeMount,
  onMounted,
  onUnmounted,
  onDeactivated,
  onActivated,
} from 'vue'

import type { VNode, Ref } from 'vue'
import type { BreakPoint } from './grid.types'
import type { PropFormFieldProps } from '../form/form.types'
import { ElRow } from 'element-plus'
import type { searchColType } from '../queryFilter/queryFilter.types'

defineOptions({
  name: 'ProGrid',
})

type Props = {
  cols?: searchColType
  collapsed?: boolean
  collapsedRows?: number
  gap?: number
  gutter?: number
}

const props = withDefaults(defineProps<Props>(), {
  cols: () => ({ xs: 1, sm: 2, md: 2, lg: 3, xl: 4 }),
  collapsed: false,
  collapsedRows: 1,
  gap: 0,
  gutter: 0,
})

onBeforeMount(() => props.collapsed && findIndex())
onMounted(() => {
  resize({ target: { innerWidth: window.innerWidth } } as unknown as UIEvent)
  window.addEventListener('resize', resize)
})
onActivated(() => {
  resize({ target: { innerWidth: window.innerWidth } } as unknown as UIEvent)
  window.addEventListener('resize', resize)
})
onUnmounted(() => {
  window.removeEventListener('resize', resize)
})
onDeactivated(() => {
  window.removeEventListener('resize', resize)
})

// 监听屏幕变化
const resize = (e: UIEvent) => {
  const width = (e.target as Window).innerWidth
  switch (!!width) {
    case width < 768:
      breakPoint.value = 'xs'
      break
    case width >= 768 && width < 992:
      breakPoint.value = 'sm'
      break
    case width >= 992 && width < 1200:
      breakPoint.value = 'md'
      break
    case width >= 1200 && width < 1920:
      breakPoint.value = 'lg'
      break
    case width >= 1920:
      breakPoint.value = 'xl'
      break
  }
}

// 注入响应式断点
const breakPoint = ref<BreakPoint>('xl')

// 注入要开始折叠的 index
const hiddenIndex = ref(-1)

// 注入 cols
const gridCols: Ref<searchColType> = computed(() => {
  if (typeof props.cols === 'object')
    return props.cols[breakPoint.value] ?? props.cols
  return props.cols
})

provide('gridConifg', {
  breakPoint,
  shouldHiddenIndex: hiddenIndex,
  cols: gridCols,
})
// 寻找需要开始折叠的字段 index
const slots: VNode[] = useSlots().default?.({}) || []

const findIndex = () => {
  // const fields: VNodeArrayChildren = []
  let suffix: VNode | null = null
  slots?.forEach((slot: any) => {
    // suffix
    if (
      typeof slot.type === 'object' &&
      slot.type.name === 'GridItem' &&
      slot.props?.suffix !== undefined
    ) {
      suffix = slot
    }
  })

  // 计算 suffix 所占用的列
  let suffixCols = 0
  if (suffix) {
    suffixCols =
      ((suffix as VNode)?.props?.[breakPoint.value]?.span ??
        (suffix as VNode)?.props?.span ??
        1) +
      ((suffix as VNode)?.props?.[breakPoint.value]?.offset ??
        (suffix as VNode)?.props?.offset ??
        0)
  }
  try {
    let find = false
    slots[0].props?.columns.reduce(
      (prev = 0, current: PropFormFieldProps, index: number) => {
        prev +=
          (current!.colProps?.[breakPoint.value]?.span ??
            current?.colProps?.span ??
            1) +
          (current!.colProps?.[breakPoint.value]?.offset ??
            current?.colProps?.offset ??
            0)
        if (
          Number(prev) >
          props.collapsedRows * Number(gridCols.value) - suffixCols
        ) {
          hiddenIndex.value = index
          find = true
          throw 'find it'
        }
        return prev
      },
      0,
    )

    if (!find) hiddenIndex.value = -1
  } catch (e) {
    console.warn(e)
  }
}

// 断点变化时执行 findIndex
watch(
  () => breakPoint.value,
  () => {
    if (props.collapsed) findIndex()
  },
)

// 监听 collapsed
watch(
  () => props.collapsed,
  (value) => {
    if (value) return findIndex()
    hiddenIndex.value = -1
  },
)

defineExpose({ breakPoint })
</script>
