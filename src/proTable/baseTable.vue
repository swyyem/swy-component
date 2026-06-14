<script lang="ts" setup generic="OriginT extends ProComponentObject">
/**
 * 表格的常规展示
 * 支持分页，搜索功能
 */
import {
  computed,
  nextTick,
  toRaw,
  ref,
  provide,
  useAttrs,
  watch,
  type VNode,
  type Ref,
  toRef,
  type ComputedRef,
  onMounted,
  onUnmounted,
  inject,
} from 'vue'
import { isArrowUp, isArrowDown, isEnter } from '../utils/keyboard'
import { createDeferredExecutor } from '../utils/defer'
import { isUndefined } from '../utils'
import { getValue } from '../utils/value'
import {
  editTableDataByRow,
  getIndexFormKeys,
  getEditColumnsKey,
  getDataIndexByRowKey,
  removeInternalKey,
  getColumnsDepth,
} from './utils'
import { importMethod, exportMethod } from './utils/tools'
import ProPage from './page.vue'
import ProTableToolbar from './toolbar.vue'
import ProTableContent from './content.vue'
import useRequest from './useRequest'
import { InternalKey, InternalAddPrefix } from './variable'
import { useNavigate } from './useNavigate'
import { useResize } from './useResize'
import { useCheck } from './useCheck'
import type { ProComponentAny, ProComponentObject } from '../common.types'
import type {
  KeyType,
  ProBaseTableProps,
  ProTableToolbarProps,
  ProBaseTableInstance,
  ProTableProviderProps,
  ProColumns,
  ProPagerProps,
  ProTableEmits,
  ProTableToolbarInstance,
  ProTableToolbarExportProps,
  ProTableRowDirection,
  ProTableContentInstance,
} from './table.types'
import type { ProUnifyTableProviderProps } from './proTable.types'
import type { ProTableEditProviderProps } from './proTableEdit.types'
import { useDynamicPageSize } from './useDynamicPageSize'
import { omit } from 'lodash-unified'

type T = OriginT & {
  [InternalKey]?: string
}
defineOptions({
  name: 'ProBaseTable',
  inheritAttrs: false,
})
const props = withDefaults(defineProps<ProBaseTableProps<T>>(), {
  pagination: undefined,
  toolbar: undefined,
  manualRequest: undefined,
  recordCreatorProps: undefined,
  edit: false,
  editable: false,
  waterfall: false,
  autoHeight: false,
  sameMaxHeight: false,
  round: true,
  virtual: false,
  keyboard: false,
  currentChangeRepeat: false,
  refreshClearChecked: true,
})
const emit = defineEmits<ProTableEmits<T>>()
type VueChild = VNode | VNode[]
type SearchMethodType = (params?: ProComponentObject) => void
defineSlots<{
  // 操作列插槽
  'column-operating': (props: { actions: ProTableProviderProps<T>['actions'] }) => VNode[]
  // 展开行插槽
  expand: (props: { row: T; column: ProComponentObject; $index: number }) => VueChild
  default: (v: ProComponentObject) => VNode[]
  'toolbar-filters': (onSearch: SearchMethodType, searchForm: ProComponentObject) => VueChild
  'toolbar-search': (onSearch: SearchMethodType, searchForm: ProComponentObject) => VueChild
  'toolbar-buttons': (onSearch: SearchMethodType, searchForm: ProComponentObject) => VueChild
  'table-side': () => VueChild
  'body-bottom': () => VueChild
}>()
const attrs = useAttrs() as ProComponentAny
const columns = toRef(props, 'columns') as Ref<ProColumns<T>>
// 表格头部的嵌套深度
const columnsDepth = computed(() => {
  return getColumnsDepth(columns.value)
})
const rowSelection = toRef(props, 'rowSelection')
// key 的递增
const ProUnifyTableData = inject<ProUnifyTableProviderProps<T>>('ProUnifyTableData')!
const getRowKey = ProUnifyTableData.getRowKey
const internalIndex = ProUnifyTableData.internalIndex
// 选择相关
const {
  rowSelectionProps,
  selectionRowKeys,
  selectionRowDatas,
  selectionDataLoad,
  getSelectionRows,
} = useCheck({
  rowSelection: rowSelection,
  getRowKey: getRowKey,
  getData: () => getTableDataAndChildren(),
})

