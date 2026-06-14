<template>
  <ElTable
    v-if="!props.virtual"
    border
    ref="tableRef"
    :max-height="props.autoHeight ? props.maxHeight : props.bodyHeight"
    :height="props.sameMaxHeight ? props.bodyHeight : undefined"
    :data="props.tableData"
    :rowClassName="rowClassName"
    :default-expand-all="expandableProps.defaultExpandAllRows"
    :preserve-expanded-content="expandableProps.preserveExpandedContent"
    :expand-row-keys="expandedRowString"
    :row-key="props.rowKey"
    :load="load"
    @scroll="props.onScroll"
    @cell-contextmenu="handleCellContextMenu"
    @row-contextmenu="handleRowContextMenu"
    @header-contextmenu="handleHeaderContextMenu"
    @expand-change="handleExpandChange"
    v-bind="tableAttrs"
    @row-click="handleRowClick"
  >
    <RenderCustom :content="columnVNode" />
    <template #empty>
      <slot name="empty" />
      <component :is="getEmpty" />
    </template>
  </ElTable>
  <ElTableV2
    v-else
    :fixed="true"
    :rowKey="props.rowKey"
    :max-height="props.bodyHeight"
    :height="props.bodyHeight"
    :width="props.bodyWidth"
    :data="props.tableData"
    :columns="columnsV2"
    :row-class="rowClassName"
    :header-height="normalHeight"
    :row-height="normalHeight"
    @scroll="props.onScroll"
    v-bind="tableAttrs"
    :row-event-handlers="RowEventHandlers"
  >
    <template #empty>
      <slot name="empty" />
      <component :is="getEmpty" />
    </template>
  </ElTableV2>
  <div class="pro-table--loading" :class="waterfallStyle" v-if="props.loading">
    <div class="el-loading-spinner">
      <svg class="circular" viewBox="0 0 50 50">
        <circle class="path" cx="25" cy="25" r="20" fill="none"></circle>
      </svg>
      <div class="pro-table--loading__text">加载中</div>
    </div>
  </div>
  <!-- @vue-generic {T} -->
  <TableMenu
    v-if="display"
    :class="className"
    :visible="visible"
    :options="options"
    :layoutCoord="layoutCoord"
    :changeVisible="changeVisible"
    :justOpen="justOpen"
  />
</template>
<style lang="less">
.pro-table--loading {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.5);
  font-size: var(--font-size-small);
  transition: opacity 0.3s;
  z-index: 99;

  .circular {
    vertical-align: middle;
  }

  &__text {
    display: inline-block;
    color: var(--el-color-primary);
    font-size: 14px;
    vertical-align: middle;
    margin-left: 8px;
  }

  &__waterfall {
    top: auto;
    height: 32px;

    .el-loading-spinner {
      margin-top: -12px;
    }

    .el-loading-spinner .circular {
      width: 24px;
      height: 24px;
    }
  }
}
.pro-table--empty {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
}
.pro-table--row--removed {
  color: var(--el-color-danger);
}
</style>
<script lang="ts" setup generic="T extends ProComponentObject">
import {
  computed,
  h,
  inject,
  useAttrs,
  ref,
  watch,
  useSlots,
  shallowRef,
  type VNode,
  type Ref,
  type Slots,
  provide,
} from 'vue'
import {
  ElTable,
  ElTableV2,
  type TableInstance,
  type TreeNode,
  type RowEventHandlerParams,
} from 'element-plus'
import { isEqual, omit } from 'lodash-unified'
import ProColumn from './proColumn.vue'
import TableMenu from './menu.vue'
import { useMenu } from './useMenu'
import { removeInternalKey, getDataFromKeys, getFixedColumnsWidth, isColumnFixed } from './utils'
import { getValue } from '../utils/value'
import { isNumber, isBoolean } from '../utils'
import { RenderCustom } from '../utils/renderCustom'
import type { ProComponentObject, ProComponentAny } from '../common.types'
import type {
  ProTableProviderProps,
  ProTableContentProps,
  ProTableContentInstance,
  ProColumns,
  ProTableContentProvider,
  ProTableRowAndColumnType,
  ProV2Columns,
  KeyType,
} from './table.types'
defineOptions({
  name: 'ProTableContent',
  inheritAttrs: false,
})

