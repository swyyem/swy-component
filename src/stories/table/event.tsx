import { ref, nextTick, onMounted } from 'vue'
import type { StoryObj } from '@storybook/vue3'
import { fn } from '@vitest/spy'
import { ElButton } from 'element-plus'
import ProTable, { type ProTableInstance, type ProTableMenuVisibleParams } from '../../index'
import { columns, getTableData, type RowVO } from './common'

// 右键菜单配置
const menuConfig = {
  className: 'menu-test',
  visibleMethod: (params: ProTableMenuVisibleParams<RowVO>) => {
    console.log('=params=', params)
    return true
  },
  body: {
    options: [
      {
        label: '测试1',
        value: 'one',
        disabled: true,
      },
      {
        label: '测试2',
        value: 'two',
        visible: false,
      },
      {
        label: '测试3',
        value: 'three',
        children: [
          {
            label: '子菜单1子菜单',
            value: 'child-one',
          },
          {
            label: '子菜单2',
            value: 'child-two',
          },
        ],
      },
    ],
  },
  header: {
    options: [
      {
        label: '头部',
        value: 'three',
      },
    ],
  },
}
export const Event: StoryObj<typeof ProTable<RowVO>> = {
  name: '交互事件',
  args: {
    rowKey: 'id',
  },
  render: (args) => {
    const currentLayoutChangeEvent = fn().mockName('current-change')
    const menuClick = fn().mockName('menu-click')
    return {
      setup() {
        const tableRef = ref<ProTableInstance<RowVO>>()
        onMounted(() => {
          nextTick(() => {})
        })
        const handleSelected = () => {
          const data = tableRef.value?.getData()
          if (data) {
            tableRef.value?.setCurrentRow(data[2])
          }
        }
        const customBase = () => {
          return (
            <>
              <ElButton type="primary" onClick={handleSelected}>
                选中第三行
              </ElButton>
            </>
          )
        }
        const toolbarColumns = {
          title: '交互事件',
          buttonsCustom: customBase,
        }
        return () => (
          <div style="height: 500px">
            <ProTable<RowVO>
              ref={tableRef}
              {...args}
              columns={columns}
              toolbar={toolbarColumns}
              request={getTableData}
              firstRowSelected={true}
              onCurrentChange={currentLayoutChangeEvent}
              menuConfig={menuConfig}
              onMenuClick={menuClick}
            />
          </div>
        )
      },
    }
  },
}
