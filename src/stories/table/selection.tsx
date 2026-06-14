import { ref, reactive, nextTick, onMounted } from 'vue'
import type { StoryObj } from '@storybook/vue3'
import { ElButton } from 'element-plus'
import ProTable, { type ProTableInstance, type ProTableRowSelectionProps } from '../../index'
import { columns, getTableData, type RowVO } from './common'

const toolbarColumns = {
  title: '多选',
}

export const Selection: StoryObj<typeof ProTable<RowVO>> = {
  name: '多选',
  args: {
    rowKey: 'id',
    columns: columns,
    toolbar: toolbarColumns,
  },
  render: (args) => {
    return {
      setup() {
        const rowSelection = reactive<ProTableRowSelectionProps<RowVO>>({
          type: 'checkbox',
          repel: false,
          checkStrictly: false,
          selectedRowKeys: [12],
          selectable: (row) => {
            return row.id !== 10
          },
          onChange: (rowKeys, rows) => {
            console.log('=rowKeys=', rowKeys, rows)
          },
        })
        const clearSelection = () => {
          rowSelection.selectedRowKeys = []
        }
        const changeSelection = () => {
          rowSelection.selectedRowKeys = [12, 13]
        }
        const tableRef = ref<ProTableInstance<RowVO>>()
        onMounted(() => {
          nextTick(() => {})
        })
        return () => (
          <div>
            <div style="margin: 8px auto">
              <ElButton type="primary" onClick={clearSelection}>
                清除selection
              </ElButton>
              <ElButton type="primary" onClick={changeSelection}>
                控制selection
              </ElButton>
            </div>
            <div style="height: 500px">
              <ProTable<RowVO>
                ref={tableRef}
                {...args}
                request={getTableData}
                rowSelection={rowSelection}
              />
            </div>
          </div>
        )
      },
    }
  },
}
