import type { Meta, StoryObj } from '@storybook/vue3'
import { ref, reactive } from 'vue'
import { ProForm } from '@swy/components'

const meta: Meta<typeof ProForm> = {
  title: 'Components/ProForm',
  component: ProForm,
  tags: ['autodocs'],
  argTypes: {
    inline: {
      control: 'boolean',
      description: '是否行内表单',
    },
    grid: {
      control: 'boolean',
      description: '是否启用网格布局',
    },
    labelPosition: {
      control: 'select',
      options: ['left', 'right', 'top'],
      description: '标签位置',
    },
    labelWidth: {
      control: 'text',
      description: '标签宽度',
    },
    colon: {
      control: 'boolean',
      description: '是否显示冒号',
    },
    submitter: {
      control: 'object',
      description: '提交按钮配置',
    },
  },
}

export default meta
type Story = StoryObj<typeof ProForm>

// ==================== 基础表单 ====================

export const BasicForm: Story = {
  render: () => ({
    components: { ProForm },
    setup() {
      const formRef = ref()
      const initialValues = reactive({
        name: '',
        age: undefined,
        email: '',
      })

      const columns = [
        {
          title: '姓名',
          name: 'name',
          valueType: 'text',
          rules: [{ required: true, message: '请输入姓名' }],
        },
        {
          title: '年龄',
          name: 'age',
          valueType: 'inputNumber',
          rules: [{ required: true, message: '请输入年龄' }],
        },
        {
          title: '邮箱',
          name: 'email',
          valueType: 'text',
          rules: [{ required: true, message: '请输入邮箱' }],
        },
      ]

      const handleSubmit = (values: any) => {
        console.log('提交:', values)
        alert('提交成功，查看控制台')
      }

      const handleReset = () => {
        console.log('重置')
      }

      const handleValuesChange = (values: any) => {
        console.log('值变化:', values)
      }

      return { formRef, initialValues, columns, handleSubmit, handleReset, handleValuesChange }
    },
    template: `
      <div style="max-width: 600px;">
        <h3>ProForm 基础表单</h3>
        <p style="color: #666; font-size: 12px; margin-bottom: 16px;">
          参数: columns, initialValues, @finish, @reset, @valuesChange
        </p>
        <ProForm
          ref="formRef"
          :columns="columns"
          :initialValues="initialValues"
          @finish="handleSubmit"
          @reset="handleReset"
          @valuesChange="handleValuesChange"
        />
      </div>
    `,
  }),
}

// ==================== 网格布局表单 ====================

export const GridForm: Story = {
  render: () => ({
    components: { ProForm },
    setup() {
      const formRef = ref()
      const initialValues = reactive({
        name: '',
        age: undefined,
        email: '',
        phone: '',
        address: '',
      })

      const columns = [
        {
          title: '姓名',
          name: 'name',
          valueType: 'text',
        },
        {
          title: '年龄',
          name: 'age',
          valueType: 'inputNumber',
        },
        {
          title: '邮箱',
          name: 'email',
          valueType: 'text',
        },
        {
          title: '手机号',
          name: 'phone',
          valueType: 'text',
        },
        {
          title: '地址',
          name: 'address',
          valueType: 'text',
          colProps: { span: 24 },
        },
      ]

      const handleSubmit = (values: any) => {
        console.log('提交:', values)
        alert('提交成功')
      }

      return { formRef, initialValues, columns, handleSubmit }
    },
    template: `
      <div style="max-width: 800px;">
        <h3>ProForm 网格布局表单</h3>
        <p style="color: #666; font-size: 12px; margin-bottom: 16px;">
          参数: grid=true, colLimit=2, gutter=20, columns, colProps
        </p>
        <ProForm
          ref="formRef"
          :columns="columns"
          :initialValues="initialValues"
          :grid="true"
          :colLimit="2"
          :gutter="20"
          @finish="handleSubmit"
        />
      </div>
    `,
  }),
}

// ==================== 行内表单 ====================

