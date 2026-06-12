import type { ProFormProps } from '../form/form.types'
import type { BreakPoint } from '../grid/grid.types'

export type searchFormConfigType = {
  searchBtn?: boolean
  collapsed?: boolean
  showCollapse?: boolean
  searchForm?: boolean
}

export type searchColType = number | Partial<Record<BreakPoint, number>>

export type QueryFilterProps = ProFormProps & {
  /** 表单布局 */
  searchCol?: searchColType
  /** 是否折叠超出的表单项 */
  collapsed?: boolean
  /** 折叠按钮点击回调 */
  onCollapse?: (collapsed: boolean) => void
  /** 是否显示搜索按钮 */
  searchBtn?: boolean
  /** 是否显示折叠按钮 */
  showCollapse?: boolean
  /** search表单按钮loading */
  searchLoading?: boolean
}
