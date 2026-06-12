import type { Meta, StoryObj } from '@storybook/vue3'
import { ref, h } from 'vue'
import {
  ElInput,
  ElRow,
  ElCol,
  ElRadio,
  ElRadioGroup,
  ElContainer,
  ElHeader,
  ElMain,
  ElButton,
} from 'element-plus'
import { ProFormList, ProForm, ProFormField, ProField, ModalForm, ProFormSelect } from '../index'

const meta = {
  title: 'Example/ModalForm',
  component: ModalForm,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '基于 Dialog 和 ProForm 封装的 ModalForm',
      },
      type: {
        // 自动生成类型文档
        showType: true,
        // 展开嵌套类型
        expandType: true,
      },
    },
  },
} satisfies Meta<typeof ModalForm>

export default meta
type Story = StoryObj<typeof ModalForm>

type FormValueType = Record<string, unknown>
// 基础表单
export const Basic: Story = {
  render: () => ({
    components: {
      ProForm,
      ProFormField,
      ProFormSelect,
      ProField,
      ProFormList,
      ModalForm,
      ElInput,
      ElCol,
      ElRow,
      ElRadio,
      ElRadioGroup,
      ElContainer,
      ElHeader,
      ElMain,
      ElButton,
    },
    setup() {
      const handleSubmit = (values: FormValueType) => {
        console.log('提交数据：', values)
        return new Promise((resolve) => {
          setTimeout(() => resolve(true), 1000)
        })
      }

      const valueEnum = [
        {
          label: '男',
          value: 'male',
        },
        {
          label: '女',
          value: 'female',
        },
      ]

      // 使用h函数创建按钮组件
      const triggerNode = h(ElButton, null, {
        default: () => '新建',
      })

      return {
        handleSubmit,
        h,
        triggerNode,
        valueEnum,
      }
    },
    template: `
      <el-container>
        <el-header height="30px">
          弹窗表单
        </el-header>
        <el-main>
          <ModalForm
            title="弹窗表单"
            width="500px"
            :trigger="triggerNode"
            :onFinish="handleSubmit"
          >
            <ProFormField
              required
              name="username"
              label="用户名"
            >
              <ProField valueType="text" placeholder="用户名" />
            </ProFormField>
            <ProFormSelect label="性别" name="gender" :valueEnum="valueEnum"  />
          </ModalForm>
        </el-main>
      </el-container>
    `,
  }),
}

// 受控
export const 受控模式: Story = {
  render: () => ({
    components: {
      ProForm,
      ProFormField,
      ProField,
      ProFormList,
      ModalForm,
      ElInput,
      ElCol,
      ElRow,
      ElRadio,
      ElRadioGroup,
      ElContainer,
      ElHeader,
      ElMain,
      ElButton,
    },
    setup() {
      const handleSubmit = (values: FormValueType) => {
        console.log('提交数据：', values)
      }

      const open = ref(false)

      const openModal = () => {
        open.value = true
      }

      const handleChange = (val: boolean) => {
        open.value = val
      }

      return {
        handleSubmit,
        h,
        open,
        handleChange,
        openModal,
      }
    },
    template: `
      <el-container>
        <el-header height="30px">
          弹窗表单
        </el-header>
        <el-main>
          <div>
            <button @click="openModal">打开弹窗</button>
          </div>
          <ModalForm
            title="弹窗表单"
            width="500px"
            :open="open"
            :onOpenChange="handleChange"
          >
            <ProFormField
              required
              name="username"
              label="用户名"
            >
              <ProField valueType="text" placeholder="用户名" />
            </ProFormField>
          </ModalForm>
        </el-main>
      </el-container>
    `,
  }),
}
