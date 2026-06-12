<template>
  <ProForm
    ref="formRef"
    v-bind="props"
    :searchForm="true"
  >
    <template #search>
      <Grid
        ref="gridRef"
        :collapsed="collapsed"
        :gutter="props.gutter"
        :cols="props.searchCol"
      >
        <FormFields :columns="props.columns"></FormFields>
        <GridItem
          suffix
          v-if="props.searchBtn"
        >
          <div class="operation">
            <ElButton
              type="primary"
              :icon="Search"
              :loading="props.searchLoading"
              @click="onSubmit"
            >
              搜索
            </ElButton>
            <ElButton
              :icon="Delete"
              @click="onReset"
            >
              重置
            </ElButton>
            <ElButton
              v-if="showCollapse"
              type="primary"
              link
              class="search-isOpen"
              @click="onCollapse"
            >
              {{ collapsed ? '展开' : '收起' }}
              <ElIcon class="el-icon--right">
                <component :is="collapsed ? ArrowDown : ArrowUp"></component>
              </ElIcon>
            </ElButton>
          </div>
        </GridItem>
      </Grid>
    </template>
  </ProForm>
</template>

<script setup lang="ts">
import ProForm from '../form/form.vue'
import type { QueryFilterProps } from './queryFilter.types.ts'
import { Delete, Search, ArrowDown, ArrowUp } from '@element-plus/icons-vue'
import { computed, ref, provide } from 'vue'
import type { BreakPoint } from '../grid/grid.types'
import { Grid, GridItem } from '../grid/index.ts'
import FormFields from '../form/formFields.vue'
import { ElButton, ElIcon } from 'element-plus'

const props = withDefaults(defineProps<QueryFilterProps>(), {
  collapsed: false,
  searchBtn: true,
  showCollapse: true,
  gutter: 20,
  grid: true,
})

defineOptions({
  name: 'QueryFilter',
})

const formRef = ref()

// 是否默认折叠搜索项
const collapsed = ref(!props.collapsed)

// 获取响应式断点
const gridRef = ref()
const breakPoint = computed<BreakPoint>(() => gridRef.value?.breakPoint)

// 判断是否显示 展开/合并 按钮
const showCollapse = computed(() => {
  if (!props.showCollapse) {
    return props.showCollapse
  }
  let show = false
  props.columns?.reduce((prev, current) => {
    prev +=
      (current.colProps?.[breakPoint.value]?.span ??
        current.colProps?.span ??
        1) +
      (current.colProps?.[breakPoint.value]?.offset ??
        current.colProps?.offset ??
        0)
    if (typeof props.searchCol !== 'number') {
      if (prev >= (props.searchCol?.[breakPoint.value] ?? 0)) show = true
    } else {
      if (prev >= props.searchCol) show = true
    }
    return prev
  }, 0)
  return show
})

const onSubmit = () => {
  formRef.value.submit()
}

const onReset = (e: MouseEvent) => {
  formRef.value.reset(e)
}

const onCollapse = () => {
  collapsed.value = !collapsed.value
  props.onCollapse?.(collapsed.value)
}

provide('searchFormConfig', {
  searchBtn: props.searchBtn,
  collapsed: collapsed.value,
  showCollapse: props.showCollapse,
  searchForm: true,
})
</script>

<style scoped>
.operation {
  display: flex;
}
</style>