/** 工具栏相关 */
const showToolbar = computed(() => props.toolbar !== false)
const toolbar = computed<ProTableToolbarProps<T>>(() => {
  const inToolbar = props.toolbar
  return inToolbar || ({} as ProTableToolbarProps<T>)
})
// 显示页码，瀑布流和虚拟滚动不显示
const showPage = computed(() => {
  return props.pagination !== false && props.waterfall === false && !props.virtual
})
const dataRef = toRef(props, 'data')
const paramsRef = toRef(props, 'params')
// 选中第一行，第一次标记
const firstRef = ref(true)
const handleFirstCallback = () => {
  props.onFirstData?.()
  // 开启了键盘，需要把焦点定位在表格上
  if (props.keyboard) {
    ;(tableBodyRef.value?.firstElementChild as HTMLElement)?.focus()
    if (props.currentSelectedRow) {
      // 需要把指针移动到当前选中的行
      const currentRowKey = getRowKey.value(props.currentSelectedRow)
      const rowIndexArray: number[] = getIndexFormKeys(
        [currentRowKey],
        tableData.value,
        getRowKey.value,
      )
      if (rowIndexArray.length > 0) {
        setHoverIndex(rowIndexArray[0])
      }
    }
  }
}
// 延迟函数
const deferReadyExecutor = createDeferredExecutor()

// 计算是否需要动态计算分页
const isAutoPageSize = computed(() => {
  if (props.waterfall) {
    return true
  } else {
    if (props.pagination === undefined) {
      return true
    } else {
      return false
    }
  }
})

