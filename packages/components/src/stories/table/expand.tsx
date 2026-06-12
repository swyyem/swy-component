import { ref, reactive, nextTick, onMounted } from 'vue'
import type { StoryObj } from '@storybook/vue3'
import { ElButton } from 'element-plus'
import ProTable, { type ProTableInstance, type ProTableExpandableProps } from '../../index'
import { columns, expandColumns, generateData, getTableData, type RowVO } from './common'

const toolbarColumns = {
  title: '展开行',
}
export const Expand: StoryObj<typeof ProTable<RowVO>> = {
  name: '展开行',
  args: {
    rowKey: 'id',
    columns: columns,
    toolbar: toolbarColumns,
  },
  render: (args) => {
    return {
      setup() {
        const expandableConfig: ProTableExpandableProps<RowVO> = reactive({
          expandedRowKeys: [11],
          onExpandedRowsChange: (keys, rows) => {
            console.log('=onExpandedRowsChange rows=', rows)
            expandableConfig.expandedRowKeys = keys
          },
        })
        const changeExpand = () => {
          expandableConfig.expandedRowKeys = [12, 13]
        }
        const customToolbar = () => {
          return (
            <>
              <ElButton type="primary" onClick={changeExpand}>
                控制expand
              </ElButton>
            </>
          )
        }
        const custom = (res: any) => {
          const { row } = res
          console.log('=res=', res)
          return (
            <div style={{ padding: '10px' }}>
              <p>是否选中: {row.selected ? '是' : '否'}</p>
              <h3>表格</h3>
              <ProTable
                rowKey="chargeItemId"
                defaultData={generateData(3, 100)}
                columns={expandColumns}
                toolbar={false}
                pagination={false}
                autoHeight={true}
              />
            </div>
          )
        }
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
              expandable={expandableConfig}
              v-slots={{
                expand: custom,
                'toolbar-buttons': customToolbar,
              }}
            />
          </div>
        )
      },
    }
  },
}
