<template>
  <div :class="[ns.b('dropdown'), ns.is('multiple', isMultiple), popperClass]" :style="wrapStyle">
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
import { computed, onMounted, ref, inject } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import { useNamespace } from '../utils/hooks'
import type { ProSelectContext } from './select.types'

defineOptions({
  name: 'ProSelectDropdown',
})
const select = inject<ProSelectContext>('ProSelectData')!
const ns = useNamespace('select')
// computed
const popperClass = computed(() => select.props.popperClass)
const isMultiple = computed(() => select.props.multiple)
const wrapStyle = computed(() => {
  const contentWidth = select.props.contentWidth
  if (contentWidth) {
    return {
      width: `${contentWidth}px`,
    }
  }
  return {
    [select.props.fitInputWidth ? 'width' : 'minWidth']: minWidth.value,
  }
})
const minWidth = ref('')

function updateMinWidth() {
  minWidth.value = `${select.selectRef.value?.offsetWidth}px`
}

onMounted(() => {
  updateMinWidth()
  useResizeObserver(select.selectRef.value, updateMinWidth)
})
</script>
