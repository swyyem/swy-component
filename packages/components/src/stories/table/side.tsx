import { ref, nextTick, onMounted } from 'vue'
import type { StoryObj } from '@storybook/vue3'
import { ElButton } from 'element-plus'
import ProTable, { type ProTableInstance } from '../../index'
import { columns, childColumns, generateData, getTableData, type RowVO } from './common'

const toolbarColumns = {
  title: '左右布局',
}
const pagination = {
  pageSize: 10,
  layout: 'total, prev, next, jumper, sizes',
}
export const Side: StoryObj<typeof ProTable<RowVO>> = {
  name: '左右插槽',
  args: {
    tableClassName: 'base-table--layout',
    bodyClassName: 'base-table--body',
    bodyMainClassName: 'base-table--main',
    rowKey: 'id',
    columns: columns,
    toolbar: toolbarColumns,
  },
  render: (args) => {
    const tableRef = ref<ProTableInstance<RowVO>>()
    const childTableRef = ref<ProTableInstance<RowVO>>()
    const handleSetData = () => {
      childTableRef.value?.setData(generateData(20))
      // 改变左侧表格高度
      tableRef.value?.resize()
    }
    const customColumn = () => {
      return (
        <>
          <ElButton type="primary" onClick={handleSetData}>
            插槽表格数据修改
          </ElButton>
        </>
      )
    }
    const customSide = () => {
      return (
        <div class="base-table--side">
          <ProTable
            ref={childTableRef}
            rowKey="id"
            request={getTableData}
            columns={childColumns}
            toolbar={false}
            pagination={pagination}
          />
        </div>
      )
    }
    return {
      setup() {
        onMounted(() => {
          nextTick(() => {})
        })
        return () => (
          <div style="height: 500px">
            <ProTable<RowVO>
              ref={tableRef}
              {...args}
              request={getTableData}
              pagination={pagination}
              v-slots={{
                'toolbar-buttons': customColumn,
                'table-side': customSide,
              }}
            />
          </div>
        )
      },
    }
  },
}
