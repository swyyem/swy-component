import type { Meta, StoryObj } from '@storybook/vue3'
import { ref, reactive } from 'vue'
import ProTable, { ProDialog, ProForm } from '@swy/components'
import type { ProColumn } from '@swy/components'

const meta: Meta<typeof ProDialog> = {
  title: 'Components/ProDialog',
  component: ProDialog,
  tags: ['autodocs'],
  argTypes: {
    modelValue: {
      control: 'boolean',
      description: '是否显示对话框',
    },
    title: {
      control: 'text',
      description: '对话框标题',
    },
    width: {
      control: 'text',
      description: '对话框宽度',
    },
    fullscreen: {
      control: 'boolean',
      description: '是否全屏',
    },
    destroyOnClose: {
      control: 'boolean',
      description: '关闭时销毁内部元素',
    },
    draggable: {
      control: 'boolean',
      description: '是否可拖拽',
    },
  },
}

export default meta
type Story = StoryObj<typeof ProDialog>

// ==================== 基础对话框 ====================

export const BasicDialog: Story = {
  render: () => ({
    components: { ProDialog },
    setup() {
      const visible = ref(false)

      const handleOpen = () => {
        console.log('对话框打开')
      }

      const handleClose = () => {
        console.log('对话框关闭')
      }

      const handleSubmit = async () => {
        console.log('提交')
        visible.value = false
        return true
      }

      return { visible, handleOpen, handleClose, handleSubmit }
    },
    template: `
      <div>
        <h3>ProDialog 基础对话框</h3>
        <p style="color: #666; font-size: 12px; margin-bottom: 16px;">
          参数: modelValue, title, width, @open, @close, @submit
        </p>
        
        <el-button type="primary" @click="visible = true">打开对话框</el-button>
        
        <ProDialog
          v-model="visible"
          title="基础对话框"
          width="600px"
          :destroyOnClose="true"
          :draggable="true"
          okText="确定"
          cancelText="取消"
          @open="handleOpen"
          @close="handleClose"
          :onSubmit="handleSubmit"
        >
          <p>这是对话框的内容</p>
          <p style="color: #666;">可以在这里放置任何组件或内容</p>
        </ProDialog>
      </div>
    `,
  }),
}

// ==================== 表单对话框 ====================

