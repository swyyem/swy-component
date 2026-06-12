import { ref, nextTick, onMounted } from 'vue'
import type { StoryObj } from '@storybook/vue3'
import ProTable, { type ProTableInstance } from '../../index'
import { multipleColumns, getTableData, type RowVO } from './common'

const toolbarColumns = {
  title: '多级表头',
}
export const Multiple: StoryObj<typeof ProTable<RowVO>> = {
  name: '多级表头',
  args: {
    rowKey: 'id',
    columns: multipleColumns,
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
            <ProTable<RowVO> ref={tableRef} {...args} request={getTableData} />
          </div>
        )
      },
    }
  },
}
