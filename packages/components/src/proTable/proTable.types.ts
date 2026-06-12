import type { ComputedRef } from 'vue'
import Pipeline from '../utils/pipeline'
import type { ProComponentObject } from '../common.types'
import type {
  // ProColumns,
  ProTableGetRowKey,
  ProTableRowSelectionProps,
  // ProBaseTableInstance,
  ProBaseTableProps,
} from './table.types'
import type { ProTableEditInstance } from './proTableEdit.types'

export type ProUnifyTableColumnsContext<T> = {
  getRowKey: ComputedRef<ProTableGetRowKey<T>>
  rowSelectionType: ProTableRowSelectionProps<T>['type']
  pipeline: InstanceType<typeof Pipeline>
}

export type ProTableInstance<T extends ProComponentObject = ProComponentObject> =
  ProTableEditInstance<T>

export type ProUnifyTableProviderProps<T> = {
  getRowKey: ComputedRef<ProTableGetRowKey<T>>
  internalIndex: {
    value: number
  }
  pipeline: InstanceType<typeof Pipeline>
}

export type ProTableProps<T extends ProComponentObject = ProComponentObject> = ProBaseTableProps<T>
