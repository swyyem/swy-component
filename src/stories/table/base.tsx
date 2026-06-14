import { ref, nextTick, onMounted } from 'vue'
import { ElInput, type ButtonType } from 'element-plus'
import type { StoryObj } from '@storybook/vue3'
import ProTable, {
  ActionButton,
  type ProTableInstance,
  type ProColumns,
  type ProTableToolbarProps,
} from '../../index'
import { columns, getTableData, type RowVO } from './common'

const getButtonProps = (row?: RowVO) => {
  const enableFlag = row?.enableFlag || false
  // 此处使用 as const 也可以
  const type: ButtonType = enableFlag ? 'danger' : 'primary'
  return {
    type: type,
    link: true,
    label: enableFlag ? '停用' : '启用',
  }
}
const getPopconfirmProps = (row?: RowVO) => {
  const enableFlag = row?.enableFlag || false
  return {
    title: `确定要${enableFlag ? '停用' : '启动'}吗？`,
    onConfirm: (data: RowVO) => {
      if (data) {
        data.enableFlag = !enableFlag
      }
    },
  }
}

const formDialog = {
  title: '这是一个 FormDialog',
  width: '70%',
  formProps: {
    labelWidth: '100',
    columns: [
      {
        label: '姓名',
        name: 'name',
        required: true,
      },
      {
        label: '年龄',
        name: 'age',
      },
    ],
  },
}
const baseColumns = (columns as ProColumns<RowVO>).concat([
  {
    label: '操作',
    valueType: 'option',
    width: 80,
    actions: [
      {
        buttonProps: {
          label: '编辑',
          type: 'primary',
          link: true,
        },
        dialogProps: formDialog,
        request: (data: RowVO) => {
          console.log(data, 'request')
        },
      },
      {
        buttonProps: getButtonProps,
        popconfirmProps: getPopconfirmProps,
      },
    ],
  },
])
const customBase = () => {
  return (
    <>
      <ActionButton<RowVO>
        buttonProps={{
          type: 'primary',
          label: '新增',
        }}
        dialogProps={formDialog}
        request={(data?: RowVO) => {
          console.log(data, 'request')
        }}
      />
    </>
  )
}
const filterBase: ProTableToolbarProps<RowVO>['filtersCustom'] = ({ searchForm, onSearch }) => {
  // 回车事件处理函数
  const handleEnter = (e: KeyboardEvent | Event) => {
    const keyEvent = e as KeyboardEvent
    if (keyEvent.key === 'Enter') {
      onSearch()
    }
  }
  const handleModelV = (v: string) => {
    searchForm.text = v
  }
  return (
    <ElInput
      modelValue={searchForm.text}
      onUpdate:modelValue={handleModelV}
      placeholder="请输入文本"
      onKeydown={handleEnter}
    />
  )
}
const toolbarColumns = {
  title: '基础表单',
  filtersCustom: filterBase,
  buttonsCustom: customBase,
}
export const Basic: StoryObj<typeof ProTable<RowVO>> = {
  name: '基础用法',
  args: {
    rowKey: 'id',
    request: getTableData,
    columns: baseColumns,
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
            <ProTable<RowVO> ref={tableRef} {...args} />
          </div>
        )
      },
    }
  },
}