// 定义插槽类型
defineSlots<{
  // 展开行插槽
  expand: (props: { row: T; column: ProComponentAny; $index: number }) => ProComponentAny
  // 空状态插槽
  empty: () => ProComponentAny
}>()
// 事件
const emit = defineEmits<{
  'current-change': [row: T | null, oldRow: T | null]
}>()
const normalHeight = 32
const slots: Slots = useSlots()
// 是展开行，不是树形展开，两者部分 props 会冲突，可能是最新版的 bug，先临时处理
const isExpand = computed(() => !!slots.expand)
const tableRef = ref<TableInstance>()

// 支持水平滚动
const setScrollTop = (rowIndex: number, columnIndex?: number) => {
  const tableEl = tableRef.value?.$el
  const wrapper = tableEl?.querySelector('.el-scrollbar__wrap')
  const rows = tableEl?.querySelectorAll('.el-table__body-wrapper tbody tr')
  const targetRow = rows?.[rowIndex]

  if (!wrapper || !targetRow) {
    return
  }
  const hasColumn = isNumber(columnIndex)
  let targetColumn
  if (hasColumn) {
    targetColumn = targetRow.querySelectorAll('.el-table__cell')[columnIndex]
  }

  const wrapperTop = wrapper.scrollTop
  const wrapperHeight = wrapper.clientHeight
  const rowOffsetTop = targetRow.offsetTop
  const rowHeight = targetRow.offsetHeight

  // 判断是否在可视区域内
  const rowOffsetY = rowOffsetTop + rowHeight
  const isAbove = rowOffsetTop < wrapperTop
  const isBelow = rowOffsetY > wrapperTop + wrapperHeight
  if (isAbove || isBelow) {
    tableRef.value?.setScrollTop(rowOffsetY - wrapperHeight)
  }
  // console.log('=targetColumn=', targetColumn)
  // 横向判断，不是 fixed 才需要
  if (targetColumn && !isColumnFixed(targetColumn)) {
    const offsetHor = getFixedColumnsWidth(targetColumn)
    const wrapperLeft = wrapper.scrollLeft
    const wrapperWidth = wrapper.clientWidth - offsetHor.left - offsetHor.right

    const columnOffsetLeft = targetColumn.offsetLeft
    const columnWidth = targetColumn.offsetWidth
    const columnOffsetX = columnOffsetLeft + columnWidth
    const isLeft = columnOffsetLeft < wrapperLeft
    const isRight = columnOffsetX > wrapperLeft + wrapperWidth
    // console.log('=targetColumn111=', isLeft, isRight)
    if (isLeft || isRight) {
      tableRef.value?.setScrollLeft(columnOffsetX - wrapperWidth)
    }
  }
}
// 获取 old 选中的行
const getOldRow = () => {
  let oldRow = null
  if (currentChangeRowKey.value) {
    const oldRows = getDataFromKeys([currentChangeRowKey.value], props.tableData, getRowKey.value)
    if (oldRows.length) {
      oldRow = oldRows[0]
    }
  }
  return oldRow
}