export const FormDialog: Story = {
  render: () => ({
    components: { ProDialog, ProForm },
    setup() {
      const visible = ref(false)
      const formRef = ref()
      const formData = reactive({
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

      const handleSubmit = async () => {
        const result = await formRef.value?.validate()
        if (result) {
          console.log('表单数据:', formData)
          alert('提交成功')
          visible.value = false
          return true
        }
        return false
      }

      return { visible, formRef, formData, columns, handleSubmit }
    },
    template: `
      <div>
        <h3>ProDialog 表单对话框</h3>
        <p style="color: #666; font-size: 12px; margin-bottom: 16px;">
          参数: dialogType='formDialog', 内部使用 ProForm
        </p>
        
        <el-button type="primary" @click="visible = true">打开表单对话框</el-button>
        
        <ProDialog
          v-model="visible"
          title="新增用户"
          width="700px"
          dialogType="formDialog"
          :onSubmit="handleSubmit"
        >
          <ProForm
            ref="formRef"
            :columns="columns"
            :initialValues="formData"
            :submitter="false"
          />
        </ProDialog>
      </div>
    `,
  }),
}

// ==================== 表格对话框 ====================

export const TableDialog: Story = {
  render: () => ({
    components: { ProDialog, ProTable },
    setup() {
      const visible = ref(false)
      
      const columns: ProColumn<any>[] = [
        { title: 'ID', name: 'id', valueType: 'text' },
        { title: '姓名', name: 'name', valueType: 'text' },
        { title: '年龄', name: 'age', valueType: 'text' },
        { title: '地址', name: 'address', valueType: 'text' },
      ]
      
      const dataSource = [
        { id: 1, name: '张三', age: 25, address: '北京' },
        { id: 2, name: '李四', age: 30, address: '上海' },
        { id: 3, name: '王五', age: 28, address: '广州' },
        { id: 4, name: '赵六', age: 35, address: '深圳' },
        { id: 5, name: '钱七', age: 22, address: '杭州' },
      ]

      const handleSubmit = async () => {
        console.log('提交')
        visible.value = false
        return true
      }

      return { visible, columns, dataSource, handleSubmit }
    },
    template: `
      <div>
        <h3>ProDialog 表格对话框</h3>
        <p style="color: #666; font-size: 12px; margin-bottom: 16px;">
          参数: dialogType='tableDialog', 内部使用 ProTable
        </p>
        
        <el-button type="primary" @click="visible = true">打开表格对话框</el-button>
        
        <ProDialog
          v-model="visible"
          title="选择数据"
          width="900px"
          dialogType="tableDialog"
          :onSubmit="handleSubmit"
        >
          <ProTable
            :columns="columns"
            :dataSource="dataSource"
            :pagination="false"
          />
        </ProDialog>
      </div>
    `,
  }),
}

// ==================== 全屏对话框 ====================

export const FullscreenDialog: Story = {
  render: () => ({
    components: { ProDialog },
    setup() {
      const visible = ref(false)

      return { visible }
    },
    template: `
      <div>
        <h3>ProDialog 全屏对话框</h3>
        <p style="color: #666; font-size: 12px; margin-bottom: 16px;">
          参数: fullscreen
        </p>
        
        <el-button type="primary" @click="visible = true">打开全屏对话框</el-button>
        
        <ProDialog
          v-model="visible"
          title="全屏对话框"
          :fullscreen="true"
        >
          <p>这是一个全屏对话框</p>
          <p style="color: #666;">适合展示大量内容或复杂表单</p>
        </ProDialog>
      </div>
    `,
  }),
}

// ==================== 对话框类型 ====================

export const DialogTypes: Story = {
  render: () => ({
    components: { ProDialog },
    setup() {
      const dialogType = ref<'formDialog' | 'tableDialog' | 'tableFormDialog'>('formDialog')
      const visible = ref(false)

      return { visible, dialogType }
    },
    template: `
      <div>
        <h3>ProDialog 对话框类型</h3>
        <p style="color: #666; font-size: 12px; margin-bottom: 16px;">
          参数: dialogType (formDialog / tableDialog / tableFormDialog)
        </p>
        
        <div style="margin-bottom: 16px;">
          <el-radio-group v-model="dialogType">
            <el-radio-button label="formDialog">表单对话框</el-radio-button>
            <el-radio-button label="tableDialog">表格对话框</el-radio-button>
            <el-radio-button label="tableFormDialog">表格+表单对话框</el-radio-button>
          </el-radio-group>
        </div>
        
        <el-button type="primary" @click="visible = true">打开对话框</el-button>
        
        <ProDialog
          v-model="visible"
          :title="dialogType"
          width="800px"
          :dialogType="dialogType"
        >
          <p>当前类型: {{ dialogType }}</p>
        </ProDialog>
      </div>
    `,
  }),
}

// ==================== 确认关闭提示 ====================

export const CloseConfirm: Story = {
  render: () => ({
    components: { ProDialog },
    setup() {
      const visible = ref(false)
      const hasEditStatus = ref(true)

      return { visible, hasEditStatus }
    },
    template: `
      <div>
        <h3>ProDialog 确认关闭提示</h3>
        <p style="color: #666; font-size: 12px; margin-bottom: 16px;">
          参数: hasEditStatus, beforeClose
        </p>
        
        <el-button type="primary" @click="visible = true">打开对话框(有未保存内容)</el-button>
        
        <ProDialog
          v-model="visible"
          title="确认关闭"
          width="600px"
          :hasEditStatus="hasEditStatus"
        >
          <p>这个对话框有未保存的内容</p>
          <p style="color: #666;">关闭时会弹出确认提示</p>
        </ProDialog>
      </div>
    `,
  }),
}

// ==================== 自定义按钮文本 ====================

export const CustomButtonText: Story = {
  render: () => ({
    components: { ProDialog },
    setup() {
      const visible = ref(false)

      const handleSubmit = async () => {
        console.log('保存')
        visible.value = false
        return true
      }

      return { visible, handleSubmit }
    },
    template: `
      <div>
        <h3>ProDialog 自定义按钮文本</h3>
        <p style="color: #666; font-size: 12px; margin-bottom: 16px;">
          参数: okText, cancelText
        </p>
        
        <el-button type="primary" @click="visible = true">打开对话框</el-button>
        
        <ProDialog
          v-model="visible"
          title="自定义按钮"
          width="600px"
          okText="保存"
          cancelText="放弃"
          :onSubmit="handleSubmit"
        >
          <p>底部按钮文本已自定义</p>
        </ProDialog>
      </div>
    `,
  }),
}

// ==================== 完整参数演示 ====================

export const AllProps: Story = {
  render: () => ({
    components: { ProDialog },
    setup() {
      const visible = ref(false)
      const width = ref('600px')
      const fullscreen = ref(false)
      const draggable = ref(true)
      const destroyOnClose = ref(true)
      const modal = ref(true)
      const showClose = ref(true)
      const closeOnClickModal = ref(false)
      const closeOnPressEscape = ref(true)
      const lockScroll = ref(true)

      const handleSubmit = async () => {
        console.log('提交')
        visible.value = false
        return true
      }

      return { 
        visible, 
        width, 
        fullscreen, 
        draggable, 
        destroyOnClose, 
        modal,
        showClose,
        closeOnClickModal,
        closeOnPressEscape,
        lockScroll,
        handleSubmit 
      }
    },
    template: `
      <div style="max-width: 800px;">
        <h3>ProDialog 完整参数演示</h3>
        <p style="color: #666; font-size: 12px; margin-bottom: 16px;">
          所有参数: modelValue, title, type, footer, hasPadding, destroyOnClose, dialogType, 
          draggable, modal, showClose, appendTo, closeOnClickModal, closeOnPressEscape, 
          lockScroll, width, inTableRolling, okText, cancelText, fullscreen, minHeight, 
          beforeClose, hasEditStatus, onSubmit
        </p>
        
        <div style="margin-bottom: 16px; padding: 12px; background: #f5f5f5; border-radius: 4px;">
          <el-checkbox v-model="fullscreen">全屏</el-checkbox>
          <el-checkbox v-model="draggable" style="margin-left: 16px;">可拖拽</el-checkbox>
          <el-checkbox v-model="destroyOnClose" style="margin-left: 16px;">关闭销毁</el-checkbox>
          <el-checkbox v-model="modal" style="margin-left: 16px;">遮罩层</el-checkbox>
          <el-checkbox v-model="showClose" style="margin-left: 16px;">显示关闭按钮</el-checkbox>
          <el-checkbox v-model="closeOnClickModal" style="margin-left: 16px;">点击遮罩关闭</el-checkbox>
          <el-checkbox v-model="closeOnPressEscape" style="margin-left: 16px;">ESC关闭</el-checkbox>
          <el-checkbox v-model="lockScroll" style="margin-left: 16px;">锁定滚动</el-checkbox>
        </div>
        
        <el-button type="primary" @click="visible = true">打开对话框</el-button>
        
        <ProDialog
          v-model="visible"
          title="完整参数演示"
          :width="width"
          :fullscreen="fullscreen"
          :draggable="draggable"
          :destroyOnClose="destroyOnClose"
          :modal="modal"
          :showClose="showClose"
          :closeOnClickModal="closeOnClickModal"
          :closeOnPressEscape="closeOnPressEscape"
          :lockScroll="lockScroll"
          okText="确定"
          cancelText="取消"
          :onSubmit="handleSubmit"
        >
          <p>这是一个完整参数演示的对话框</p>
          <p style="color: #666;">可以通过上方的复选框实时调整参数</p>
        </ProDialog>
      </div>
    `,
  }),
}
