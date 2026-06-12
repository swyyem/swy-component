<template>
  <slot></slot>
</template>

<script lang="ts" setup>
import { provide } from 'vue'

const props = defineProps<{
  index: number
}>()

provide('ProFormListIndex', props.index)
defineOptions({
  name: 'ProFormListProvide',
})
</script>