// 请求封装
const {
  tableData,
  searchForm,
  loading,
  pageInfo,
  first,
  fetchMethod,
  pureFetch,
  selectFetch,
  setLoading,
  getTableData,
  getTableDataHasKey,
  getRealTableDataHasKey,
  getTableDataAndChildren,
  getTableDataAllChildren,
  getTableChildrenByRowValue,
  getParentByRowValue,
  setTableData,
  setPage,
  setSearchForm,
  clearSearchForm,
  resetRequest,
  getTableDataSize,
  getRowDataByIndex,
} = useRequest<T>(props.request, {
  deferReadyExecutor,
  rowKey: props.rowKey,
  showPage: showPage.value,
  manualRequest: props.manualRequest,
  waterfall: props.waterfall || props.virtual,
  pagination: props.pagination,
  dataSource: props.dataSource,
  sliceRender: props.sliceRender,
  data: dataRef,
  params: paramsRef,
  tableFirstRef: firstRef,
  defaultData: props.defaultData,
  onLoad: (data: T[]) => {
    selectedCurrentRow()
    selectionDataLoad()
    props.onLoad?.(data)
  },
  onDataChange: (v: T[]) => emit('data-change', v),
  onRequestError: props.onRequestError,
  postData: props.postData,
  internalIndex: internalIndex,
  defaultSearchForm: props.defaultSearchForm,
  onFirst: handleFirstCallback,
  getEmptyColumnKeys: () => KeyboardEmptyColumnKeys.value,
  getDefaultRow: () => editableConfig.value?.defaultRow as boolean,
  getRowKey,
  isAutoPageSize,
})
// 页码
const pagination = computed(() => {
  let inPagination = props.pagination
  if (inPagination === false) {
    return {} as ProPagerProps['pagination']
  }
  inPagination = omit(inPagination || {}, ['pageSize', 'currentPage'])
  const originChange = (props.pagination as ProPagerProps['pagination'])?.onChange
  inPagination.onChange = (currentPage: number, pageSize: number) => {
    handlePageChange(currentPage, pageSize)
    originChange?.(currentPage, pageSize)
  }
  return {
    ...inPagination,
    ...pageInfo,
  } as ProPagerProps['pagination']
})
// 页码位置
const paginationAttr = computed(() => {
  let pos: 'top' | 'bottom' | undefined = undefined
  let placement: string | undefined = undefined
  if (showPage.value) {
    const { position } = pagination?.value || {}
    if (position !== null && Array.isArray(position)) {
      const topPos = position.find((p) => p.includes('top'))
      const bottomPos = position.find((p) => p.includes('bottom'))
      const isDisable = position.every((p) => `${p}` === 'none')
      if (!topPos && !bottomPos && !isDisable) {
        pos = 'bottom'
        placement = 'right'
      }
      if (topPos) {
        pos = 'top'
        placement = topPos.toLowerCase().replace('top', '')
      }
      if (bottomPos) {
        pos = 'bottom'
        placement = bottomPos.toLowerCase().replace('bottom', '')
      }
    } else {
      pos = 'bottom'
      placement = 'right'
    }
  }
  return pos && placement
    ? {
        pos,
        props: {
          ...pagination.value,
          class: `pro-pagination pro-pagination-${placement}`,
        },
      }
    : undefined
})
// 刷新标识
const refreshSign = ref(false)
// 刷新表格
const refresh = (clear?: boolean) => {
  refreshSign.value = true
  // 清空搜索条件和重置分页
  if (clear) {
    clearSearchForm()
    resetRequest()
  }
  // 清空选中
  if (props.refreshClearChecked) {
    selectionRowKeys.value = []
    selectionRowDatas.value = []
  }
  return fetchMethod().then(() => {
    tableContentRef.value?.emitCurrentChange()
  })
}
// 搜索事件
const handleSearch = (params?: ProComponentAny) => {
  // 有些控件如下拉框有延迟，故使用了 nextTick
  return nextTick().then(() => {
    setSearchForm(params || {})
    resetRequest()
    return fetchMethod()
  })
}
// 不重置页码的搜索
const handleCurrentSearch = (params?: ProComponentAny) => {
  nextTick(() => {
    setSearchForm(params || {})
    fetchMethod(true)
  })
}
// 由分页组件交互页码变化或者 pageSize 变化触发
const handlePageChange = (currentPage: number, pageSize: number) => {
  // pageInfo 变化引起的 pageChange 不执行, setPage 后都会自行请求
  if (currentPage === pageInfo.currentPage && pageSize === pageInfo.pageSize) {
    return
  }
  setPage({
    currentPage,
    pageSize,
  })
  fetchMethod()
}

const ProEditTableData = inject<ProTableEditProviderProps<T>>('ProEditTableData')!
const editMode = ProEditTableData.editMode
const editableConfig = ProEditTableData.editableConfig

const tableContentRef = ref<ProTableContentInstance<T>>()
/**
 * 设置了 firstRowSelected =true 的逻辑，没有设置则不处理
 * 整体看，只要数据发生变化了就需要处理 current-change
 * 1 第一次请求后选中第一行
 * 2 分页场景，下一页请求后也要选中第一行
 * 3 瀑布流场景，下一页不需要选中
 * 4 刷新和搜索，所有场景都需要重新触发一次 emit current-change，如果当前没有选中则不触发
 */
const selectedCurrentRow = () => {
  const tableContentIns = tableContentRef.value
  // 设置了 first 且 currentSelectedRow 未使用
  if (tableContentIns && props.firstRowSelected && isUndefined(props.currentSelectedRow)) {
    // 第一次选中第一行，搜索和 clear 的刷新
    if (firstRef.value) {
      tableContentIns.setCurrentRow(tableData.value[0])
    } else if (refreshSign.value) {
      // 非 clear 刷新
      const currentRow = tableContentIns.getCurrentRow()
      if (currentRow) {
        tableContentIns.emitCurrentChange()
      } else {
        tableContentIns.setCurrentRow(tableData.value[0])
      }
    } else if (!props.waterfall) {
      // 分页
      tableContentIns.setCurrentRow(tableData.value[0])
    }
  }
  refreshSign.value = false
}

