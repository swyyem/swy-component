import type { Meta, StoryObj } from '@storybook/vue3'
import ProDialog, { ProFormDialog } from '../proDialog'
import { ProForm } from '../index'
import { ref } from 'vue'
import { ElButton } from 'element-plus'

const meta = {
  title: 'Example/ProDialog',
  component: ProDialog,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '基于 ElementPlus 封装的表单组件',
      },
    },
  },
} satisfies Meta<typeof ProDialog>

export default meta

type Story = StoryObj<typeof ProDialog>

export const Basic: Story = {
  parameters: {
    docs: {
      description: {
        story: 'ProDialog 的 JSX 基本用法',
      },
    },
  },
  render: () => ({
    components: {
      ProForm,
      ProDialog,
      ElButton,
    },
    setup() {
      const visviable = ref()

      const columns = [
        {
          label: '姓名',
          name: 'name',
          required: true,
        },
        {
          label: '年龄',
          name: 'age',
        },
      ]

      const onChange = (data: any) => {
        visviable.value = data
      }

      return () => (
        <div>
          <el-button onClick={() => onChange(true)}>打开</el-button>
          <ProDialog
            title="这是一个dialog"
            modelValue={visviable.value}
            type={'formDialog'}
            onUpdate:modelValue={onChange}
            v-slots={{
              'dialog-header': () => <div>这里是头部 header 插槽</div>,
              'dialog-footer': () => <div>这里是尾部 footer 插槽</div>,
            }}
          >
            <ProForm
              columns={columns}
              colon={true}
              submitter={false}
              inline={false}
              gutter={0}
            ></ProForm>
          </ProDialog>
        </div>
      )
    },
  }),
}

export const Form: Story = {
  parameters: {
    docs: {
      description: {
        story: 'ProDialog 的 JSX 基本用法',
      },
    },
  },
  render: () => ({
    components: {
      ProForm,
      ProDialog,
      ElButton,
    },
    setup() {
      const visviable = ref()

      const formProps = {
        columns: [
          {
            label: '姓名1',
            name: 'name',
            required: true,
          },
          {
            label: '年龄1',
            name: 'age',
          },
        ],
      }

      const onChange = (data: any) => {
        visviable.value = data
      }

      return () => (
        <div>
          <el-button onClick={() => onChange(true)}>打开</el-button>
          <ProFormDialog
            title="这是一个dialog"
            modelValue={visviable.value}
            type={'formDialog'}
            formProps={formProps}
            onUpdate:modelValue={onChange}
            v-slots={{
              'dialog-header': () => <div>这里是头部 header 插槽</div>,
              'dialog-footer': () => <div>这里是尾部 footer 插槽</div>,
            }}
          ></ProFormDialog>
        </div>
      )
    },
  }),
}