export const InlineForm: Story = {
  render: () => ({
    components: { ProForm },
    setup() {
      const formRef = ref()
      const initialValues = reactive({
        keyword: '',
        status: undefined,
      })

      const columns = [
        {
          title: '关键词',
          name: 'keyword',
          valueType: 'text',
        },
        {
          title: '状态',
          name: 'status',
          valueType: 'select',
          valueEnum: [
            { label: '启用', value: 1 },
            { label: '禁用', value: 0 },
          ],
        },
      ]

      const handleSubmit = (values: any) => {
        console.log('搜索:', values)
        alert('搜索成功')
      }

      return { formRef, initialValues, columns, handleSubmit }
    },
    template: `
      <div style="max-width: 800px;">
        <h3>ProForm 行内表单(搜索)</h3>
        <p style="color: #666; font-size: 12px; margin-bottom: 16px;">
          参数: inline=true, submitter配置
        </p>
        <ProForm
          ref="formRef"
          :columns="columns"
          :initialValues="initialValues"
          :inline="true"
          :submitter="{
            submitButtonText: '搜索',
            resetButtonText: '重置'
          }"
          @finish="handleSubmit"
        />
      </div>
    `,
  }),
}

// ==================== 表单标题 ====================

export const FormWithTitle: Story = {
  render: () => ({
    components: { ProForm },
    setup() {
      const initialValues = reactive({
        title: '',
        content: '',
      })

      const columns = [
        {
          title: '标题',
          name: 'title',
          valueType: 'text',
          rules: [{ required: true, message: '请输入标题' }],
        },
        {
          title: '内容',
          name: 'content',
          valueType: 'text',
          fieldProps: { type: 'textarea', rows: 4 },
        },
      ]

      const handleSubmit = (values: any) => {
        console.log('提交:', values)
        alert('提交成功')
      }

      return { initialValues, columns, handleSubmit }
    },
    template: `
      <div style="max-width: 600px;">
        <h3>ProForm 带标题表单</h3>
        <p style="color: #666; font-size: 12px; margin-bottom: 16px;">
          参数: formTitle, formTitleClass
        </p>
        <ProForm
          :columns="columns"
          :initialValues="initialValues"
          formTitle="基本信息"
          formTitleClass="custom-title-class"
          @finish="handleSubmit"
        />
      </div>
    `,
  }),
}

// ==================== 表单验证 ====================

export const FormValidation: Story = {
  render: () => ({
    components: { ProForm },
    setup() {
      const formRef = ref()
      const initialValues = reactive({
        username: '',
        password: '',
        confirmPassword: '',
      })

      const columns = [
        {
          title: '用户名',
          name: 'username',
          valueType: 'text',
          rules: [
            { required: true, message: '请输入用户名' },
            { min: 3, max: 20, message: '长度在 3 到 20 个字符' },
          ],
        },
        {
          title: '密码',
          name: 'password',
          valueType: 'text',
          fieldProps: { type: 'password', showPassword: true },
          rules: [{ required: true, message: '请输入密码' }],
        },
        {
          title: '确认密码',
          name: 'confirmPassword',
          valueType: 'text',
          fieldProps: { type: 'password', showPassword: true },
          rules: [{ required: true, message: '请再次输入密码' }],
        },
      ]

      const handleSubmit = (values: any) => {
        console.log('提交:', values)
        alert('验证通过，提交成功')
      }

      const handleFailed = (values: any) => {
        console.log('验证失败:', values)
      }

      return { formRef, initialValues, columns, handleSubmit, handleFailed }
    },
    template: `
      <div style="max-width: 500px;">
        <h3>ProForm 表单验证</h3>
        <p style="color: #666; font-size: 12px; margin-bottom: 16px;">
          参数: rules, fieldErrorType, @finishFailed
        </p>
        <ProForm
          ref="formRef"
          :columns="columns"
          :initialValues="initialValues"
          :fieldErrorType="'tip'"
          @finish="handleSubmit"
          @finishFailed="handleFailed"
        />
      </div>
    `,
  }),
}

// ==================== 标签位置 ====================