defineExpose<ProTableContentInstance<T>>({
  getElTableInstance: () => tableRef,
  setScrollTop: setScrollTop,
  setCurrentRow: (row: T, isEmit?: boolean) => {
    // tableRef.value?.setCurrentRow(row)
    const rowKey = row ? getRowKey.value(row) : ''
    if (rowKey === currentChangeRowKey.value && !props.currentChangeRepeat) {
      return
    }
    const needEmit = isEmit ?? true
    if (needEmit) {
      emit('current-change', row, getOldRow())
    }
    currentChangeRowKey.value = rowKey
    // selectionRowKeys.value = row ? [getRowKey.value(row)] : []
  },
  // 获取当前选中的 row
  getCurrentRow: () => {
    return getOldRow()
  },
  // 触发当前的 current-change
  emitCurrentChange: () => {
    // 当前有选中才触发
    if (currentChangeRowKey.value) {
      const row = getOldRow()
      if (row) {
        emit('current-change', row, row)
      }
    }
  },
})
const ProTableData = inject<ProTableProviderProps<T>>('ProTableData')!
const rowSelectionProps = ProTableData.rowSelectionProps
const selectionRowKeys = ProTableData.selectionRowKeys
const getRowKey = ProTableData.getRowKey
const columns = computed(() => {
  return ProTableData?.columns.value || []
})
const columnsV2 = computed<ProV2Columns>(() => {
  const originColumns = ProTableData?.columns.value || []
  // 把 width 转换成数字
  return originColumns.map((item) => {
    const { width, minWidth, ...rest } = item
    let lastWidth = 1
    if (width) {
      lastWidth = Number(width)
    } else if (minWidth) {
      lastWidth = Number(minWidth)
    }
    return { width: lastWidth, ...rest }
  }) as ProV2Columns
})
const attrs = useAttrs()
const excludeKeys = ['onCurrentChange', 'onRowClick', 'rowEventHandlers', 'load']
const tableAttrs = computed(() => {
  return Object.fromEntries(Object.entries(attrs).filter(([key]) => !excludeKeys.includes(key)))
})
const props = withDefaults(defineProps<ProTableContentProps<T>>(), {
  loading: undefined,
  first: false,
  waterfall: false,
  virtual: false,
  highlightCurrentRow: true,
  emptyText: '暂无数据',
})
// 拦截 load，ElTable加载后不会通知组件外 data 的变更
const load = computed(() => {
  const load = attrs.load
  if (typeof load === 'function') {
    return (row: T, treeNode: TreeNode, resolve: (data: T[]) => void) => {
      const interceptResolve = (data: T[]) => {
        // 设置 children
        if (data && data.length > 0) {
          const list = ProTableData.tableData.value
          const matched = list.find((item) => getRowKey.value(item) === getRowKey.value(row))
          if (matched) {
            ;(matched as T & { children?: T[] }).children = data
          }
          // 触发 tableData 的变更
          ProTableData.setTableData(list.slice(), true)
        }
        resolve(data)
      }
      load(row, treeNode, interceptResolve)
    }
  }
  return undefined
})
// 展开行
const expandableProps = computed(() => {
  const expandableOrigin = props.expandable
  if (expandableOrigin) {
    const {
      defaultExpandAllRows = false,
      defaultExpandedRowKeys,
      expandedRowKeys,
      preserveExpandedContent = false,
      onExpandedRowsChange,
    } = expandableOrigin
    return {
      defaultExpandAllRows,
      defaultExpandedRowKeys,
      expandedRowKeys,
      preserveExpandedContent,
      onExpandedRowsChange,
    }
  }
  return {}
})
const expandedRowKeys = ref<KeyType[]>(
  expandableProps.value.expandedRowKeys || expandableProps.value.defaultExpandedRowKeys || [],
)
// 普通 table 使用
const expandedRowString = computed(() => {
  return isExpand.value ? (expandedRowKeys.value as string[]) : undefined
})
// expandedRowKeys
watch(
  () => props.expandable?.expandedRowKeys,
  (newVal) => {
    if (!isEqual(newVal, expandedRowKeys.value)) {
      expandedRowKeys.value = newVal || []
    }
  },
)
const handleExpandChange = (row: T, expandedRows: T[]) => {
  const rows = isBoolean(expandedRows)
    ? expandedRows
      ? [row]
      : []
    : removeInternalKey<T>(expandedRows)
  const keys = rows.map((item: T) => getRowKey.value(item))
  expandedRowKeys.value = keys
  expandableProps.value.onExpandedRowsChange?.(keys, rows)
}

const {
  className,
  display,
  visible,
  options,
  justOpen,
  layoutCoord,
  rowAndColumn,
  changeVisible,
  handleRowContextMenu,
  handleCellContextMenu,
  handleHeaderContextMenu,
} = useMenu(() => {
  const tableEl = tableRef.value?.$el
  return tableEl
}, props.menuConfig)