watch(
  () => tableData.value,
  (newVal) => {
    // 只有 table.value 第一次赋值时
    if (firstRef.value) {
      // 设置下拉表格场景的默认位置
      const { selectedRowKeys } = rowSelectionProps.value
      const rowIndexArray: number[] = getIndexFormKeys(selectedRowKeys, newVal, getRowKey.value)
      // if (rowIndexArray.length > 0) {
      //   setHoverIndex(rowIndexArray[0])
      // }
      nextTick(() => {
        handleFirstCallback()
        const tableContentIns = tableContentRef.value
        // 有数据才执行
        if (newVal.length > 0) {
          tableContentIns?.setScrollTop(rowIndexArray[0])
        }
        firstRef.value = false
      })
    }
  },
)
// 圆角样式
const roundClass = computed(() => {
  const hasAdd = props.recordCreatorProps !== false && editMode.value
  return props.round ? (hasAdd ? 'pro-table--roundhalf' : 'pro-table--round') : ''
})
// virtual 下只能固定高度
const autoHeight = computed(() => {
  return props.virtual ? false : props.autoHeight
})
// 高度自适应样式
const autoHeightClass = computed(() => {
  return autoHeight.value ? 'pro-table--autoheight' : ''
})
// 表格高度同 max-height
const sameMaxHeight = computed(() => {
  return autoHeight.value ? false : props.sameMaxHeight
})
// 滚动信息
// 表格事件
const handleScroll = (v: { scrollLeft: number; scrollTop: number }) => {
  if (!props.waterfall) {
    return
  }
  const container = tableBodyRef.value?.querySelector('.el-scrollbar__wrap')
  if (container) {
    const maxScroll = container.scrollHeight - container.clientHeight
    if (maxScroll > 32 && v.scrollTop > maxScroll - 32) {
      if (loading.value) {
        return
      }
      setPage({
        currentPage: (pageInfo.currentPage || 1) + 1,
      })
      // 加载下一页
      fetchMethod()
    }
  }
}

// editableConfig 设置 keyboardEmptyColumns
const KeyboardEmptyColumnKeys: ComputedRef<string[]> = computed<string[]>(() => {
  // const columns = tableColumns.value
  const keyboardEmptyColumns = editableConfig.value?.keyboardEmptyColumns
  if (keyboardEmptyColumns) {
    return keyboardEmptyColumns
  }
  return getEditColumnsKey(columns.value)
})

// 可改变的 columns
const changeColumns = ref(columns.value) as Ref<ProColumns<T>>
watch(
  () => columns.value,
  (newVal) => {
    changeColumns.value = newVal
    // console.log('=changeColumns=', newVal)
  },
)
// 修改 columns
const setTableColumns = (columns: ProColumns<T>) => {
  changeColumns.value = columns
}
// 重置 columns
const resetTableColumns = () => {
  changeColumns.value = columns.value
}
// 只读存储一行的控件实例
const cellRefs = ref<ProComponentObject>({})
const setCellRef = (key: KeyType, ref: ProComponentAny) => {
  cellRefs.value[key as string] = ref
}
const getCellRef = (key?: KeyType) => {
  return key ? cellRefs.value[key as string] : cellRefs.value
}
// 表格容器和表格体的引用
const tableBodyRef = ref<HTMLElement | null>(null)
const tableHeaderRef = ref<ProTableToolbarInstance | null>(null)
const { bodyHeight, bodyWidth, maxHeight, calculateBodyHeight } = useResize({
  tableBodyRef,
  tableHeaderRef,
  height: props.height,
  maxHeight: props.maxHeight,
  autoHeight: autoHeight.value,
  width: props.width,
  hasCreator: props.recordCreatorProps !== false && editMode.value,
  hasPager: showPage.value && !props.waterfall,
})

