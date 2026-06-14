import type { VNode, Ref, ComputedRef, Slot, Reactive } from 'vue'
import type {
  PaginationProps,
  PaginationEmits,
  ButtonProps,
  TableInstance,
  Column,
  Columns,
  FormValidateFailure,
} from 'element-plus'
// import type { Column, Columns } from 'element-plus/es/components/table-v2/src/types'
import type { ProComponentObject, ProComponentAny } from '../common.types'
import type { ActionButtonProps } from '../actionButton/actionButton.types'
import type {
  ProFormProps,
  ProFormEvents,
  PropFormFieldProps,
  TextSpecifiledProps,
  ProFieldValueType,
  ProFieldPropsType,
} from '../index'

export type ProV2Column = Column
export type ProV2Columns = Columns<ProComponentObject>

export type VueRawSlots = {
  [name: string]: Slot
}
type ProAsyncEventType = () => {
  resolve: () => void
}
export type ProTableFieldProps<ValueType extends ProFieldValueType = ProFieldValueType> = Omit<
  ProFieldPropsType<ValueType>,
  'mode' | 'textProps' | 'modelValue' | 'renderFormItem' | 'render'
>
export type ProTableGetRowKey<RecordType> = (record: RecordType) => KeyType

export type ProTableOperateMethods<T> = {
  edit: (rowData: T) => void
  delete: (rowData: T) => void
  cancel: (rowData: T) => void
  save: (rowData: T) => void
  add: (rowData?: T) => void
}

export type ProTableProviderProps<T extends ProComponentObject> = {
  emit: ProTableEmits<T>
  getStore: () => TableInstance['store'] | undefined
  pageInfo: ProTablePageParams
  originColumns: Ref<ProColumns<T>>
  columns: Ref<ProColumns<T>>
  setTableColumns: (columns: ProColumns<T>) => void
  resetTableColumns: () => void
  waterfall: boolean
  getRowKey: ComputedRef<ProTableGetRowKey<T>>
  pureFetch: (p: ProTablePageParams) => Promise<ProComponentAny>
  getSelectionRows: () => T[]
  editableConfig: ComputedRef<ProTableEditProps<T> | undefined>
  selectionRowKeys: Ref<KeyType[]>
  tableData: Ref<T[]>
  getTableData: () => T[]
  rowSelectionProps: ComputedRef<ProTableRowSelectionAfter<T>>
  actions?: {
    add: ProTableOperateMethods<T>['add']
    delete: ProTableOperateMethods<T>['delete']
  }
  setCellRef: (key: KeyType, ref: ProComponentAny) => void
  getCellRef: (key?: KeyType) => ProComponentAny
  getDataIndexByRowKey: (list: T[], keyValue: KeyType) => number
  getTableDataAndChildren: () => T[]
  getTableDataAllChildren: () => T[]
  setTableData: (data: T[], isCover?: boolean) => void
  getTableChildrenByRowValue: (keyValue: KeyType) => T[]
  getParentByRowValue: (keyValue: KeyType) => T | undefined
  onSearch: (params?: ProComponentAny) => void
  onCurrentSearch: (params?: ProComponentAny) => void
  searchForm: Reactive<ProComponentAny>
}

export type ProCellRendererParams<T extends ProComponentObject> = {
  cellKey?: KeyType
  cellData: ProComponentAny
  rowData: T
  rowIndex: number
  columns?: ProColumns<T>
  column?: ProColumn<T>
  columnIndex: number
}
export type KeyType = PropertyKey
export type AnyObject = Record<KeyType, ProComponentAny>
export type ProTableButtonProps<T> = Partial<ButtonProps> & {
  onClick?: (e: MouseEvent, rowData: T, asyncEvent: ProAsyncEventType) => void
}
export type ProActionButtonProps<T extends ProComponentObject> =
  | false
  | ProTableButtonProps<T>
  | ((params: ProCellRendererParams<T>) => false | ProTableButtonProps<T>)

type TablePaginationPosition =
  | 'topLeft'
  | 'topCenter'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomCenter'
  | 'bottomRight'
  | 'none'
// 分页
export type ProPagerProps = {
  pagination: Partial<PaginationProps> &
    Partial<PaginationEmits> & {
      position?: TablePaginationPosition[]
      onChange?: (currentPage: number, pageSize: number) => void
    }
}

