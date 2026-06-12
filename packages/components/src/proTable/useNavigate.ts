import { ref, computed, nextTick, type Ref, type ComputedRef } from 'vue'
import { isFunction } from '../utils'
import { getIndexFormKeys } from './utils'
import type { DeferredExcutorType } from '../utils/defer'
import type {
  ProTableGetRowKey,
  ProTableRowDirection,
  ProTableRowClassNameParams,
  ProTableContentInstance,
  ProTableRowClassName,
  ProTableRowSelectionData,
  KeyType,
} from './table.types'

type UseNavigateOptions<T> = {
  deferReadyExecutor: DeferredExcutorType
  tableContentRef: Ref<ProTableContentInstance<T> | undefined>
  rowSelectionProps: ComputedRef<ProTableRowSelectionData<T>>
  rowClassName?: ProTableRowClassName
  getTableDataSize: () => number
  getTableDataHasKey: () => T[]
  getRowDataByIndex: (v: number) => T
  getRowKey: ComputedRef<ProTableGetRowKey<T>>
  getCurrentSelectedRow: () => T | undefined
}
export const useNavigate = <T>({
  deferReadyExecutor,
  tableContentRef,
  rowSelectionProps,
  rowClassName,
  getTableDataSize,
  getTableDataHasKey,
  getRowDataByIndex,
  getRowKey,
  getCurrentSelectedRow,
}: UseNavigateOptions<T>) => {
  const hoverIndex = ref(-1)
  const setHoverIndex = (n: number) => {
    hoverIndex.value = n
  }
  // 设置 row 的样式
  const setRowClassName = computed(() => {
    return (data: ProTableRowClassNameParams<T>) => {
      if (data.rowIndex === hoverIndex.value) {
        return 'hover-row'
      }
      return isFunction(rowClassName) ? rowClassName(data) : rowClassName
    }
  })
  // 切换 hover row
  const navigateRow = (direction: ProTableRowDirection) => {
    const tableSize = getTableDataSize()
    if (direction === 'next') {
      hoverIndex.value += 1
      if (hoverIndex.value === tableSize) {
        hoverIndex.value = 0
      }
    } else if (direction === 'prev') {
      hoverIndex.value -= 1
      if (hoverIndex.value < 0) {
        hoverIndex.value = tableSize - 1
      }
    }
    nextTick(() => tableContentRef.value?.setScrollTop(hoverIndex.value))
  }
  // 选中 hover row
  const setNavigateRow = () => {
    const { type } = rowSelectionProps.value
    if (hoverIndex.value < 0) {
      return
    }
    const rowData = getRowDataByIndex(hoverIndex.value)
    if (type === 'checkbox') {
    } else {
      tableContentRef.value?.setCurrentRow(rowData, false)
    }
    return rowData
  }
  // 获取 hover 的 row
  const getNavigateRow = () => {
    const rowData = getRowDataByIndex(hoverIndex.value)
    return rowData
  }
  // 表格隐藏后再次打开时，滚动到当前行
  const scrollToCurrentRow = () => {
    deferReadyExecutor.add(() => {
      const { selectedRowKeys, type } = rowSelectionProps.value
      let chooseRowKeys: KeyType[] = []
      if (type && type === 'checkbox') {
        chooseRowKeys = selectedRowKeys
      } else {
        const currentRow = getCurrentSelectedRow()
        chooseRowKeys = currentRow ? [getRowKey.value(currentRow)] : []
      }
      const rowIndexArray: number[] = getIndexFormKeys(
        chooseRowKeys,
        getTableDataHasKey(),
        getRowKey.value,
      )
      // console.log('=updateRow=')
      if (rowIndexArray.length > 0) {
        hoverIndex.value = rowIndexArray[0]
        // tableContentRef.value?.updateRow()
        nextTick(() => tableContentRef.value?.setScrollTop(hoverIndex.value))
      }
    })
  }

  return {
    setRowClassName,
    navigateRow,
    setNavigateRow,
    getNavigateRow,
    scrollToCurrentRow,
    setHoverIndex,
  }
}
