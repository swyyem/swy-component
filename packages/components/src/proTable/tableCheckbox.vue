<template>
  <el-checkbox
    v-if="display"
    :disabled="disabled"
    :modelValue="checked"
    @update:modelValue="handleChange"
    :indeterminate="indeterminate"
    @click.stop
  />
</template>
<script lang="ts" setup generic="T extends ProComponentObject">
import { inject, computed, ref, toRaw } from 'vue'
import { ElCheckbox, type CheckboxProps, type CheckboxValueType } from 'element-plus'
import { difference, intersection, uniq } from 'lodash-unified'
import { isPromise } from '../utils'
import { getDataFromKeys, flattenTree } from './utils'
import type { ProComponentObject } from '../common.types'
import type { KeyType, ProTableProviderProps } from './table.types'

defineOptions({
  name: 'ProTableCheckbox',
})
type AllTrueProps = Partial<CheckboxProps> & {
  all: true
  rowValue?: never
  rowData?: never
}
type AllFalseProps<T> = Partial<CheckboxProps> & {
  all?: false
  rowValue: KeyType
  rowData: T
}
type ProTableCheckboxProps<T> = AllTrueProps | AllFalseProps<T>
const props = withDefaults(defineProps<ProTableCheckboxProps<T>>(), {
  all: false,
})
const ProTableData = inject<ProTableProviderProps<T>>('ProTableData')!
const selectionRowKeys = ProTableData.selectionRowKeys
const tableData = ProTableData.tableData
const getRowKey = ProTableData.getRowKey
const rowSelectionProps = ProTableData.rowSelectionProps
// selectable
const selectableMethod = computed(() => {
  return rowSelectionProps.value.selectable
})
// 互斥，只能选中一个 checkbox
const repel = computed(() => {
  return rowSelectionProps.value.repel
})
// tree 场景下自己是否展示复选框
const childrenCheckbox = computed(() => {
  return rowSelectionProps.value.childrenCheckbox
})
// tree 场景下父子选中关联
const checkStrictly = computed(() => {
  return childrenCheckbox.value
    ? repel.value
      ? true
      : rowSelectionProps.value.checkStrictly
    : true
})
// tree 场景的数据需要flatten
const realTableData = computed(() => {
  return ProTableData.getTableDataAndChildren()
})
const childrenData = computed(() => {
  const data = ProTableData.getTableDataAllChildren()
  return data
})
// 隐藏全选
const display = computed(() => {
  if (props.all) {
    // 开启了互斥，全选必须隐藏
    if (repel.value) {
      return false
    }
    return rowSelectionProps.value.hideSelectAll ? false : true
  } else {
    // 有子元素
    if (childrenData.value.length > 0) {
      const existIndex = childrenData.value.findIndex((item) => {
        return props.rowValue === ProTableData.getRowKey.value(item)
      })
      // 是 children 行且配置不展示 checkbox
      if (existIndex > -1 && !childrenCheckbox.value) {
        return false
      }
    }
  }
  return true
})