export type ProTablePageParams = {
  currentPage?: number
  pageSize?: number
  total?: number
  scrollId?: string
  hasMore?: boolean
}
// 导出配置
export type ProTableToolbarExportProps = {
  /** 导出文件名 */
  filename?: string
  /** 按钮名称 */
  buttonText?: string
  /** 选中行导出 */
  checked?: boolean
  /** 导出的 column */
  includes?: string[]
  /** 导出成功的回调 */
  onSuccess?: () => void
  /** 是否只导出当前页 */
  exportCurrentPage?: boolean
}
// 导入配置
export type ProTableToolbarImportProps<T> = {
  /** 按钮名称 */
  buttonText?: string
  /** json 中的 key，数组顺序 */
  keys?: string[]
  /** 导入成功的回调 */
  onSuccess?: (data: T[], asyncEvent: ProAsyncEventType) => void
}
type ProTableToolSlotParams = {
  onSearch: (params?: ProComponentObject) => void
  onCurrentSearch: (params?: ProComponentObject) => void
  searchForm: Reactive<ProComponentObject>
}
// 工具栏
export type ProTableToolbarProps<T> = {
  className?: string // 样式
  title?: string // 标题
  filtersCustom?: (v: ProTableToolSlotParams) => VNode | VNode[]
  searchCustom?: (v: ProTableToolSlotParams) => VNode | VNode[]
  buttonsCustom?: (v: ProTableToolSlotParams) => VNode | VNode[]
  custom?: boolean // 自定义列
  export?: boolean | ProTableToolbarExportProps // 导出
  import?: ProTableToolbarImportProps<T> // 导入
}
// 工具栏的实例
export type ProTableToolbarInstance = {
  getHeight: () => number
}

// content
export type ProTableContentProps<T extends ProComponentObject = ProComponentObject> = {
  bodyHeight: number
  bodyWidth: number
  maxHeight?: number
  loading: boolean
  tableData: T[]
  getRowKey?: ProTableGetRowKey<T>
  rowKey: ProBaseTableProps<T>['rowKey']
  first?: boolean
  waterfall?: boolean
  virtual?: boolean
  onScroll?: (v: { scrollLeft: number; scrollTop: number }) => void
  rowClassName: ProTableRowClassName
  menuConfig?: ProTableMenuConfigType<T>
  expandable?: ProTableExpandableProps<T>
  autoHeight: boolean
  /** 删除样式 */
  removedKey?: string
  sameMaxHeight?: boolean
  emptyText?: string
  /** 选中行高亮 */
  highlightCurrentRow?: boolean
  currentSelectedRow?: T
  currentChangeRepeat: boolean
}
export type ProTableContentInstance<T> = {
  getElTableInstance: () => Ref<TableInstance | undefined>
  setScrollTop: (rowIndex: number, columnIndex?: number) => void
  setCurrentRow: (row: T, isEmit?: boolean) => void
  getCurrentRow: () => T | null
  emitCurrentChange: () => void
}

export type ProCellRenderer<T extends ProComponentObject> = (
  params: ProCellRendererParams<T>,
) => VNode
export type ProHeaderCellRenderer = (params: any) => VNode
export type ProColumn<T extends ProComponentObject> = Omit<TextSpecifiledProps, 'copyText'> & {
  /** 标题，同label */
  title?: string
  /** 标题，同 title */
  label?: string
  /** 字段名 */
  field?: string
  /** 字段名，同 field */
  prop?: string
  /** 数据字段名，同 field */
  dataKey?: string
  /** 类型，支持 seq(序号) */
  type?: string
  /** 对齐方式 */
  align?: 'center' | 'right'
  /** column 模式 */
  mode?: string
  /** 控件类型 */
  valueType?: string
  /** 控件 props */
  proFieldProps?: ProComponentObject
  /** 是否必填 */
  required?: boolean
  /** 控件 校验规则 */
  rules?:
    | PropFormFieldProps['rules']
    | ((rowIndex: string, rowData: T) => PropFormFieldProps['rules'])
  /** 控件联动规则 */
  effects?: (rowIndex: string) => PropFormFieldProps['effects']
  /** cell自定义渲染 */
  render?: (rowData: T, rowIndex: number) => VNode
  /** 在 搜索 中隐藏 */
  hideInSearch?: boolean
  /**在 弹窗表单 中删除 */
  hideInForm?: boolean
  /** 在 table 中隐藏 */
  hideInTable?: boolean
  /**
   *  @name 可编辑表格是否可编辑
   *
   * @example 不允许编辑
   * editable={false}
   *
   * @example 如果id=1不允许编辑
   * editable={(params)=> params.rowData.id !==1 }
   */
  editable?: false | ((params: ProCellRendererParams<T>) => boolean)
  /** cell自定义渲染 */
  cellRenderer?: ProCellRenderer<T>
  /** 编辑状态cell自定义渲染 */
  editCellRenderer?: ProCellRenderer<T>
  /** 表头自定义渲染 */
  headerCellRenderer?: ProHeaderCellRenderer
  /** 表头支持全选 */
  headerIsAll?: boolean
  /** 嵌套表头 */
  children?: ProColumn<T>[]
  /** 是否校验通过才能触发回车 */
  validateBeforeEnter?: boolean
  /** actionButton组件 */
  actions?: ActionButtonProps<T>[]
} & {
  [key: string]: ProComponentAny
}

