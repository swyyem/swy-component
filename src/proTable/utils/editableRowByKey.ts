import { nextTick } from 'vue'
import type { ProComponentObject } from '../../common.types'
import type { ProTableGetRowKey, KeyType, ProColumn, ProColumns } from '../table.types'
import type { ProTableEditContext } from '../proTableEdit.types'
import {
  getNextRowData,
  findColumnIndex,
  findRowIndex,
  columnCanFocus,
  findColumnByKey,
} from '../utils'
import { isUndefined } from '../../utils'

/**
 * 使用map 来删除数据，性能一般 但是准确率比较高
 * 修改成使用内部的 key 来做匹配，未考虑 children 的场景 edit by 2025/05/13
 * @param keyProps
 * @param action
 */
export function editableRowByKey<T>(
  keyProps: {
    data: T[]
    childrenColumnName: string
    getRowKey: ProTableGetRowKey<T>
    key: KeyType
    row: T
  },
  action: 'update' | 'top' | 'delete',
) {
  const { getRowKey, row, key, data } = keyProps
  const copyData = data.slice(0)
  const matchIndex = data.findIndex((item) => {
    const itemKey = getRowKey(item)
    return itemKey === key
  })
  if (matchIndex > -1) {
    if (action === 'update') {
      copyData.splice(matchIndex, 1, row)
    } else if (action === 'delete') {
      copyData.splice(matchIndex, 1)
    }
    return copyData
  }
  return data
}

// 编辑相关

