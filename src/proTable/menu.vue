<template>
  <div
    v-click-outside="onClickOutside"
    ref="popoverTrigger"
    style="width: 1px; height: 1px; position: fixed; pointer-events: none"
    :style="{ top: props.layoutCoord.y + 'px', left: props.layoutCoord.x + 'px' }"
  ></div>
  <!-- el-popover 右键菜单 -->
  <ElPopover
    ref="popoverRef"
    placement="right-start"
    :visible="props.visible"
    :virtual-ref="popoverTrigger"
    virtual-triggering
    width="auto"
    :popper-class="['pro-table--menu__popover', props.class || '']"
    :show-arrow="false"
  >
    <div class="pro-table--menu" @click="handleClick">
      <!-- @vue-generic {T} -->
      <TableMenuItem
        v-for="(child, index) in props.options"
        :item="child"
        :key="`${child.label}_${index}`"
      />
    </div>
  </ElPopover>
</template>

<script setup lang="ts" generic="T extends ProComponentObject">
import { ref, watch } from 'vue'
import { ElPopover, ClickOutside as vClickOutside } from 'element-plus'
import TableMenuItem from './menuItem.vue'
import type { ProComponentObject } from '../common.types'
import type { ProTableMenuOption } from './table.types'

defineOptions({
  name: 'TableMenu',
})
type MenuType = {
  class?: string
  visible?: boolean
  justOpen?: boolean
  options?: ProTableMenuOption[]
  changeVisible?: (v: boolean) => void
  layoutCoord: {
    x: number
    y: number
  }
}
const props = defineProps<MenuType>()
const popoverTrigger = ref()
const popoverRef = ref()
watch(
  () => props.layoutCoord,
  () => {
    popoverRef.value?.popperRef.popperInstanceRef.update()
  },
)
const handleClick = (e: MouseEvent) => {
  e.stopPropagation()
  props.changeVisible?.(false)
}
const onClickOutside = (e: MouseEvent) => {
  const popoverEl = popoverRef.value?.popperRef.contentRef
  if (popoverEl?.contains(e.target)) {
    return
  }
  if (typeof props.justOpen === 'boolean') {
    if (!props.justOpen) {
      props.changeVisible?.(false)
    }
  }
}
</script>
<style lang="less">
.pro-table--menu {
  border: 1px var(--pro-table-border-color) solid;
  background-color: #fff;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.15);
  border-radius: 6px;
  padding: 4px;
  min-width: 100px;
  box-sizing: border-box;
  color: var(--pro-table-font-color);
  font-size: 14px;

  &__popover.el-popover.el-popper {
    background-color: transparent;
    border: none;
    box-shadow: none;
    padding: 0;
    min-width: auto;
  }

  &__li {
    position: relative;
    display: flex;
    align-items: center;
    height: 28px;
    line-height: 28px;
    padding: 0 12px;
    cursor: pointer;
    white-space: nowrap;

    &:hover {
      background-color: rgba(0, 0, 0, 0.08);
    }

    &__disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &--ct {
      flex: 1;
    }

    &--icon {
      width: 14px;
      height: 14px;
      margin-left: 4px;
    }

    .pro-table--menu {
      display: none;
      position: absolute;
      top: 0;
      left: calc(100% + 8px);

      &.is-visible {
        display: block;
      }
    }
  }
}
</style>
