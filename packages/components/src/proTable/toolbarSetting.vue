<template>
  <el-popover trigger="click" placement="bottom-end" width="162">
    <div class="protable-filter">
      <div class="protable-filter_header">
        <div class="protable-filter_left">
          <el-checkbox
            label="全部"
            v-model="isAllChecked"
            :indeterminate="isIndeterminate"
            @change="handleCheckAllChange"
          />
        </div>
        <div class="protable-filter_right">
          <el-text class="protable-filter_reset" @click="resetColumns">重置</el-text>
        </div>
      </div>
      <div class="protable-filter_list">
        <el-checkbox-group v-model="checkedColumns" @change="handleCheckedColumnChange">
          <VueDraggable
            v-model="originColumns"
            :animation="150"
            ghostClass="ghost"
            @end="handleEnd"
          >
            <div
              class="protable-filter_li"
              v-for="column in originColumns"
              :key="column.dataKey || column.key"
            >
              <el-icon size="16" class="protable-filter_sort">
                <DragIcon />
              </el-icon>
              <el-checkbox
                :label="getTitle(column)"
                :value="String(column.dataKey || column.key)"
              />
            </div>
          </VueDraggable>
        </el-checkbox-group>
      </div>
    </div>
    <template #reference>
      <slot />
    </template>
  </el-popover>
</template>

<style scoped lang="less">
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.protable-filter {
  width: 160px;
  padding: 4px;
  box-sizing: border-box;
  margin: calc(-1 * var(--el-popover-padding));

  &_header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 2px 10px;
  }

  &_reset {
    color: #7c7d7e;
    cursor: pointer;
  }

  &_list {
    margin-top: 4px;
    padding-top: 4px;
    border-top: 1px #d4d4d4 solid;
    max-height: 160px;
    overflow-y: auto;
  }

  &_li {
    display: flex;
    align-items: center;
    padding-left: 4px;
    height: 32px;
    border-radius: 2px;

    &:hover {
      background-color: rgba(0, 0, 0, 0.08);
    }
  }

  &_sort {
    margin-right: 12px;
    color: #999;
    cursor: move;
  }
}
</style>

<script setup lang="ts" generic="T extends ProComponentObject">
import { inject, ref, watch, type Ref } from 'vue'
import {
  ElCheckbox,
  ElCheckboxGroup,
  ElIcon,
  ElText,
  ElPopover,
  type CheckboxValueType,
} from 'element-plus'
import DragIcon from './icons/drag.vue'
import { VueDraggable } from 'vue-draggable-plus'
import type { ProComponentObject } from '../common.types'
import type { ProTableProviderProps, ProColumns, ProColumn } from './table.types'
defineOptions({
  name: 'ProTableToolbarSetting',
})
// title 展示
const getTitle = (column: ProColumn<T>) => {
  const { type, title, label } = column
  if (type === 'seq' || type === 'index') {
    return '序号'
  }
  return title || label
}
const ProTableConfig = inject<ProTableProviderProps<T>>('ProTableData')!
const allColumnKeys = (innerColumns: ProColumns<T>) =>
  innerColumns.map((item) => String(item.prop || item.dataKey || item.field))
// 重置
const resetColumns = () => {
  ProTableConfig.resetTableColumns()
  originColumns.value = ProTableConfig.originColumns.value.slice()
}
const columns = ProTableConfig.columns
// 需要做排序，故拷贝一份出来
const originColumns = ref(ProTableConfig.originColumns.value.slice()) as Ref<ProColumns<T>>
const isAllChecked = ref(columns.value.length === originColumns.value.length)
watch(columns, (newColumns) => {
  // console.log('=columns=', newColumns)
  isAllChecked.value = newColumns.length === originColumns.value.length
  checkedColumns.value = allColumnKeys(newColumns)
  isIndeterminate.value = newColumns.length !== originColumns.value.length
})
// 中间状态
const isIndeterminate = ref(false)
const handleCheckAllChange = (val: CheckboxValueType) => {
  ProTableConfig.setTableColumns(val ? originColumns.value : [])
}

const handleEnd = () => {
  // console.log('onEnd', e, originColumns.value)
  // 根据 originColumns 修改排序
  const changedColumns = originColumns.value
    .map((column) => {
      const index = columns.value.findIndex((item) => {
        if (column.dataKey) {
          return column.dataKey === item.dataKey
        }
        return column.key === item.key
      })
      return index > -1 ? column : false
    })
    .filter((item) => item !== false) as ProColumns<T>
  ProTableConfig.setTableColumns(changedColumns)
}
// 复选框集合
const checkedColumns = ref(allColumnKeys(columns.value))
const handleCheckedColumnChange = (values: CheckboxValueType[]) => {
  const changedColumns = originColumns.value.filter((column) => {
    return (
      values.findIndex((item) => {
        if (column.dataKey) {
          return column.dataKey === item
        }
        return column.key === item
      }) > -1
    )
  })
  ProTableConfig.setTableColumns(changedColumns)
}
</script>
