<template>
  <span :style="paddingStyle">
    {{ index }}
  </span>
</template>
<script lang="ts" setup generic="T extends ProComponentObject">
import { computed, inject } from 'vue'
import type { ProComponentObject } from '../common.types'
import type { ProTableProviderProps, ProTablePageParams, KeyType, AnyObject } from './table.types'
import { getOrder } from './utils'
import { isNumber } from '../utils'

type SeqCellType = {
  rowValue: KeyType
}
defineOptions({
  name: 'SeqCell',
  inheritAttrs: false,
})

const props = defineProps<SeqCellType>()
const ProTableData = inject<ProTableProviderProps<T>>('ProTableData')!
/*
 * 根据 rowKeyValue 获取 对应的 parent rowKeyValue list，如[10, 2843]
 * treeData 的结构
 * {
 *  10: {
 *    children: ['2843', '2844', '2845', '2846', '2847'],
 *    display: true,
 *    expanded: false,
 *    level: 0
 *  },
 *  2843: { children: ['3343'], expanded: false,level: 1 }}
 * treeData 中会把 rowKeyValue number 转换成了 string
 **/
const getParentKeyList = (rowKeyValue: KeyType): KeyType[] => {
  const treeData = ProTableData.getStore()?.states.treeData.value || {}
  const result: KeyType[] = []
  const treeArr = Object.entries(treeData)
  // 递归查找父级节点
  const findParent = (targetKey: KeyType): KeyType | null => {
    // 遍历 treeData，查找哪个节点的 children 包含目标 key
    for (const [key, node] of treeArr) {
      const treeNode = node as AnyObject
      const children = (treeNode?.children as KeyType[]) || []
      if (children.includes(targetKey)) {
        return key as KeyType
      }
    }
    return null
  }
  // 从目标节点开始，向上查找所有父级
  let currentKey = rowKeyValue
  while (currentKey) {
    const parentKey = findParent(currentKey)
    if (parentKey) {
      result.unshift(parentKey) // 从数组头部插入，保持从根到直接父级的顺序
      currentKey = parentKey
    } else {
      break // 没有找到父级，说明已经到达根节点
    }
  }
  return result
}

// 根据 keys 列表找到对应的 children list
const getParentData = (keys: KeyType[]) => {
  const totalData = ProTableData.tableData.value
  const getRowKey = ProTableData.getRowKey.value
  const indexList: number[] = []
  const data = keys.reduce((pre, cur) => {
    const matchIndex = pre.findIndex((item) => String(getRowKey(item)) === cur)
    indexList.push(matchIndex)
    return matchIndex > -1 ? pre[matchIndex].children : []
  }, totalData)
  return { list: data, indexList }
}

const index = computed(() => {
  let index = ProTableData.getDataIndexByRowKey(ProTableData.tableData.value, props.rowValue)
  // 要从 children 中去找，分页另外处理
  if (index === -1) {
    const rowValueStr = String(props.rowValue)
    const keys = getParentKeyList(rowValueStr)
    const { indexList, list } = getParentData(keys)
    index = ProTableData.getDataIndexByRowKey(list, props.rowValue)
    // 取出顶级序号
    let firstIndex = indexList.shift()
    // 分页的场景顶级序号需要加上页数*页码
    if (!ProTableData.waterfall) {
      firstIndex = isNumber(firstIndex)
        ? getOrder(firstIndex, ProTableData.pageInfo as Required<ProTablePageParams>)
        : 0
    }
    const concatIndex = indexList.concat([index]).map((i: number) => i + 1)
    const fullIndex = [firstIndex].concat(concatIndex)
    return fullIndex.join('-')
  }
  return ProTableData.waterfall
    ? index + 1
    : getOrder(index, ProTableData.pageInfo as Required<ProTablePageParams>)
})
// 间距
const paddingStyle = computed(() => {
  const str = String(index.value)
  const len = str.split('-').length - 1
  return { paddingLeft: `${len * 8}px` }
})
</script>
