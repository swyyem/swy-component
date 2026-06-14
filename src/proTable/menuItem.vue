<template>
  <div
    class="pro-table--menu__li"
    :class="disabledClass"
    @click="handleClick"
    @mouseenter="handleEnter"
    @mouseleave="handleLeave"
  >
    <div class="pro-table--menu__li--ct">{{ props.item.label }}</div>
    <el-icon v-if="hasChild" size="16" class="pro-table--menu__li--icon"><ArrowIcon /></el-icon>
    <!-- 当有子节点时递归渲染 -->
    <template v-if="props.item.children && props.item.children.length">
      <div class="pro-table--menu" :class="childClass">
        <table-menu-item
          v-for="(child, index) in props.item.children"
          :key="`${child.label}_${index}`"
          :item="child"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts" generic="T extends ProComponentObject">
import { computed, inject, toRaw, ref } from 'vue'
import { ElIcon } from 'element-plus'
import ArrowIcon from './icons/arrow.vue'
import type { ProComponentObject } from '../common.types'
import type {
  ProTableMenuOption,
  ProTableProviderProps,
  ProTableContentProvider,
  ProTableMenuClickParams,
} from './table.types'

defineOptions({
  name: 'TableMenuItem',
})
type MenuType = {
  item: ProTableMenuOption
}
const props = defineProps<MenuType>()
const ProTableData = inject<ProTableProviderProps<T>>('ProTableData')
const ProTableContentData = inject<ProTableContentProvider<T>>('ProTableContentData')
const disabledClass = computed(() => {
  return props.item.disabled ? 'pro-table--menu__li__disabled' : ''
})
const hasChild = computed(() => {
  return props.item.children && props.item.children.length > 0
})
const isVisible = ref(false)
const childTimeoutRef = ref()
const handleEnter = () => {
  if (!hasChild.value) {
    return
  }
  if (childTimeoutRef.value) {
    clearTimeout(childTimeoutRef.value)
  }
  isVisible.value = true
}
const handleLeave = () => {
  if (!hasChild.value) {
    return
  }
  childTimeoutRef.value = setTimeout(() => {
    isVisible.value = false
  }, 50)
}
const childClass = computed(() => {
  return isVisible.value ? 'is-visible' : ''
})

const handleClick = (e: MouseEvent) => {
  if (props.item.disabled) {
    return
  }
  if (hasChild.value) {
    return
  }
  const { rowAndColumn } = ProTableContentData!

  const params = {
    menu: toRaw(props.item),
    $event: e,
  } as ProTableMenuClickParams<any>
  if (rowAndColumn.value.row) {
    params.row = rowAndColumn.value.row
  }
  if (rowAndColumn.value.column) {
    params.column = rowAndColumn.value.column
  }
  ProTableData?.emit('menu-click', params)
}
</script>