// 4. 动态分页计算 Hook
const { getPageSize } = useDynamicPageSize({
  columnsDepth,
  bodyHeight,
  pageInfo,
  setPage: ({ pageSize }) => {
    setPage({
      pageSize,
      currentPage: 1,
    })
    fetchMethod()
  },
  firstRef: first,
  waterfall: props.waterfall,
  rowHeight: 33, // 每行高度基准
  isAutoPageSize,
})

const {
  setHoverIndex,
  navigateRow,
  setNavigateRow,
  getNavigateRow,
  scrollToCurrentRow,
  setRowClassName,
} = useNavigate({
  deferReadyExecutor,
  tableContentRef,
  rowSelectionProps,
  getCurrentSelectedRow: () => props.currentSelectedRow,
  rowClassName: props.rowClassName,
  getTableDataSize,
  getTableDataHasKey,
  getRowDataByIndex,
  getRowKey,
})

provide<ProTableProviderProps<T>>('ProTableData', {
  emit,
  getStore: () => tableContentRef.value?.getElTableInstance().value?.store,
  pageInfo: pageInfo,
  originColumns: columns,
  columns: changeColumns,
  setTableColumns,
  resetTableColumns,
  waterfall: props.waterfall,
  pureFetch: pureFetch,
  getRowKey: getRowKey,
  getSelectionRows: getSelectionRows,
  editableConfig: editableConfig,
  selectionRowKeys: selectionRowKeys,
  tableData: tableData,
  getTableData: getTableData,
  rowSelectionProps: rowSelectionProps,
  getCellRef: getCellRef,
  setCellRef: setCellRef,
  getDataIndexByRowKey: (list: T[], keyValue: KeyType) =>
    getDataIndexByRowKey<T>(list, keyValue, getRowKey.value),
  getTableDataAndChildren: getTableDataAndChildren,
  getTableDataAllChildren: getTableDataAllChildren,
  setTableData: setTableData,
  getTableChildrenByRowValue: getTableChildrenByRowValue,
  getParentByRowValue: getParentByRowValue,
  onSearch: handleSearch,
  onCurrentSearch: handleCurrentSearch,
  searchForm: searchForm,
})

// 表格键盘上下移动
const navigateOptions = (direction: ProTableRowDirection) => {
  navigateRow(direction)
}
// 表格回车事件
const selectOption = () => {
  const rowData = getNavigateRow()
  tableContentRef.value?.setCurrentRow(rowData)
}

// expose
defineExpose<ProBaseTableInstance<T>>({
  getData: getTableData,
  getSelectionRows: () => {
    const l = removeInternalKey<T>(getSelectionRows())
    return l
  },
  getDataHasKey: getTableDataHasKey,
  getRealDataHasKey: getRealTableDataHasKey,
  getTableDataSize: getTableDataSize,
  refresh: refresh,
  resize: calculateBodyHeight,
  onSearch: handleSearch,
  onCurrentSearch: handleCurrentSearch,
  selectFetch: selectFetch,
  setLoading: setLoading,
  setTableData, // 追加
  setData: setTableData, // 和 getData 呼应
  setDataClad: (data: T | T[]) => {
    // 覆盖已经存在 row 的值
    setTableData(editTableDataByRow<T>(data, getTableDataHasKey(), getRowKey.value), true)
  },
  setSearchForm,
  getSearchForm: () => toRaw(searchForm),
  navigateRow,
  setNavigateRow,
  updateRow: scrollToCurrentRow,
  setCurrentRow: (row: T) => {
    tableContentRef.value?.setCurrentRow(row)
  },
  actions: {
    exportMethod: (options?: ProTableToolbarExportProps) => {
      const params = options || {}
      const { includes, ...restParams } = params
      const originColumns = ref(changeColumns.value) as Ref<ProColumns<T>>
      if (includes) {
        originColumns.value = originColumns.value.filter((item) => {
          return includes.includes(item.dataKey!)
        })
      }
      return exportMethod<T>({
        ...restParams,
        getSelectionRows: getSelectionRows,
        pureFetch: pureFetch,
        columns: originColumns,
        getCellRef: getCellRef,
        getTableData: getTableData,
      })
    },
    importMethod: importMethod,
  },
  setScrollTop: (rowIndex: number, columnIndex?: number) => {
    return tableContentRef.value?.setScrollTop(rowIndex, columnIndex)
  },
  tableBodyRef,
  getRowIsLocal: (row: T) => {
    const key = getValue(row, InternalKey)
    return key.startsWith(InternalAddPrefix)
  },
})

