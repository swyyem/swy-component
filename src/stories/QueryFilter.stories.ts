import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import {
  ElInput,
  ElRow,
  ElCol,
  ElRadio,
  ElRadioGroup,
  ElContainer,
  ElHeader,
  ElMain,
} from 'element-plus'
import { ProForm, ProFormField, ProField, QueryFilter } from '../index'
const meta = {
  title: 'Example/QueryFilter',
  component: QueryFilter,
  tags: ['autodocs'],
  argTypes: {
    submitter: {
      control: 'object',
      description: '表单底部的按钮配置',
    },
  },
  parameters: {
    docs: {
      description: {
        component: '基于 ElementPlus 封装的表单查询组件',
      },
      type: {
        // 自动生成类型文档
        showType: true,
        // 展开嵌套类型
        expandType: true,
      },
    },
  },
} satisfies Meta<typeof QueryFilter>

export default meta
type Story = StoryObj<typeof QueryFilter>

type FormValueType = Record<string, unknown>

export const Basic: Story = {
  render: () => ({
    components: {
      QueryFilter,
      ProForm,
      ProFormField,
      ProField,
      ElInput,
      ElCol,
      ElRow,
      ElRadio,
      ElRadioGroup,
      ElContainer,
      ElHeader,
      ElMain,
    },
    setup() {
      const handleSubmit = (values: FormValueType) => {
        console.log('提交数据：', values)
      }

      const handleChange = (newValues: FormValueType, values: FormValueType) => {
        console.log('valueChange', newValues, values)
      }

      const rules = {
        age: [{ min: 15, max: 18, message: 'Length should be 15 to 18', trigger: 'blur' }],
      }

      const options = [
        {
          key: 'male',
          value: 'male',
          label: '男',
        },
        {
          key: 'female',
          value: 'female',
          label: '女',
        },
      ]

      const mode = ref('edit')

      const initialValues = {
        age: '18',
      }

      const columns = [
        {
          label: '年龄',
          valueType: 'text',
          name: 'age1',
          required: true,
          fieldProps: {},
          colProps: {
            // span: 8,
          },
        },
        {
          label: '时间',
          valueType: 'datePicker',
          name: 'name222',
          fieldProps: {},
          colProps: {
            // span: 4,
          },
        },
        {
          label: '年龄',
          valueType: 'text',
          name: 'age',
          required: true,
          fieldProps: {},
          colProps: {},
        },
      ]

      const onSearchSubmit = (value: any) => {
        console.log('submit', value)
      }

      const onSearchReset = (e: any) => {
        console.log('reset', e)
      }

      return {
        handleSubmit,
        handleChange,
        onSearchSubmit,
        onSearchReset,
        options,
        rules,
        mode,
        columns,
        initialValues,
      }
    },
    template: `
      <el-container>
        <el-header height="30px">
          <el-radio-group v-model="mode">
            <el-radio value="edit">编辑</el-radio>
            <el-radio value="read">只读</el-radio>
          </el-radio-group>
        </el-header>
        <el-main>
          <QueryFilter :columns="columns" :rules="rules" :initialValues="initialValues" :onSubmit="onSearchSubmit" :onReset="onSearchReset" :searchCol="{xs: 1, sm: 3, md: 2, lg: 3, xl: 5}" :gutter="20" :searchBtn="true" :collapsed="false" :showCollapse="true" :searchLoading="false" :showMessage="true"></QueryFilter>
        </el-main>
      </el-container>
    `,
  }),
}
