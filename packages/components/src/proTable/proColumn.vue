<template>
  <ElTableColumn
    :type="columnType"
    :label="props.title"
    :prop="props.dataKey"
    :align="align"
    :width="props.width"
    v-bind="attrs"
    :class-name="columnClass"
  >
    <template #default="scope">
      <slot v-if="$slots['default']" v-bind="scope"></slot>
      <!-- @vue-generic {T} -->
      <ColumnCache
        v-else
        :row="scope.row"
        :rowIndex="scope.$index"
        :cellIndex="scope.cellIndex"
        :content="getRenderText"
      />
    </template>
    <template #header="scope">
      <slot v-if="$slots['header']" name="header" v-bind="scope"></slot>
      <component v-else :is="getHeaderRender(scope)"></component>
    </template>
  </ElTableColumn>
</template>
<style>
.pro-column--required {
  color: var(--pro-table--danger-color);
  margin-right: 2px;
}

.pro-column--read {
  padding: 0 var(--pro-table-td-padding);
  min-height: 32px;
  width: 100%;
  display: flex;
  align-items: center;
}

.pro-column--read > div {
  width: 100%;
}

.pro-column--checkbox {
  line-height: 0;
  justify-content: center;
}
</style>
<script setup lang="ts" generic="T extends ProComponentObject">
import { computed, useAttrs, h } from 'vue'
import { ElTableColumn } from 'element-plus'
import { getValue } from '../utils/value'
import ColumnCache from './utils/columnCache'
import type { ProComponentObject } from '../common.types'
import type { ProColumn } from './table.types'

defineOptions({
  name: 'ProColumn',
})
const attrs = useAttrs()
const props = withDefaults(defineProps<ProColumn<T>>(), {
  valueType: 'text',
  required: false,
  proFieldProps: () => ({}),
})
// 样式名
const columnClass = computed<string>(() => attrs.class as string)
// 复选框默认居中
const align = computed(() => {
  const align = props.align
  if (align) {
    return align
  }
  if (props.valueType === 'price' || props.valueType === 'inputNumber') {
    return 'right'
  }
  return props.valueType === 'checkbox' ? 'center' : 'left'
})
const types = ['expand']
const columnType = computed(() => {
  // 树形场景通过 type 插入到对应的 column
  if (props.type === 'index' || props.type === 'seq' || props.type === 'selection') {
    return 'other'
  }
  return props.type && types.includes(props.type) ? props.type : undefined
})

// 处理头部渲染，element-plus 的 tableColumn header slot
const getHeaderRender = (scope: { column: ProComponentObject; $index: number }) => {
  const headerCellRenderer = props.headerCellRenderer
  return headerCellRenderer?.({
    column: scope.column,
    columnIndex: scope.$index,
  })
}

// 处理渲染文本，element-plus 的 tableColumn default slot
const getRenderText = computed(() => {
  return (row: T, rowIndex: number, cellIndex: number) => {
    // table 会先渲染空的 column 获取到 column 对象
    if (rowIndex === -1) {
      return null
    }
    // console.log('=column render=')
    const cellKey = props.dataKey!
    const cellRenderer = props.cellRenderer
    const dom = cellRenderer?.({
      cellKey: cellKey,
      cellData: cellKey ? getValue(row, cellKey) : undefined,
      rowData: row,
      rowIndex: rowIndex,
      columnIndex: cellIndex,
    })
    if (dom) {
      return props.valueType !== 'option'
        ? dom
        : h(
            'div',
            {
              onClick: (e: MouseEvent) => e.stopPropagation(),
            },
            dom,
          )
    }
    return null
  }
})
</script>