// 禁用
const disabled = computed(() => {
  if (props.all) {
    return false
  }
  const res = selectableMethod.value(props.rowData)
  return res ? false : true
})
const allKeys = computed(() => {
  const list = checkStrictly.value ? tableData.value : realTableData.value
  const lastData = list.filter((item) => selectableMethod.value(item))
  return lastData.map((item) => getRowKey.value(item))
})
// 存在子元素的row
const childKeys = computed(() => {
  if (checkStrictly.value) {
    return []
  }
  return props.rowValue
    ? ProTableData.getTableChildrenByRowValue(props.rowValue).map((item) => getRowKey.value(item))
    : []
})
// 当前所在父元素
const parentRow = computed(() => {
  const parent = props.rowValue ? ProTableData.getParentByRowValue(props.rowValue) : undefined
  return parent || ({} as T)
})
// 当前所在父元素的所有 children，包含子级的子级
const parentChildKeys = computed(() => {
  if (checkStrictly.value) {
    return []
  }
  return parentRow.value.children
    ? flattenTree<T>(parentRow.value.children).map((item) => getRowKey.value(item))
    : []
})
const isAll = computed(() => {
  // const len = selectionRowKeys.value.length
  if (allKeys.value.length === 0) {
    return false
  }
  const diff = difference(toRaw(allKeys.value), toRaw(selectionRowKeys.value))
  return diff.length === 0
})
const indeterminate = computed(() => {
  if (props.all) {
    const diff = intersection(toRaw(selectionRowKeys.value), toRaw(allKeys.value))
    return diff.length > 0 && !isAll.value
  } else if (childKeys.value.length > 0) {
    const childDiff = intersection(toRaw(selectionRowKeys.value), toRaw(childKeys.value))
    return childDiff.length > 0 && childDiff.length !== childKeys.value.length
  }
  return false
})
const checked = computed(() => {
  if (props.all) {
    return isAll.value
  }
  return selectionRowKeys.value.includes(props.rowValue)
})
// checkbox 中间态
const loading = ref(false)
const handleSelect = (rows: T[], row: T, cb: () => void) => {
  const res = rowSelectionProps.value.onSelect?.(rows, row)
  // 如果返回 false，取消选中
  if (isPromise<boolean>(res)) {
    loading.value = true
    res
      .then((res) => {
        if (res !== false) {
          cb()
        }
      })
      .finally(() => {
        loading.value = false
      })
  } else if (res !== false) {
    cb()
  }
}
const handleChange = (v: CheckboxValueType) => {
  if (props.all) {
    // selectionRowKeys.value = v ? allKeys.value : []
    if (v) {
      selectionRowKeys.value = uniq(toRaw(selectionRowKeys.value).concat(toRaw(allKeys.value)))
    } else {
      selectionRowKeys.value = difference(toRaw(selectionRowKeys.value), toRaw(allKeys.value))
    }
  } else {
    if (loading.value) {
      return
    }
    const rowValue = props.rowValue
    // 如果有 onSelect 方法需要等待返回结果
    const keys = selectionRowKeys.value.slice()
    const selectedRows = getDataFromKeys(keys, realTableData.value, getRowKey.value)
    handleSelect(selectedRows, props.rowData, () => {
      if (v) {
        if (repel.value) {
          selectionRowKeys.value = [rowValue]
        } else {
          // 如果有子级
          if (childKeys.value.length > 0) {
            const newKeys = keys.concat([rowValue], childKeys.value)
            selectionRowKeys.value = newKeys
          } else {
            keys.push(rowValue)
            selectionRowKeys.value = keys
          }
          // 如果父级有子级
          if (parentChildKeys.value.length > 0) {
            const childDiff = intersection(
              toRaw(selectionRowKeys.value),
              toRaw(parentChildKeys.value),
            )
            // 满足父级选中的条件
            if (childDiff.length === parentChildKeys.value.length) {
              const parentKey = getRowKey.value(parentRow.value)
              selectionRowKeys.value.push(parentKey)
            }
          }
        }
      } else {
        const index = selectionRowKeys.value.indexOf(rowValue)
        if (index > -1) {
          if (childKeys.value.length > 0) {
            const removeKeys = [rowValue].concat(childKeys.value)
            selectionRowKeys.value = selectionRowKeys.value.filter(
              (key) => !removeKeys.includes(key),
            )
          } else {
            selectionRowKeys.value = selectionRowKeys.value.filter((_item, i) => i !== index)
          }
          if (parentChildKeys.value.length > 0) {
            const removedDiff = intersection(
              toRaw(selectionRowKeys.value),
              toRaw(parentChildKeys.value),
            )
            // 满足父级移除的条件
            if (removedDiff.length !== parentChildKeys.value.length) {
              const parentKey = getRowKey.value(parentRow.value)
              selectionRowKeys.value = selectionRowKeys.value.filter((key) => key !== parentKey)
            }
          }
        }
      }
    })
  }
}
</script>
