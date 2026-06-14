<template>
  <div ref="divRef" class="pro-table--header" :class="props.className">
    <div class="pro-table--header__left">
      <div class="pro-table--header__title" v-if="showTitle">
        {{ props.title }}
      </div>
      <slot name="toolbar-filters" v-if="hasFiltersSlots" />
      <component :is="filtersNode" v-else></component>
    </div>
    <div class="pro-table--header__right">
      <slot name="toolbar-search" v-if="hasSearchSlots" />
      <component :is="searchNode" v-else></component>
      <!-- @vue-generic {T} -->
      <ProTableToolbarSetting v-if="props.custom">
        <div class="el-table-toolbar-icon">
          <el-button :icon="SettingSvg" />
        </div>
      </ProTableToolbarSetting>
      <!-- @vue-generic {T} -->
      <ProTableToolbarImport v-if="importDisplay" v-bind="props.import" />
      <!-- @vue-generic {T} -->
      <ProTableToolbarExport v-if="exportDisplay" v-bind="exportProps" />
      <slot name="toolbar-buttons" v-if="hasButtonsSlots" />
      <component :is="buttonsNode" v-else></component>
    </div>
  </div>
</template>
<style lang="less">
.pro-table--header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 16px;
  // min-height: 32px;

  &__left {
    display: flex;
    gap: 10px;
  }

  &__title {
    position: relative;
    padding-left: 7px;
    font-size: var(--global-font-size-large);
    color: var(--title-color);
    height: 32px;
    display: flex;
    align-items: center;
    white-space: nowrap;

    &:after {
      content: ' ';
      position: absolute;
      left: 0;
      top: 50%;
      width: 3px;
      height: 16px;
      transform: translateY(-50%);
      background-color: var(--el-color-primary);
    }
  }

  & &__right {
    display: flex;
    gap: 10px;

    .el-button + .el-button {
      margin-left: 0;
    }
  }

  & &__bton {
    padding: 8px;
  }

  .el-button {
    margin-left: 0;
  }
}
</style>
<script setup lang="ts" generic="T extends ProComponentObject">
/**
 * @description: 表格工具栏和搜索表单
 * 右侧插槽分成两部分
 * 一个是右侧靠右的按钮组，内置了定制列、导入、导出，
 * 自定义按钮组始终靠右，如新建
 * 一个是右侧靠左的关键字搜索控件，回车触发搜索
 * 左侧插槽是表单中的筛选控件
 */
import { h, computed, ref, inject, useSlots } from 'vue'
import { ElButton } from 'element-plus'
import SettingIcon from './icons/setting.vue'
import ProTableToolbarSetting from './toolbarSetting.vue'
import ProTableToolbarExport from './toolbarExport.vue'
import ProTableToolbarImport from './toolbarImport.vue'
import type { ProComponentObject } from '../common.types'
import type {
  ProTableToolbarProps,
  ProTableToolbarInstance,
  ProTableProviderProps,
} from './table.types'

defineOptions({
  name: 'ProTableToolbar',
})
const slots = useSlots()
const hasFiltersSlots = !!slots['toolbar-filters']
const hasSearchSlots = !!slots['toolbar-search']
const hasButtonsSlots = !!slots['toolbar-buttons']

const props = withDefaults(defineProps<ProTableToolbarProps<T>>(), {
  custom: false,
  export: false,
})
const ProTableData = inject<ProTableProviderProps<T>>('ProTableData')!
const onSearch = ProTableData.onSearch
const onCurrentSearch = ProTableData.onCurrentSearch
const searchForm = ProTableData.searchForm
const filtersNode = computed(() => {
  return props.filtersCustom?.({
    onSearch,
    onCurrentSearch,
    searchForm,
  })
})
const searchNode = computed(() => {
  return props.searchCustom?.({
    onSearch,
    onCurrentSearch,
    searchForm,
  })
})
const buttonsNode = computed(() => {
  return props.buttonsCustom?.({
    onSearch,
    onCurrentSearch,
    searchForm,
  })
})
const showTitle = !!props.title
const SettingSvg = h(SettingIcon, { size: 16 })
const divRef = ref<HTMLDivElement>()
defineExpose<ProTableToolbarInstance>({
  getHeight: () => {
    return divRef.value ? divRef.value.offsetHeight : 0
  },
})
const importDisplay = computed(() => (props.import ? true : false))
const exportDisplay = computed(() => {
  const isBool = typeof props.export === 'boolean'
  return isBool ? props.export : true
})
const exportProps = computed(() => {
  if (typeof props.export === 'object') {
    return props.export
  }
  return {}
})
</script>
