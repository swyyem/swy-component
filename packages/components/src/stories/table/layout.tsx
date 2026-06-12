import { ref, nextTick, onMounted } from 'vue'
import type { StoryObj } from '@storybook/vue3'
import ProTable, { type ProTableInstance } from '../../index'
import { columns, getTableData, type RowVO } from './common'

const toolbarColumns = {
  title: '布局',
}
export const Layout: StoryObj<typeof ProTable<RowVO>> = {
  name: '布局',
  args: {
    containerClass: 'test-table--containerClass',
    tableClassName: 'test-table--tableClassName',
    bodyClassName: 'test-table--bodyClassName',
    bodyMainClassName: 'test-table--bodyMainClassName',
    autoHeight: false,
    round: true,
    height: 300,
    maxHeight: 400,
    sameMaxHeight: true,
    rowKey: 'id',
    columns: columns,
    toolbar: toolbarColumns,
  },
  render: (args) => {
    return {
      setup() {
        const tableRef = ref<ProTableInstance<RowVO>>()
        onMounted(() => {
          nextTick(() => {})
        })
        return () => (
          <div style="height: 500px">
            <ProTable<RowVO>
              ref={tableRef}
              {...args}
              request={getTableData}
              pagination={{ pageSize: 20 }}
            />
          </div>
        )
      },
    }
  },
}
