import { watch, type Ref, type ComputedRef } from 'vue'
import type { ProTablePageParams } from './table.types'

type UseDynamicPageSizeOptions = {
  columnsDepth: Ref<number>
  bodyHeight: Ref<number>
  pageInfo: ProTablePageParams
  setPage: (changedPage: ProTablePageParams) => void
  firstRef: Ref<boolean>
  rowHeight?: number
  waterfall: boolean
  isAutoPageSize: ComputedRef<boolean>
}

export const useDynamicPageSize = (options: UseDynamicPageSizeOptions) => {
  const ROW_HEIGHT = options.rowHeight || 33

  // 根据高度返回pagesize
  const getPageSize = () => {
    if (options.bodyHeight.value > 0) {
      const tableHeaderHeight = options.columnsDepth.value * ROW_HEIGHT
      const pageSize = options.waterfall
        ? Math.floor(options.bodyHeight.value / ROW_HEIGHT + 3)
        : Math.floor((options.bodyHeight.value - tableHeaderHeight) / ROW_HEIGHT)
      return pageSize
    }
    return 0
  }

  const calculateAndSetPageSize = () => {
    if (!options.isAutoPageSize.value) {
      return
    }
    const calculatedPageSize = getPageSize()
    // 只有当计算出的条数真的变了，才返回 true
    if (calculatedPageSize > 0 && calculatedPageSize !== options.pageInfo.pageSize) {
      options.setPage({
        pageSize: calculatedPageSize,
      })
    }
  }

  // 关键：监听 bodyHeight 的变化
  watch(
    () => options.bodyHeight.value,
    (newHeight) => {
      if (!options.isAutoPageSize.value) {
        return
      }
      // 1. 确保不是初始化状态（初始化由主组件 onMounted 调度）
      // 2. 只有当高度真的发生变化（如窗口缩放）时才执行
      if (newHeight > 0 && !options.firstRef.value) {
        calculateAndSetPageSize()
      }
    },
  )

  return {
    getPageSize,
    calculateAndSetPageSize,
  }
}
