<script setup lang="ts">
import {
  computed,
  useAttrs,
  ref,
  onMounted,
  onUnmounted,
  onUpdated,
  nextTick,
  type HTMLAttributes,
} from 'vue'
import { ElTooltip, ElText } from 'element-plus'
import { debounce } from 'lodash-unified'
import Copyable from './copy-able.vue'
import type { ElTextProps, TextSpecifiledProps } from './type'

defineOptions({ inheritAttrs: false })
const props = defineProps<TextSpecifiledProps>()
const attrs = useAttrs() as ElTextProps & HTMLAttributes
const isExceed = ref(false)
const textRef = ref()

const ellipsis = computed(() => {
  return typeof props.ellipsis === 'boolean'
    ? props.ellipsis
      ? { showTitle: true }
      : undefined
    : props.ellipsis
})

let isMounted = false
onUpdated(() => {
  if (isMounted) {
    handleResize()
  }
})

// 监听窗口大小变化
const handleResize = debounce(() => {
  nextTick(() => {
    if (textRef.value) {
      const clientWidth = textRef.value.clientWidth
      const subClientWidth = textRef.value.firstElementChild.clientWidth
      // console.log('==', clientWidth, subClientWidth)
      if (subClientWidth >= clientWidth) {
        isExceed.value = true
      } else {
        isExceed.value = false
      }
    }
  })
}, 300)
onMounted(() => {
  if (ellipsis.value?.showTitle) {
    isMounted = true
    handleResize()
    window.addEventListener('resize', handleResize)
  }
})

onUnmounted(() => {
  if (ellipsis.value?.showTitle) {
    isMounted = false
    window.removeEventListener('resize', handleResize)
  }
})

const textProps = computed(() => {
  const className = []
  const style = {} as any
  if (attrs.class) {
    className.push(attrs.class)
  }
  if (attrs.lineClamp) {
    className.push('pro-text-line-clamp')
    style['-webkit-line-clamp'] = attrs.lineClamp
  } else if (ellipsis.value) {
    className.push('pro-text-ellipsis')
  }
  return {
    ...attrs,
    style: style,
    class: className.join(' '),
    truncated: false,
    lineClamp: undefined,
    // 默认会显示 true，禁止所有的省略
    // title: true,
  }
})
</script>

<template>
  <div class="pro-text" :style="attrs.style" ref="textRef">
    <el-tooltip v-if="ellipsis?.showTitle && isExceed" placement="top">
      <template #content>
        <slot></slot>
      </template>
      <el-text v-bind="textProps">
        <slot></slot>
      </el-text>
    </el-tooltip>
    <el-text v-else v-bind="textProps">
      <slot></slot>
    </el-text>
    <copyable v-if="props.copyable" class="pro-text-copyable" :text="props.copyText" />
  </div>
</template>

<style scoped lang="less">
.pro-text {
  width: 100%;
  display: flex;

  .el-text {
    color: currentColor;
  }

  .pro-text-ellipsis {
    display: inline-block;
    max-width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .pro-text-line-clamp {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .pro-text-copyable {
    margin-inline-start: 4px;
  }
}
</style>