export type ProColumns<T extends ProComponentObject> = ProColumn<T>[]
// 编辑配置
type ProTableEditType = 'single' | 'multiple' | 'cell' | 'only'
export type ProTableEditProps<T extends ProComponentObject> = {
  type: ProTableEditType
  /** 控制编辑模式下的编辑状态 */
  mode?: string
  /** 是否隐藏操作列 */
  hideColumn?: boolean
  /** 新增时是否添加默认的一行 */
  defaultRow?: boolean
  /** 开启键盘 enter 跳转下一个 */
  keyboard?: boolean
  /** 定义 column 列回车切换下一行，若没有下一行则新增一行，默认最后一列 */
  keyboardNextCell?: string
  /** 定义编辑行定位的第一个可编辑 cell，默认取第一个可编辑的必填 cell */
  keyboardFirstCell?: string
  /** 定义编辑行回车跳转的顺序，默认为 table columns 中的所有可编辑 column */
  keyboardColumns?: string[]
  /** 定义新增行中可为空的列，为空则认为不存在，保存时忽略。默认为 table columns 中的所有可编辑 column */
  keyboardEmptyColumns?: string[]
  /** 保存一行的文字 */
  saveText?: string | VNode
  /** 取消编辑一行的文字 */
  cancelText?: string | VNode
  /** 删除一行的文字 */
  deleteText?: string | VNode
  /** 编辑一行的文字 */
  editText?: string | VNode
  /**
   * 编辑按钮属性
   */
  editButtonProps?: ProActionButtonProps<T>
  /**
   * 删除按钮属性
   */
  deleteButtonProps?: ProActionButtonProps<T>
  cellProps?: {
    mode?: 'doubleClick' | 'click'
  }
  deletePopconfirmMessage?: string
  onlyOneLineEditorAlertMessage?: string | VNode
  onlyAddOneLineAlertMessage?: string | VNode
  /**
   * 操作列属性
   */
  optionColumnProps?: ProComponentObject
}
/** 选中相关定义 */
export type ProTableRowSelectionProps<T> = {
  type?: 'checkbox' | 'radio'
  repel?: boolean
  checkStrictly?: boolean
  childrenCheckbox?: boolean
  selectedRowKeys?: KeyType | KeyType[]
  hideSelectAll?: boolean
  reserveSelection?: boolean
  rowClick?: boolean
  selectable?: (rowData: T) => boolean
  onChange?: (selectedRowKeys: KeyType[], selectedRows: T[]) => void
  onSelect?: (selectedRows: T[], row: T) => void | boolean | Promise<boolean>
}
export type ProTableRowSelectionData<T> = ProTableRowSelectionProps<T> & {
  selectedRowKeys: KeyType[]
}
// RowSelection 处理后的类型, selectable 一定存在
type ProTableRowSelectionAfter<T> = Omit<ProTableRowSelectionData<T>, 'selectable'> & {
  selectable: (row: T) => boolean
}
/** 展开行定义 */
export type ProTableExpandableProps<T> = {
  defaultExpandAllRows?: boolean
  defaultExpandedRowKeys?: KeyType[]
  expandedRowKeys?: KeyType[]
  preserveExpandedContent?: boolean
  onExpandedRowsChange?: (expandedRowKeys: KeyType[], rows: T[]) => void
}