// 键盘事件
const handleKeydown = (e: Event) => {
  const event = e as KeyboardEvent
  event.preventDefault()
  event.stopPropagation()
  if (isArrowDown(event)) {
    navigateOptions('next')
  } else if (isArrowUp(event)) {
    navigateOptions('prev')
  } else if (isEnter(event)) {
    selectOption()
  }
}
onMounted(async () => {
  // 等待布局稳定
  await nextTick()
  // 键盘事件
  if (props.keyboard) {
    tableBodyRef.value?.firstElementChild?.addEventListener('keydown', handleKeydown)
  }
  // 初次请求
  if (isAutoPageSize.value && props.manualRequest !== true) {
    const pageSize = getPageSize()
    setPage({ pageSize })
    // 如果 pageSize 和当前的 pageInfo.pageSize 一致，不会触发 page 的 onChange
    // 初始化时，无论是否是瀑布流，都应该请求一次
    // if (props.waterfall) {
    fetchMethod()
    // }
  }
})
onUnmounted(() => {
  if (props.keyboard) {
    tableBodyRef.value?.firstElementChild?.removeEventListener('keydown', handleKeydown)
  }
})
</script>

<template>
  <div
    :class="['pro-table', roundClass, autoHeightClass, props.containerClass, props.tableClassName]"
  >
    <!-- @vue-generic {T} -->
    <ProTableToolbar ref="tableHeaderRef" v-if="showToolbar" v-bind="toolbar">
      <template #toolbar-filters v-if="$slots['toolbar-filters']">
        <slot
          name="toolbar-filters"
          :onSearch="handleSearch"
          :onCurrentSearch="handleCurrentSearch"
          :searchForm="searchForm"
        ></slot>
      </template>
      <template #toolbar-search v-if="$slots['toolbar-search']">
        <slot
          name="toolbar-search"
          :onSearch="handleSearch"
          :onCurrentSearch="handleCurrentSearch"
          :searchForm="searchForm"
        ></slot>
      </template>
      <template #toolbar-buttons v-if="$slots['toolbar-buttons']">
        <slot name="toolbar-buttons"></slot>
      </template>
    </ProTableToolbar>
    <div
      class="pro-table--body"
      :class="[
        {
          'pro-table--body__row': $slots['table-side'],
        },
        props.bodyClassName,
      ]"
      ref="tableBodyRef"
    >
      <div
        class="pro-table--body__main"
        :class="props.bodyMainClassName"
        v-bind="props.keyboard ? { tabindex: 0 } : {}"
      >
        <ProPage
          v-if="showPage && paginationAttr?.pos === 'top'"
          :pagination="paginationAttr?.props"
        />
        <!-- @vue-generic {T} -->
        <ProTableContent
          ref="tableContentRef"
          :bodyHeight="bodyHeight"
          :bodyWidth="bodyWidth"
          :maxHeight="maxHeight"
          :loading="loading"
          :tableData="tableData"
          :rowKey="props.rowKey"
          :waterfall="props.waterfall"
          :virtual="props.virtual"
          :first="first"
          :rowClassName="setRowClassName"
          :menuConfig="props.menuConfig"
          :expandable="props.expandable"
          :autoHeight="autoHeight"
          :sameMaxHeight="sameMaxHeight"
          :emptyText="props.emptyText"
          :removedKey="props.removedKey"
          :currentSelectedRow="props.currentSelectedRow"
          :currentChangeRepeat="props.currentChangeRepeat"
          v-bind="attrs"
          @scroll="handleScroll"
        >
          <slot />
          <template #expand="slotData" v-if="$slots['expand']">
            <slot name="expand" v-bind="slotData"></slot>
          </template>
        </ProTableContent>
        <slot name="body-bottom"></slot>
        <ProPage
          v-if="showPage && paginationAttr?.pos === 'bottom'"
          :pagination="paginationAttr?.props"
        />
      </div>
      <slot name="table-side" />
    </div>
  </div>
