import type { ProColumns, ProColumn, ProCellRenderer } from './table.types'
import type { ProUnifyTableColumnsContext } from './proTable.types'
import type { ProComponentAny, ProComponentObject } from '../common.types'
import { computed, type ComputedRef, type Ref } from 'vue'
import HeaderCell, { type ProTabeHeaderCellProps } from './headerCell'
import TableCell, { type ProTableCellProps } from './tableCell.vue'
import SeqCell from './seqCell.vue'
import ProTableCheckbox from './tableCheckbox.vue'
import ProTableHeaderCheckbox from './headerCheckbox.vue'
import { ActionButton } from '../index'

// 获取 column 类名集合
const rowClassName = <T extends ProComponentObject>(column: ProColumn<T>) => {
  const arr = []
  if (column.class) {
    arr.push(column.class)
  }
  if (column.className) {
    arr.push(column.className)
  }
  if (column.valueType && ['option'].includes(column.valueType)) {
    arr.push('pro-table--body__operate')
  }
  if (column.type === 'seq' || column.type === 'index') {
    arr.push('pro-table--body__seq')
  }
  return arr.join(' ')
}

const getHeaderRender = <T extends ProComponentObject>(column: ProColumn<T>) => {
  return (params: Pick<ProTabeHeaderCellProps<T>, 'column' | 'columnIndex' | 'class'>) => {
    const props: ProTabeHeaderCellProps<T> = {
      ...params,
      tooltip: column.tooltip,
      required: column.required,
      dataKey: column.dataKey,
    }
    // 表头展示复选框
    if (column.headerIsAll && column.valueType === 'checkbox') {
      return <ProTableHeaderCheckbox<T> {...props} />
    }
    const dom = <HeaderCell<T> {...props} />
    return column.headerCellRenderer ? column.headerCellRenderer(props) : dom
  }
}
export function useColumns<T extends ProComponentObject>(
  proColumns: Ref<ProColumns<T> | undefined>,
  editContext: ProUnifyTableColumnsContext<T>,
): ComputedRef<ProColumns<T>> {
  const tableColumns = computed(() => {
    // 过滤不展示在 table 的 column
    const filterColumns = (proColumns.value || [])
      .filter((item) => {
        if (item.hideInTable) {
          return false
        }
        return true
      })
      .map((item) => {
        const { label, title, prop, dataKey, field, ...rest } = item
        const realTitle = title || label
        const realKey = dataKey || prop || field
        return {
          title: realTitle,
          dataKey: realKey,
          ...rest,
        }
      })
    // console.log('=filterColumns=', filterColumns)
    const retColumns = filterColumns.map((proColumn) => {
      const {
        children,
        ellipsis,
        copyable,
        tooltip: _tooltip,
        editable,
        required,
        editCellRenderer,
        cellRenderer: elementCellRenderer,
        render: vxeRenderer,
        ...rest
      } = proColumn
      // 此处需要把 render 方法更转成 cellRenderer
      const cellRenderer =
        vxeRenderer || elementCellRenderer
          ? (record: ProComponentAny) => {
              if (vxeRenderer) {
                return vxeRenderer(record.rowData, record.rowIndex)
              }
              if (!record.row) {
                record.row = record.rowData
              }
              return (elementCellRenderer as ProCellRenderer<T>)(record)
            }
          : undefined
      // column-class
      const columnClass = rowClassName(proColumn)
      // 如果是操作列
      if (proColumn.valueType === 'option') {
        const operateColumn: ProColumn<T> = {
          ...rest,
          class: columnClass,
          cellRenderer: proColumn.actions
            ? (record: ProComponentAny) => {
                // 渲染 ActionButtons
                const actions = proColumn.actions || []
                return (
                  <>
                    {actions.map((action) => (
                      <ActionButton<T> {...action} rowData={record.rowData} />
                    ))}
                  </>
                )
              }
            : cellRenderer,
        }
        return operateColumn
      }
      // 如果存在 children，则认为是多级表头
      if (children) {
        const childColumns = useColumns(
          computed(() => children),
          editContext,
        )
        return {
          ...rest,
          required,
          class: columnClass,
          headerCellRenderer: getHeaderRender<T>(proColumn),
          children: childColumns.value,
        }
      }
      const column: ProColumn<T> = {
        ...rest,
        required,
        class: columnClass,
        headerCellRenderer: getHeaderRender<T>(proColumn),
        cellRenderer: (params) => {
          const { getRowKey, pipeline } = editContext
          const rowKeyValue = getRowKey.value(params.rowData)
          // 序号需要根据数组的序号返回，rowIndex 在 children 树形场景会把 children 的 row 计算
          if (proColumn.type === 'seq' || proColumn.type === 'index') {
            return <SeqCell<T> rowValue={rowKeyValue} />
          }
          const columnKey = proColumn.dataKey
          const extra = pipeline.run({
            rowKeyValue,
            columnKey,
            proColumn,
            rowData: params.rowData,
          })
          const props: ProTableCellProps<T> = {
            ...params,
            ...extra,
            column: proColumn,
            required,
            ellipsis,
            copyable,
            editable,
            cellRenderer,
            editCellRenderer,
            getRowKey: getRowKey.value,
          }
          return <TableCell<T> {...props} />
        },
      }
      return column
    })
    // 如果需要多选框，则需要在最前面添加一列
    if (editContext.rowSelectionType === 'checkbox') {
      retColumns.unshift({
        key: 'selection',
        type: 'selection',
        width: 35,
        align: 'center',
        cellRenderer: ({ rowData }) => {
          const rowValue = editContext.getRowKey.value(rowData)
          return <ProTableCheckbox<T> rowValue={rowValue} rowData={rowData} />
        },
        headerCellRenderer: () => {
          return <ProTableCheckbox<T> all={true} />
        },
      })
    }
    return retColumns
  })

  return tableColumns
}