provide<ProTableContentProvider<T>>('ProTableContentData', {
  rowAndColumn: rowAndColumn as Ref<ProTableRowAndColumnType<T>>,
})
const defaultRowKey = props.currentSelectedRow ? getRowKey.value(props.currentSelectedRow) : ''
const currentChangeRowKey = ref<KeyType>(defaultRowKey)
// 监听 currentSelectedRow 变化，同步到 currentChangeRowKey
watch(
  () => props.currentSelectedRow,
  (v) => {
    if (v) {
      const rowKey = getRowKey.value(v)
      if (rowKey !== currentChangeRowKey.value) {
        emit('current-change', v, getOldRow())
        // 先取当前为 old，再赋值
        currentChangeRowKey.value = rowKey
      }
    } else {
      // 清空
      emit('current-change', null, getOldRow())
      currentChangeRowKey.value = ''
    }
  },
)
// 参数 row, rowIndex
// v2 参数 columns, rowData, rowIndex
const rowClassName = (data: { rowData?: T; row?: T; rowIndex: number }) => {
  const propsRowClassName = props.rowClassName
  const { row, rowData, rowIndex } = data
  const lastData = (rowData || row) as T
  const realData = removeInternalKey(lastData)
  const allCls = []
  if (props.highlightCurrentRow && currentChangeRowKey) {
    const currentRowKey = getRowKey.value(lastData)
    // if (selectionRowKeys.value.includes(currentRowKey)) {
    //   allCls.push('current-row')
    // }
    if (currentChangeRowKey.value === currentRowKey) {
      allCls.push('current-row')
    }
  }
  const cls = propsRowClassName({ row: realData, rowData: realData, rowIndex })
  if (cls) {
    allCls.push(cls)
  }
  const removedKey = props.removedKey
  if (removedKey) {
    const isRemoved = getValue(realData, removedKey)
    if (isRemoved) {
      allCls.push('pro-table--row--removed')
    }
  }
  return allCls.join(' ')
}
// 单击行选中, v1 参数 row, column, event v2 参数 { rowData, rowIndex, rowKey, event }
const handleRowClick = (row: T, _column: ProComponentAny, event: Event) => {
  const { rowClick, type, selectable } = rowSelectionProps.value
  const rowKey = getRowKey.value(row)
  // 单击 row 多选
  if (rowClick && type && type === 'checkbox') {
    const hasSelected = selectable(row)
    if (hasSelected === false) {
      return
    }
    const copyRowKeys = selectionRowKeys.value.slice()
    const matchIndex = copyRowKeys.findIndex((item) => item === rowKey)
    if (matchIndex > -1) {
      // 清除
      copyRowKeys.splice(matchIndex, 1)
    } else {
      // 选中
      copyRowKeys.push(rowKey)
    }
    selectionRowKeys.value = copyRowKeys
  } else {
    // 单击 row 单选
    if (rowKey === currentChangeRowKey.value && !props.currentChangeRepeat) {
      return
    }
    emit('current-change', row, getOldRow())
    currentChangeRowKey.value = rowKey
    // selectionRowKeys.value = [rowKey]
  }
  if (typeof attrs.onRowClick === 'function') {
    attrs.onRowClick(row, event)
  }
}

// RowEventHandlers 事件集合
const RowEventHandlers = {
  onClick: (data: RowEventHandlerParams) => {
    const { rowData, event } = data
    handleRowClick(rowData, undefined, event)
  },
  onContextmenu: (data: RowEventHandlerParams) => {
    const { rowData, event } = data
    handleRowContextMenu?.(rowData, undefined, event as MouseEvent)
  },
}
const waterfallStyle = computed(() => {
  // 不是第一次请求且要展示 loading
  // console.log('==', props.first, props.waterfall, props.loading)
  const rl = !props.first && props.waterfall
  return rl ? 'pro-table--loading__waterfall' : ''
})
// empty
const getEmpty = () => {
  if (typeof slots.empty === 'function') {
    return
  }
  if (props.loading) {
    return h('div')
  }
  return h(
    'div',
    {
      class: 'pro-table--empty',
    },
    {
      default: () => {
        return [h('span', props.emptyText)]
      },
    },
  )
}
// 递归处理 columns
const callColumns = (columns: ProColumns<T>): VNode[] => {
  // 递归处理，可能会有 children
  const tagColumns = columns.map((column, index) => {
    if (column.children && column.children.length > 0) {
      return h(
        ProColumn<T>,
        {
          key: `proChildren_${index}`,
          ...omit(column, 'children'),
        },
        {
          default: () => {
            const kids = callColumns(column.children as ProColumns<T>)
            // console.log('==kids==', kids)
            return kids
          },
        },
      )
    }
    const isOperate = column.valueType === 'option'
    const key = isOperate ? 'proColumn_option' : column.dataKey || `proColumn_${index}`
    // console.log("=key=", key);
    return h(ProColumn<T>, {
      key: key,
      ...column,
    })
  })
  if (slots.expand) {
    tagColumns.unshift(
      h(
        ProColumn<T>,
        {
          type: 'expand',
        },
        {
          default: slots.expand,
        },
      ),
    )
  }
  return tagColumns
}
// columns 存在
const getColumns = (columnsValue: ProColumns<T>) => {
  if (columnsValue.length === 0) {
    return null
  }
  return callColumns(columnsValue)
}
const columnVNode = shallowRef<() => VNode | VNode[] | null>(() => getColumns(columns.value))
watch(
  () => columns.value,
  (newColumn) => {
    columnVNode.value = () => getColumns(newColumn)
  },
)
</script>
