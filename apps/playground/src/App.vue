<script setup lang="ts">
import { SButton } from '@swy/components'
</script>

<template>
  <div style="padding: 40px;">
    <h1>SWY Component Playground</h1>
    <div style="display: flex; gap: 12px; margin-top: 20px;">
      <SButton type="primary">Primary</SButton>
      <SButton type="success">Success</SButton>
      <SButton type="warning">Warning</SButton>
      <SButton type="danger">Danger</SButton>
      <SButton disabled>Disabled</SButton>
      <SButton loading>Loading</SButton>
    </div>
  </div>
</template>
