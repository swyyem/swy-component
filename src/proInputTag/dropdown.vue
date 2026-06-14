<template>
  <div :class="[ns.b('dropdown'), popperClass]" :style="wrapStyle">
    <div v-if="$slots.header" :class="ns.be('dropdown', 'header')">
      <slot name="header" />
    </div>
    <slot />
    <div v-if="$slots.footer" :class="ns.be('dropdown', 'footer')">
      <slot name="footer" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import { useNamespace } from '../utils/hooks'
import type { ProInputTagDropdownProps } from './tag.types'

defineOptions({
  name: 'ProInputTagDropdown',
})
const ns = useNamespace('select')
const props = defineProps<ProInputTagDropdownProps>()
// computed
const popperClass = computed(() => props.popperClass)
const wrapStyle = computed(() => {
  const contentWidth = props.contentWidth
  if (contentWidth) {
    return {
      width: `${contentWidth}px`,
    }
  }
  return {
    [props.fitInputWidth ? 'width' : 'minWidth']: minWidth.value,
  }
})
const minWidth = ref('')

function updateMinWidth() {
  minWidth.value = `${props.tagRef?.offsetWidth}px`
}

onMounted(() => {
  updateMinWidth()
  useResizeObserver(props.tagRef, updateMinWidth)
})
</script>
