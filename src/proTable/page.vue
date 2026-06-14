<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<template>
  <ElPagination
    background
    size="small"
    :page-sizes="[10, 20, 50, 100]"
    layout="total, prev, pager, next, jumper, sizes"
    v-bind="paginationAttrs"
    v-model:current-page="calCurrentPage"
    v-model:page-size="calPageSize"
    :total="total"
  />
</template>
<style>
.pro-pagination {
  display: flex;
  flex-wrap: wrap;
  margin: 10px 0;

  .el-pagination__rightwrapper {
    flex: none;
  }

  &.pro-pagination-left {
    justify-content: flex-start;
  }

  &.pro-pagination-center {
    justify-content: center;
  }

  &.pro-pagination-right {
    justify-content: flex-end;
  }
}
</style>
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { ProPagerProps } from './table.types'
import { ElPagination } from 'element-plus'
defineOptions({
  name: 'ProPagination',
  inheritAttrs: false,
})
// const emit = defineEmits(['change'])
// const handlePageChange = (currentPage: number, pageSize: number) => {
//   emit('change', currentPage, pageSize)
// }

const props = defineProps<ProPagerProps>()
// 提取所有分页属性，排除已经单独处理的属性
const paginationAttrs = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { currentPage, pageSize, total, position, ...rest } = props.pagination
  return rest
})

const total = computed(() => {
  return props.pagination.total || 0
})
const calCurrentPage = ref(props.pagination.currentPage)
const calPageSize = ref(props.pagination.pageSize)

// 监听 props 中的 currentPage 和 pageSize 变化
watch(
  () => props.pagination.currentPage,
  (newVal) => {
    if (newVal !== calCurrentPage.value) {
      calCurrentPage.value = newVal
    }
  },
)

watch(
  () => props.pagination.pageSize,
  (newVal) => {
    if (newVal !== calPageSize.value) {
      calPageSize.value = newVal
    }
  },
)
</script>