export type ProTableOperateType<T> = {
  add: (v: T) => void
}
export type ProTableRowClassNameParams<T> = {
  row: T
  rowData: ProComponentAny
  rowIndex: number
}
export type ProTableRowClassName = <T>(data: ProTableRowClassNameParams<T>) => string
/** 右键菜单配置 */
export type ProTableMenuOption = {
  label: string
  value?: ProComponentAny
  disabled?: boolean
  visible?: boolean
  children?: ProTableMenuOption[]
}
export type ProTableMenuVisibleParams<T extends ProComponentObject> = {
  options: ProTableMenuOption[]
  // columns: ProColumns
  row?: T
  rowIndex?: number
  column?: ProColumn<T>
  columnIndex?: number
}
export type ProTableMenuClickParams<T extends ProComponentObject> = {
  menu?: ProTableMenuOption
  row?: T
  rowIndex?: number
  column?: ProColumn<T>
  columnIndex?: number
  $event: MouseEvent
}
export type ProTableMenuConfigType<T extends ProComponentObject> = {
  className?: string
  visibleMethod?: (v: ProTableMenuVisibleParams<T>) => boolean
  trigger?: 'row' | 'cell'
  header?: {
    options: ProTableMenuOption[]
  }
  body?: {
    options: ProTableMenuOption[]
  }
}

export type TableRequest<T = any> = (params: ProComponentObject, data?: T[]) => Promise<any>

export type ProBaseTableProps<T extends ProComponentObject = ProComponentObject> = Pick<
  ProTableContentProps<T>,
  'highlightCurrentRow'
> & {
  /** 外层容器类名 */
  containerClass?: string
  /** 同 containerClass */
  tableClassName?: string
  /** table 中 body 类名 */
  bodyClassName?: string
  /** table 中 main 类名 */
  bodyMainClassName?: string
  /** 自适应高度，设置 true 后 height 则无效 */
  autoHeight?: boolean
  /** 表格高度 */
  height?: number
  /** 表格最大高度 */
  maxHeight?: number
  /** 行样式的处理 */
  rowClassName?: ProTableRowClassName
  /** 圆角 */
  round?: boolean
  /** 删除样式 */
  removedKey?: string
  /** 开启键盘相应，表格可获得焦点 */
  keyboard?: boolean
  /** 选择相关 */
  rowSelection?: ProTableRowSelectionProps<T>
  /** 初始化选中第一行 */
  firstRowSelected?: boolean
  /** 单选, current-change 的默认值，和 firstRowSelected 互斥 */
  currentSelectedRow?: T
  /** 单选，current-change 同一行可重复触发。默认 false */
  currentChangeRepeat?: boolean
  /** 展开行相关 */
  expandable?: ProTableExpandableProps<T>
  /** 是否手动触发请求 */
  manualRequest?: boolean
  /** 是否开启分块渲染，一般用于超多列场景 */
  sliceRender?: boolean
  /**
   * request 的参数，修改之后会触发更新
   *
   * @example pathname 修改重新触发 request
   * params={{ pathName }}
   */
  params?: ProComponentObject
  /** 请求数据的方法 */
  request?: (params: ProComponentObject, data?: T[]) => Promise<ProComponentAny>
  /** 静态数据源，推荐使用 defaultData。如果 request 存在，会被 request 中的数据覆盖 */
  dataSource?: T[]
  /** 动态数据源，可控制表格数据变化 */
  data?: T[]
  /** 同 dataSource */
  defaultData?: T[]
  /** 表格列的 json 配置 */
  columns?: ProColumns<T>
  /** 开启瀑布流分页 */
  waterfall?: boolean
  /** 每行的 key 值 */
  rowKey: string
  /** 分页页码配置 */
  pagination?: ProPagerProps['pagination'] | false
  /** 表格的工具栏配置 */
  toolbar?: ProTableToolbarProps<T> | false
  /** 表格编辑行相关的配置 */
  edit?: false | ProTableEditProps<T>['type'] | ProTableEditProps<T>
  /** 同 edit */
  editable?: false | ProTableEditProps<T>['type'] | ProTableEditProps<T>
  // editButtons?: ProEditButtonConfig
  /** 新建按钮属性 */
  recordCreatorProps?:
    | (Partial<ButtonProps> & {
        creatorButtonText?: string | VNode
        /** @default: 'body' */
        placement?: 'body' | 'toolbar'
        /** @default: 'bottom' */
        position?: 'top' | 'bottom'
        onClick: (e: MouseEvent, operate: ProTableOperateType<T>) => void
      })
    | false
  /** 不允许添加一行，包括回车添加 */
  recordCreatorDisabled?: boolean
  /** proForm 的 props 透传 */
  formProps?: Omit<ProFormProps, 'initialValues' | 'submitter' | 'grid' | 'fieldErrorType'> &
    ProFormEvents
  /** 数据加载完的回调 onAfterDataLoad 废弃 */
  onLoad?: (data: T[]) => void
  /** 内部设置数据第一次回调 */
  onFirstData?: () => void
  /**
   * @name 数据加载失败时触发
   */
  onRequestError?: (e: Error) => void
  /**
   * 数据源变化时的回调函数
   * @type {(data?: T[]) => void}
   */
  onDataChange?: (data: T[]) => void
  /**
   * 请求后可处理数据的方法
   * @type {T}
   */
  postData?: (data: T[]) => T[]
  /** 是否开启虚拟滚动 */
  virtual?: boolean
  /** 搜索表单初始值 */
  defaultSearchForm?: ProComponentObject
  /** 表格右键菜单 */
  menuConfig?: ProTableMenuConfigType<T>
  /** 右键菜单事件 */
  onMenuClick?: (v: ProTableMenuClickParams<T>) => void
  /** 空态文案 */
  emptyText?: string
  /** 开启 height 和 max-height 一致 */
  sameMaxHeight?: boolean
  /** refresh 是否清空选中态 */
  refreshClearChecked?: boolean
} & {
  [key: string]: ProComponentAny
}

