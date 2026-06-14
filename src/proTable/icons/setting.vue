<template>
  <svg aria-hidden="true" class="svg-icon" :style="style">
    <g stroke="#7c7d7e" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
      <path d="m13.8335 3.33325h-2" />
      <path d="m9.1665 2v2.66667" />
      <path d="m9.16683 3.33325h-7.33333" />
      <path d="m4.50016 8h-2.66666" />
      <path d="m7.1665 6.66675v2.66666" />
      <path d="m14.4998 8h-7.3333" />
      <path d="m13.8335 12.6667h-2" />
      <path d="m9.1665 11.3333v2.6666" />
      <path d="m9.16683 12.6667h-7.33333" />
    </g>
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'SettingIcon',
})

const props = defineProps({
  size: {
    type: [Number, String],
    default: 16,
  },
  color: String,
})

const style = computed(() => ({
  fontSize: `${props.size}px`,
  color: props.color || 'currentColor',
}))
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
