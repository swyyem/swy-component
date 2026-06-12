import type { Ref, ComputedRef } from 'vue'
import type { ProComponentObject, ProComponentAny } from '../common.types'
import type { ProFormInstance } from '../form/form.types'
import type { ChainEventBusInstance } from '../tool/eventBus'
import type {
  KeyType,
  ProTableFormValidateType,
  ProRecordDataType,
  ProTableProviderProps,
  ProTableEditProps,
  ProTableFormInvalidFieldsType,
  ProTableGetRowKey,
  ProBaseTableInstance,
  ProBaseTableProps,
} from './table.types'
import type { ProUnifyTableProviderProps } from './proTable.types'

export type ProTableEditContext<T extends ProComponentObject = ProComponentObject> = {
  childrenColumnName: string
  rowKey: ProBaseTableProps['rowKey']
  formRef: Ref<ProFormInstance<Record<string, T>> | undefined>
  editable: ComputedRef<ProTableEditProps<T> | undefined>
  editingCell: Ref<KeyType | undefined, KeyType | undefined>
  editingRowKeys: Ref<KeyType[], KeyType[]>
  removeRecords: Ref<T[]>
  editRecords: Ref<T[]>
  onCreate: (e: MouseEvent) => void
  setColumnFocus: (rowData: T) => void
  setInvalidControl: (invalidFields: ProTableFormInvalidFieldsType) => void
  getFormInstanceByKey: (key: string, rowData: T) => ProComponentAny
  getRowKey: ComputedRef<ProTableGetRowKey<T>>
  getData: () => T[]
  setData: (data: T[]) => void
  internalIndex: ProUnifyTableProviderProps<T>['internalIndex']
  setScrollTop: (index: number, columnIndex?: number) => void
}

export type ProTableEditInstance<T extends ProComponentObject> = Omit<
  ProBaseTableInstance<T>,
  'tableBodyRef' | 'getRealDataHasKey'
> & {
  setColumnPosition: (rowData: T, columnKey: string) => void
  getFormInstances: () => Record<string, ProComponentAny>[]
  getFormInstanceByKey: (key: string, rowData: T) => ProComponentAny
  validate: (cb?: ProTableFormValidateType) => Promise<boolean>
  getFormData: () => T[] | undefined
  getFormRecord: () => ProRecordDataType<T>
  resetForm: (data: T[]) => void
  actions: Required<ProTableProviderProps<T>['actions']> & ProBaseTableInstance<T>['actions']
}

export type ProTableEditProviderProps<T extends ProComponentObject> = {
  setEditRecord: (v: T, key: KeyType) => void
  editingCell: Ref<KeyType | undefined, KeyType | undefined>
  editingRowKeys: Ref<KeyType[], KeyType[]>
  editMode: ComputedRef<boolean>
  editableConfig: ComputedRef<ProTableEditProps<T> | undefined>
  editEventBus: ChainEventBusInstance
}
