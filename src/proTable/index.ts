import ProBaseTable from './baseTable.vue'
import ProTable from './table.vue'
import ProColumn from './proColumn.vue'
import { InternalAddPrefix, ProTableCellProvide } from './variable'

export type * from './table.types'
export type * from './proTable.types'
export { ProColumn }
export { ProBaseTable }
export { ProTableCellProvide }
export const ProInternalAddPrefix = InternalAddPrefix
export default ProTable