export const LabelPosition: Story = {
  render: () => ({
    components: { ProForm },
    setup() {
      const labelPosition = ref<'left' | 'right' | 'top'>('left')
      const labelWidth = ref('120px')
      const colon = ref(true)
      
      const initialValues = reactive({
        field1: '',
        field2: '',
        field3: '',
      })

      const columns = [
        {
          title: '字段1',
          name: 'field1',
          valueType: 'text',
        },
        {
          title: '字段2',
          name: 'field2',
          valueType: 'text',
        },
        {
          title: '字段3',
          name: 'field3',
          valueType: 'text',
        },
      ]

      const handleSubmit = (values: any) => {
        console.log('提交:', values)
      }

      return { 
        labelPosition, 
        labelWidth, 
        colon, 
        initialValues, 
        columns, 
        handleSubmit 
      }
    },
    template: `
      <div style="max-width: 600px;">
        <h3>ProForm 标签位置配置</h3>
        <p style="color: #666; font-size: 12px; margin-bottom: 16px;">
          参数: labelPosition, labelWidth, labelSuffix, colon
        </p>
        
        <div style="margin-bottom: 16px;">
          <el-radio-group v-model="labelPosition">
            <el-radio-button label="left">左侧</el-radio-button>
            <el-radio-button label="right">右侧</el-radio-button>
            <el-radio-button label="top">顶部</el-radio-button>
          </el-radio-group>
          
          <div style="margin-top: 12px;">
            <el-checkbox v-model="colon">显示冒号</el-checkbox>
          </div>
        </div>
        
        <ProForm
          :columns="columns"
          :initialValues="initialValues"
          :labelPosition="labelPosition"
          :labelWidth="labelWidth"
          :labelSuffix="':'"
          :colon="colon"
          @finish="handleSubmit"
        />
      </div>
    `,
  }),
}

// ==================== 提交按钮配置 ====================

export const SubmitterConfig: Story = {
  render: () => ({
    components: { ProForm },
    setup() {
      const initialValues = reactive({
        name: '',
      })

      const columns = [
        {
          title: '名称',
          name: 'name',
          valueType: 'text',
        },
      ]

      const handleSubmit = (values: any) => {
        console.log('提交:', values)
        alert('提交成功')
      }

      const submitterConfig = {
        submitButtonText: '提交数据',
        resetButtonText: '清空表单',
        align: 'right' as const,
        submitButtonProps: {
          type: 'primary',
          size: 'large',
        },
        resetButtonProps: {
          size: 'large',
        },
      }

      return { initialValues, columns, handleSubmit, submitterConfig }
    },
    template: `
      <div style="max-width: 600px;">
        <h3>ProForm 提交按钮配置</h3>
        <p style="color: #666; font-size: 12px; margin-bottom: 16px;">
          参数: submitter (submitButtonText, resetButtonText, align, submitButtonProps, resetButtonProps)
        </p>
        <ProForm
          :columns="columns"
          :initialValues="initialValues"
          :submitter="submitterConfig"
          @finish="handleSubmit"
        />
      </div>
    `,
  }),
}

// ==================== 键盘导航 ====================

export const KeyboardNavigation: Story = {
  render: () => ({
    components: { ProForm },
    setup() {
      const keyboard = ref(true)
      const initialValues = reactive({
        field1: '',
        field2: '',
        field3: '',
        field4: '',
      })

      const columns = [
        {
          title: '字段1',
          name: 'field1',
          valueType: 'text',
        },
        {
          title: '字段2',
          name: 'field2',
          valueType: 'text',
        },
        {
          title: '字段3',
          name: 'field3',
          valueType: 'text',
        },
        {
          title: '字段4',
          name: 'field4',
          valueType: 'text',
        },
      ]

      const handleSubmit = (values: any) => {
        console.log('提交:', values)
        alert('提交成功')
      }

      return { keyboard, initialValues, columns, handleSubmit }
    },
    template: `
      <div style="max-width: 600px;">
        <h3>ProForm 键盘导航</h3>
        <p style="color: #666; font-size: 12px; margin-bottom: 16px;">
          参数: keyboard, keyboardColumnKeys
        </p>
        
        <div style="margin-bottom: 16px;">
          <el-checkbox v-model="keyboard">启用键盘导航(Enter跳转下一项)</el-checkbox>
        </div>
        
        <ProForm
          :columns="columns"
          :initialValues="initialValues"
          :keyboard="keyboard"
          @finish="handleSubmit"
        />
      </div>
    `,
  }),
}

// ==================== 省略其他stories以节省空间 ====================