</template>

<style lang="less">
.pro-table {
  display: flex;
  flex-direction: column;
  height: 100%;

  &--autoheight {
    height: auto;
  }

  /* profield 的样式，内部控件存在 inline-flex，导致外层有 1px 的间隙，该样式可解决 */
  .component-box {
    line-height: 0;
  }

  .pro-column--read {
    .component-box {
      line-height: inherit;
    }
  }

  & &--body {
    --el-border-radius-base: 0;

    flex: 1;
    min-height: 0;
    flex-direction: column;
    display: flex;

    &__row {
      flex-direction: row;
    }

    &__main {
      position: relative;
      flex: 1;
      min-width: 0;
      min-height: 0;

      &:focus {
        outline: 0;

        & > .el-table {
          outline: 1px var(--pro-table-border-color) dashed;
          outline-offset: 1px;
        }
      }
    }

    // 控件样式
    .el-table {
      .el-form-item {
        margin-bottom: 0;
        width: 100%;
      }

      .el-form-item__content {
        line-height: inherit;
      }

      .el-select__wrapper,
      .el-input__wrapper {
        padding-left: var(--pro-table-td-padding);
        padding-right: var(--pro-table-td-padding);
        box-shadow: 0 0 0 1px transparent inset;
      }

      .el-select__wrapper.is-focus,
      .el-input__wrapper.is-focus {
        box-shadow: 0 0 0 1px var(--el-input-focus-border-color) inset;
      }

      .el-input-number.is-controls-right .el-input__wrapper {
        padding-right: 42px;
      }

      .el-input-number {
        width: 100%;
      }

      .el-date-editor.el-input,
      .el-date-editor.el-input__wrapper {
        width: 100%;
      }
    }
  }

  .el-table__border-left-patch,
  .el-table--border::before,
  .el-table--border::after,
  .el-table__inner-wrapper::before {
    display: none;
    /* 隐藏默认边框 */
  }

  /* 表格边框 */
  .el-table--border .el-table__inner-wrapper,
  .el-table-v2__table {
    &:after {
      content: ' ';
      position: absolute;
      height: auto;
      background-color: transparent;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border: 1px var(--pro-table-border-color) solid;
      pointer-events: none;
      box-sizing: border-box;
    }
  }

  /* 表格圆角 */
  &--round,
  &--roundhalf {
    .el-table--border .el-table__inner-wrapper,
    .el-table-v2__table {
      &:after {
        border-radius: var(--pro-table-border-radius);
      }
    }

    .el-table-v2__table.el-table-v2__left:after {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }

    .el-table-v2__table.el-table-v2__right:after {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }

    .el-table--border .el-table__body-wrapper {
      border-bottom-left-radius: var(--pro-table-border-radius);
      border-bottom-right-radius: var(--pro-table-border-radius);
    }

    .el-table__header-wrapper {
      border-top-left-radius: var(--pro-table-border-radius);
      border-top-right-radius: var(--pro-table-border-radius);
    }
  }

  /* 底部有新增一行 */
  &--roundhalf {
    .el-table--border .el-table__inner-wrapper {
      &:after {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
      }
    }
  }

  .el-table .el-table__body,
  .el-table-v2 .el-table-v2__body {
    /* 序号 */
    .pro-table--body__seq {
      .cell {
        padding: 0 var(--pro-table-td-padding);
      }
    }

    /* 操作列 */
    .pro-table--body__operate {
      .cell {
        padding: 0 var(--pro-table-td-padding);
      }

      .el-button + .el-button {
        margin-left: 0;
      }
    }
  }

  .el-table-v2 .el-table-v2__header {
    background-color: var(--pro-table-thead-bg);
    border-top-left-radius: var(--pro-table-border-radius);
    border-top-right-radius: var(--pro-table-border-radius);

    .el-table-v2__header-cell {
      padding: 0 var(--pro-table-td-padding);
      background-color: transparent;
    }
  }

  .el-table-v2 .el-table-v2__row,
  .el-table-v2 .el-table-v2__header-row {
    border-bottom-color: var(--pro-table-border-color);
  }

  .el-table-v2 .el-table-v2__row-cell,
  .el-table-v2 .el-table-v2__header-cell {
    border-right: 1px var(--pro-table-border-color) solid;
  }

  .el-table-v2 .el-table-v2__row-cell {
    padding: 0;
  }

  /* fixed right 场景下去除最右侧的边框 */
  .el-table-v2 .el-table-v2__row .el-table-v2__row-cell:not(:has(~ .el-table-v2__row-cell)),
  .el-table-v2
    .el-table-v2__header-row
    .el-table-v2__header-cell:not(:has(~ .el-table-v2__header-cell)) {
    border-right: none;
  }

  .el-table-v2 .pro-table--body__seq,
  .el-table-v2 .pro-table--body__operate {
    padding: 0 var(--pro-table-td-padding);
  }

  /* v2 选中和 hover */
  .el-table-v2 .el-table-v2__row.current-row .el-table-v2__row-cell {
    background-color: var(--pro-table-tr-selected-bg);
  }

  .el-table-v2 .el-table-v2__row.is-hovered,
  .el-table-v2 .el-table-v2__row:hover {
    background-color: var(--pro-table-tr-hover-bg);
  }

  .el-table {
    .el-table__header {
      thead {
        color: var(--pro-table-font-color);
      }

      .el-table__cell {
        background-color: var(--pro-table-thead-bg);
        padding: 0px;
        height: 32px;

        .cell {
          font-weight: bold;
          padding: 0 var(--pro-table-td-padding);
        }
      }
    }

    /* 选中行和 hover 行 */
    .el-table__body {
      // hover
      // tr.hover-row.current-row > td.el-table__cell,
      tr.hover-row.el-table__row--striped.current-row > td.el-table__cell,
      tr.hover-row.el-table__row--striped > td.el-table__cell,
      tr.hover-row > td.el-table__cell,
      tr > td.hover-cell {
        background-color: var(--pro-table-tr-hover-bg);
      }

      // selected
      tr.current-row > td.el-table__cell {
        background-color: var(--pro-table-tr-selected-bg);
      }

      [class*='el-table__row--level'] {
        .cell {
          display: flex;
          align-items: center;
          padding-left: 4px;
        }

        .el-table__expand-icon {
          margin-right: 4px;
        }
      }

      // 居中的场景样式还原
      [class*='el-table__row--level'] {
        td.is-center,
        td.is-right {
          .cell {
            display: block;
            padding-left: 0;
          }
        }
      }

      .cell {
        padding: 0;
      }
    }

    td.el-table__cell,
    th.el-table__cell.is-leaf {
      border-bottom-color: var(--pro-table-border-color);
    }

    .el-table__cell {
      padding: 0;
    }
  }

  .el-table--border {
    .el-table__cell {
      border-right-color: var(--pro-table-border-color);

      // &:first-child {
      //   border-left: 1px var(--pro-table-border-color) solid;
      // }
    }

    th.el-table__cell {
      border-bottom-color: var(--pro-table-border-color);
    }

    /* 表格边框 */
    &:after,
    &:before {
      background-color: var(--pro-table-border-color);
    }
  }
}
</style>