type FindNextColumnParams<T extends ProComponentObject> = {
  columns: ProColumns<T>
  currentColumn?: ProColumn<T>
}
// 查找下一个 column
const filterTypes = ['option']
export const findNextColumn = <T extends ProComponentObject>({
  columns,
  currentColumn,
}: FindNextColumnParams<T>) => {
  // 循环查找下一个可 foucs 的 column
  const start = currentColumn
    ? columns.findIndex((item) => item.dataKey === currentColumn.dataKey)
    : -1
  const end = columns.length - 1
  let nextColumn
  let i = start
  while (i < end) {
    i += 1
    if (!filterTypes.includes(columns[i].valueType || 'text') && columnCanFocus(columns[i])) {
      nextColumn = columns[i]
      break
    }
  }
  return nextColumn
}
const getRequiredColumns = <T extends ProComponentObject>(columns: ProColumns<T>) => {
  const requiredColumns = columns.filter((column) => column.required)
  return requiredColumns.length > 0 ? requiredColumns : columns
}
// 有 keyboardFirstCell 先取 keyboardFirstCell，如果 keyboardFirstCell 不存在 columns 中，则认为使用默认规则，优先取必填项
const getRealColumns = <T extends ProComponentObject>(
  columns: ProColumns<T>,
  keyboardFirstCell?: string,
) => {
  let currentColumns = columns
  if (keyboardFirstCell) {
    const index = currentColumns.findIndex((item) => item.dataKey! === keyboardFirstCell)
    if (index > -1) {
      currentColumns = currentColumns.slice(index)
    } else {
      currentColumns = getRequiredColumns(currentColumns)
    }
  } else {
    // 优先取必填 column
    currentColumns = getRequiredColumns(currentColumns)
  }
  return currentColumns
}
type ProEnterParams<T extends ProComponentObject> = {
  columns: ProColumns<T>
  editContext: ProTableEditContext<T>
  rowData: T
  currentColumn?: ProColumn<T>
  hasEnter?: boolean // 是否需要 enter 换行，点击新增一行时定位到 column 使用
}
// enter 键处理
export const handleEnter = <T extends ProComponentObject>(enterParams: ProEnterParams<T>) => {
  const { editContext, columns, currentColumn, rowData, hasEnter = true } = enterParams
  const { getRowKey, editingRowKeys, editable: editableConfig, editingCell } = editContext
  const keyboardFirstCell = editableConfig.value?.keyboardFirstCell
  const keyboardColumns = editableConfig.value?.keyboardColumns
  const enterColumn = editableConfig.value?.keyboardNextCell
  // 外部传入 keyboardColumns，则使用 keyboardColumns
  let lastColumns = columns
  // columns 可配置
  if (keyboardColumns) {
    lastColumns = columns.filter((item) => keyboardColumns.includes(item.dataKey!))
  }
  // currentColumn 不存在表示下一个永远是第一个可编辑 cell
  if (!currentColumn) {
    lastColumns = getRealColumns(lastColumns, keyboardFirstCell)
  }
  const nextColumn = findNextColumn({ columns: lastColumns, currentColumn })
  // 如果没有找到下一个，则认为是换行
  if (isUndefined(nextColumn)) {
    lastColumns = getRealColumns(lastColumns, keyboardFirstCell)
  }
  const columnKey = currentColumn?.dataKey
  const isEnter = hasEnter && enterColumn === columnKey
  const type = editableConfig.value?.type

  const operateMethod = (column: ProColumn<T>, data: T) => {
    const rowKeyValue = getRowKey.value(data)
    if (type === 'cell') {
      editingCell.value = column.dataKey
      editingRowKeys.value = [rowKeyValue]
      // checkbox 需要特殊处理
      if (column.valueType === 'checkbox') {
        nextTick(() => {
          const checkboxElement = editContext.getFormInstanceByKey(column.dataKey!, data)
          checkboxElement?.focus()
        })
      }
    } else {
      const instance = editContext.getFormInstanceByKey(column.dataKey!, data)
      nextTick(() => {
        instance?.focus?.()
      })
    }
    // 如果有滚动条需要定位
    const rowIndex = findRowIndex<T>(editContext.getData(), getRowKey.value, rowKeyValue)
    const columnIndex = findColumnIndex(columns, column.dataKey)
    editContext.setScrollTop(rowIndex, columnIndex)
  }

  // 有下一列且不是进入下一行
  if (nextColumn && !isEnter) {
    operateMethod(nextColumn, rowData)
  } else {
    // 如果不存在则认为到最后一列了，需要换行；如果当前是底部，则新增一行
    const curRowKey = getRowKey.value(rowData)
    const nextRow = getNextRowData<T>(editContext.getData(), (item) => {
      return curRowKey === getRowKey.value(item)
    })
    // 如果是新增，onCreate 会执行 handleEnter，无需重复执行 focus
    if (!nextRow) {
      editContext.onCreate(new MouseEvent('click', { bubbles: true }))
      return
    }
    // const nextRowKey = getRowKey.value(nextRow)
    const newCurrentColumn = findNextColumn({ columns: lastColumns })
    if (newCurrentColumn) {
      nextTick(() => {
        operateMethod(newCurrentColumn, nextRow)
      })
    }
  }
}
// 根据传入的 rowData 和 columnKey，定位到对应行列
export const setColumnInstance = <T extends ProComponentObject>(
  rowData: T,
  columnKey: string,
  editContext: ProTableEditContext<T>,
  columns: ProColumns<T>,
) => {
  const { getRowKey, editingRowKeys, editable: editableConfig, editingCell } = editContext
  const rowKeyValue = getRowKey.value(rowData)
  const type = editableConfig.value?.type
  const currentColumn = findColumnByKey(columns, columnKey)
  if (type === 'cell') {
    editingCell.value = columnKey
    editingRowKeys.value = [rowKeyValue]
    // checkbox 需要特殊处理
    if (currentColumn?.valueType === 'checkbox') {
      nextTick(() => {
        const checkboxElement = editContext.getFormInstanceByKey(columnKey, rowData)
        checkboxElement?.focus()
      })
    }
  } else {
    const instance = editContext.getFormInstanceByKey(columnKey, rowData)
    nextTick(() => {
      instance?.focus?.()
    })
  }
  // 如果有滚动条需要定位
  const rowIndex = findRowIndex<T>(editContext.getData(), getRowKey.value, rowKeyValue)
  const columnIndex = findColumnIndex(columns, columnKey)
  editContext.setScrollTop(rowIndex, columnIndex)
}
