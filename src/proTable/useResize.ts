import { onMounted, onBeforeUnmount, nextTick, ref, type Ref } from 'vue'
import { isUndefined } from '../utils'
import type { ProTableToolbarInstance } from './table.types'

type UseResizeOptions = {
  tableBodyRef: Ref<HTMLElement | null>
  tableHeaderRef: Ref<ProTableToolbarInstance | null>
  height?: number
  maxHeight?: number
  autoHeight: boolean
  width?: number
  hasCreator: boolean
  hasPager: boolean
}

export const useResize = (options: UseResizeOptions) => {
  const bodyHeight = ref<number>(options.height || 100)
  const bodyWidth = ref<number>(options.width || 100)
  const maxHeight = ref<number | undefined>(options.maxHeight)
  // toolbar 的高度
  const toolbarHeight = () => {
    if (options.tableHeaderRef.value) {
      return options.tableHeaderRef.value.getHeight()
    }
    return 0
  }
  // 计算表格体高度
  const calculateBodyHeight = () => {
    if (!options.tableBodyRef.value) {
      return
    }
    const boundClient = options.tableBodyRef.value.getBoundingClientRect()
    const height = options.height || boundClient.height || 0
    const width = options.width || boundClient.width || 0
    if (height > 0) {
      const operateHeight = options.hasCreator ? 32 : 0
      const pageHeight = options.hasPager ? 44 : 0
      // 设置表格体高度
      bodyHeight.value = height - pageHeight - operateHeight
      if (!isUndefined(maxHeight.value)) {
        maxHeight.value = maxHeight.value - pageHeight - operateHeight - toolbarHeight()
      }
    }
    if (width > 0) {
      bodyWidth.value = width
    }
  }
  // 监听窗口大小变化
  const handleResize = () => {
    // 自适应高度不需要处理
    if (options.autoHeight) {
      return
    }
    nextTick(calculateBodyHeight)
  }

  onMounted(() => {
    nextTick(() => {
      calculateBodyHeight()
      window.addEventListener('resize', handleResize)
    })
  })
  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
  })

  return {
    bodyHeight,
    maxHeight,
    bodyWidth,
    calculateBodyHeight,
  }
}
