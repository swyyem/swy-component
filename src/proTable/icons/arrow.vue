<template>
  <svg aria-hidden="true" class="svg-icon" :style="style">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M3.95307 1.43598C4.24596 1.14309 4.72084 1.14309 5.01373 1.43598L10.0472 6.46946C10.3401 6.76235 10.3401 7.23722 10.0472 7.53012L5.01373 12.5636C4.72084 12.8565 4.24596 12.8565 3.95307 12.5636C3.66018 12.2707 3.66018 11.7958 3.95307 11.5029L8.45622 6.99979L3.95307 2.49664C3.66018 2.20375 3.66018 1.72887 3.95307 1.43598Z"
      fill="#7C7D7E"
    />
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
    default: 14,
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
