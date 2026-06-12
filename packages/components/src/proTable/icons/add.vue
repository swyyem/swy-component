<template>
  <svg aria-hidden="true" class="svg-icon" :style="style">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M8.02631 1.29819C8.44052 1.29873 8.77587 1.63495 8.77532 2.04917L8.75976 13.9528C8.75922 14.367 8.423 14.7024 8.00879 14.7019C7.59457 14.7013 7.25922 14.3651 7.25977 13.9509L7.27533 2.04721C7.27587 1.63299 7.61209 1.29765 8.02631 1.29819Z"
      fill="currentColor"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M1.29785 8C1.29785 7.58579 1.63364 7.25 2.04785 7.25H13.9515C14.3657 7.25 14.7015 7.58579 14.7015 8C14.7015 8.41421 14.3657 8.75 13.9515 8.75H2.04785C1.63364 8.75 1.29785 8.41421 1.29785 8Z"
      fill="currentColor"
    />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'DragIcon',
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
  /* vertical-align: -0.15em; */
  fill: currentColor;
  overflow: hidden;
}
</style>
