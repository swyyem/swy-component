import type { VNode } from 'vue'

interface ColumnCacheProps<T> {
  row: T
  rowIndex: number
  cellIndex: number
  content: (row: T, rowIndex: number, cellIndex: number) => VNode | VNode[] | null
}

// 定义一个泛型函数组件
const ColumnCache = <T,>(props: ColumnCacheProps<T>) => {
  return props.content(props.row, props.rowIndex, props.cellIndex)
}
export default ColumnCache
ColumnCache.displayName = 'ColumnCache'
