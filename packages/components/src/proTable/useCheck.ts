import { computed, ref, shallowRef, toRaw, unref, watch, type ComputedRef, type Ref } from 'vue'
import { uniqBy } from 'lodash-unified'
import { isArray } from '../utils'
import { isEqual, getDataFromKeys } from './utils'
import type { ProComponentObject } from '../common.types'
import type { ProTableRowSelectionProps, ProTableGetRowKey, KeyType } from './table.types'

type UseCheckOptions<T> = {
  rowSelection: Ref<ProTableRowSelectionProps<T> | undefined>
  getRowKey: ComputedRef<ProTableGetRowKey<T>>
  getData: () => T[]
}
export const useCheck = <T extends ProComponentObject>(options: UseCheckOptions<T>) => {
  const rowSelectionProps = computed(() => {
    const rowSelection = options.rowSelection.value || ({} as ProTableRowSelectionProps<T>)
    const {
      type,
      selectedRowKeys,
      repel = false, // true 只能选中一个
      checkStrictly = false, // tree 场景下选中父则选中所有子级, true 则取消该行为
      childrenCheckbox = true, // tree 场景下子级是否展示 checkbox，false 不展示
      selectable = (_data: T) => true,
      ...rest
    } = rowSelection
    let rowKeys = [] as KeyType[]
    if (type && selectedRowKeys) {
      rowKeys = isArray(selectedRowKeys) ? selectedRowKeys : [selectedRowKeys]
    }
    return {
      type,
      repel,
      checkStrictly,
      childrenCheckbox,
      selectable: selectable,
      selectedRowKeys: rowKeys,
      ...rest,
    }
  })
  const getRowKey = options.getRowKey
  const selectionRowKeys = ref<KeyType[]>(rowSelectionProps.value.selectedRowKeys)
  const selectionRowDatas = shallowRef<T[]>([])
  const selectionDataLoad = () => {
    // 每次数据加载完都检查下选中的key 和 datas 是否一致
    const keys = toRaw(selectionRowKeys.value)
    if (keys.length !== selectionRowDatas.value.length) {
      const tableDataChildren = options.getData()
      const selectedRows = getDataFromKeys(keys, tableDataChildren, getRowKey.value)
      selectionRowDatas.value = uniqBy(
        toRaw(selectionRowDatas.value).concat(selectedRows),
        getRowKey.value,
      )
    }
  }
  const getSelectionRows = () => {
    const tableDataChildren = options.getData()
    // 输出 rowData[]
    const rows = getDataFromKeys<T>(selectionRowKeys.value, tableDataChildren, getRowKey.value)
    return rows
  }
  // 使用 onChange 同步 selectionRowKeys 到组件外
  watch(selectionRowKeys, (newVal) => {
    const keys = newVal.slice()
    const tableDataChildren = options.getData()
    // 获取当前页的 rows
    const selectedRows = getDataFromKeys(keys, tableDataChildren, getRowKey.value)
    // 如果不相等，则认为是翻页的多选
    if (keys.length !== selectedRows.length) {
      selectionRowDatas.value = uniqBy(
        toRaw(selectionRowDatas.value)
          .filter((item) => keys.includes(getRowKey.value(item)))
          .concat(selectedRows),
        getRowKey.value,
      )
    } else {
      selectionRowDatas.value = selectedRows
    }
    rowSelectionProps.value.onChange?.(keys, toRaw(selectionRowDatas.value))
  })
  // 组件外通过 selectedRowKeys 控制 checkbox
  watch(
    () => rowSelectionProps.value.selectedRowKeys,
    (newVal) => {
      if (!isEqual(newVal, unref(selectionRowKeys))) {
        selectionRowKeys.value = newVal
      }
    },
  )
  return {
    rowSelectionProps,
    selectionRowKeys,
    selectionRowDatas,
    selectionDataLoad,
    getSelectionRows,
  }
}
