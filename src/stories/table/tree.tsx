import { ref, nextTick, onMounted } from 'vue'
import type { StoryObj } from '@storybook/vue3'
import ProTable, {
  type ProTableInstance,
  type ProTableExpandableProps,
  type ProTableRowSelectionProps,
} from '../../index'
import { columns, generateData, type RowVO } from './common'

const toolbarColumns = {
  title: '树形表格',
}
const getTreeData = (params: any) => {
  console.log('==', params)
  const list = generateData(params.size, 10)
  list[0].children = generateData(5)
  list[0].children[0].children = generateData(3)
  list[1].hasChildren = true
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          count: 351,
          result: list,
          scrollId: 'more',
        },
      })
    }, 1000)
  })
}
export const Tree: StoryObj<typeof ProTable<RowVO>> = {
  name: '树形表格',
  args: {
    rowKey: 'id',
    columns: columns,
    toolbar: toolbarColumns,
  },
  render: (args) => {
    return {
      setup() {
        // 异步加载树形子级数据
        const load = (row: RowVO, treeNode: unknown, resolve: (data: RowVO[]) => void) => {
          setTimeout(() => {
            const children = generateData(2)
            resolve(children)
          }, 1000)
        }
        const expandableConfig: ProTableExpandableProps<RowVO> = {
          onExpandedRowsChange: (keys, rows) => {
            console.log('=onExpandedRowsChange rows=', rows)
            expandableConfig.expandedRowKeys = keys
          },
        }
        const rowSelection: ProTableRowSelectionProps<RowVO> = {
          type: 'checkbox',
          // repel: true,
          checkStrictly: false,
          onChange: (rowKeys, rows) => {
            console.log('=rowKeys=', rowKeys, rows)
          },
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
              request={getTreeData}
              load={load}
              lazy={true}
              treeProps={{ children: 'children', hasChildren: 'hasChildren' }}
              rowSelection={rowSelection}
              expandable={expandableConfig}
            />
          </div>
        )
      },
    }
  },
}