export type ProTableFormInvalidFieldsType = {
  [x: string]: FormValidateFailure['fields']
}
export type ProTableFormValidateType = (
  v: boolean,
  invalidFields: ProTableFormInvalidFieldsType,
) => void
export type ProRecordDataType<T> = {
  add: T[]
  edit: T[]
  remove: T[]
}
export type ProTableRowDirection = 'prev' | 'next'
// 基础表格
export type ProBaseTableInstance<T extends ProComponentObject> = {
  setLoading: (v: boolean) => void
  getData: () => T[]
  getSelectionRows: () => T[]
  getDataHasKey: () => T[]
  getRealDataHasKey: () => T[]
  getTableDataSize: () => number
  refresh: (v?: boolean) => Promise<ProComponentAny>
  resize: () => void
  onSearch: (params?: ProComponentObject) => Promise<ProComponentAny>
  onCurrentSearch: (params?: ProComponentObject) => void
  selectFetch: (cb: () => void) => void
  setSearchForm: (data: ProComponentObject) => void
  getSearchForm: () => ProComponentObject
  setTableData: (data: T[], isCover?: boolean) => void
  setData: (data: T[], isCover?: boolean) => void
  setDataClad: (data: T | T[]) => void
  navigateRow: (dir: ProTableRowDirection) => void
  setNavigateRow: () => T | undefined
  updateRow: () => void
  setCurrentRow: ProTableContentInstance<T>['setCurrentRow']
  actions: {
    exportMethod: (options?: ProTableToolbarExportProps) => Promise<ProComponentAny>
    importMethod: (file: Blob, options?: ProTableToolbarImportProps<T>) => Promise<ProComponentAny>
  }
  tableBodyRef: Ref<HTMLElement | null>
  setScrollTop: ProTableContentInstance<T>['setScrollTop']
  getRowIsLocal: (row: T) => boolean
}
export type ProTableEmits<T extends ProComponentObject = ProComponentObject> = {
  (e: 'menu-click', val: ProTableMenuClickParams<T>): void
  (e: 'data-change', v: T[]): void
  // (e: 'current-change', v1: T | null, v2: T): void
}
export type ProTableRowAndColumnType<T extends ProComponentObject> = {
  row?: T
  column?: ProColumn<T>
}
export type ProTableContentProvider<T extends ProComponentObject> = {
  rowAndColumn: Ref<ProTableRowAndColumnType<T>>
}
export type ProTableCellProvideType<T extends ProComponentObject = ProComponentObject> = {
  currentRow: T
  setCurrentRow: (v: T) => void
}
