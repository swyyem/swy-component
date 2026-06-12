import type { Meta, StoryObj } from '@storybook/vue3'
import { ref, reactive } from 'vue'
import { ProField } from '@swy/components'

const meta: Meta<typeof ProField> = {
  title: 'Components/ProField',
  component: ProField,
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: 'select',
      options: ['edit', 'read'],
      description: '组件模式：编辑或只读',
    },
    valueType: {
      control: 'select',
      options: ['text', 'inputNumber', 'select', 'datePicker', 'checkbox', 'switch'],
      description: '值类型',
    },
  },
  args: {
    mode: 'edit',
    valueType: 'text',
  },
}

export default meta
type Story = StoryObj<typeof ProField>

// ==================== 基础文本输入 ====================

export const BasicText: Story = {
  render: () => ({
    components: { ProField },
    setup() {
      const value = ref('')

      return { value }
    },
    template: `
      <div style="max-width: 400px;">
        <h3>ProField 基础文本输入</h3>
        <ProField v-model="value" valueType="text" placeholder="请输入文本" />
        <p style="margin-top: 8px; color: #666; font-size: 12px;">当前值: {{ value || '空' }}</p>
      </div>
    `,
  }),
}

// ==================== 只读模式 ====================

export const ReadMode: Story = {
  render: () => ({
    components: { ProField },
    setup() {
      const value = ref('这是一段只读文本')

      return { value }
    },
    template: `
      <div style="max-width: 400px;">
        <h3>ProField 只读模式</h3>
        <ProField v-model="value" valueType="text" mode="read" />
      </div>
    `,
  }),
}

// ==================== 模式切换 ====================

export const ModeToggle: Story = {
  render: () => ({
    components: { ProField },
    setup() {
      const mode = ref<'edit' | 'read'>('edit')
      const value = ref('可切换模式的内容')

      const toggleMode = () => {
        mode.value = mode.value === 'edit' ? 'read' : 'edit'
      }

      return { mode, value, toggleMode }
    },
    template: `
      <div style="max-width: 500px;">
        <h3>ProField 模式切换</h3>
        
        <el-button @click="toggleMode" style="margin-bottom: 16px;">
          切换到{{ mode === 'edit' ? '只读' : '编辑' }}模式
        </el-button>
        
        <ProField 
          v-model="value" 
          valueType="text" 
          :mode="mode"
          placeholder="请输入内容"
        />
        
        <div style="margin-top: 16px; padding: 12px; background: #f0f5ff; border-radius: 4px;">
          <p style="margin: 0; font-size: 12px;">当前模式: <strong>{{ mode === 'edit' ? '编辑' : '只读' }}</strong></p>
          <p style="margin: 4px 0 0 0; font-size: 12px;">当前值: {{ value }}</p>
        </div>
      </div>
    `,
  }),
}

// ==================== 空态显示 ====================

export const EmptyState: Story = {
  render: () => ({
    components: { ProField },
    setup() {
      const emptyValue = ref('')
      const hasValue = ref('有内容')

      return { emptyValue, hasValue }
    },
    template: `
      <div style="max-width: 400px;">
        <h3>ProField 空态显示</h3>
        
        <h4 style="margin-top: 16px;">空值(显示默认文本)</h4>
        <ProField 
          v-model="emptyValue" 
          valueType="text" 
          mode="read"
          emptyText="暂无数据"
        />
        
        <h4 style="margin-top: 24px;">有值</h4>
        <ProField 
          v-model="hasValue" 
          valueType="text" 
          mode="read"
          emptyText="暂无数据"
        />
      </div>
    `,
  }),
}

// ==================== 数字输入 ====================

export const InputNumber: Story = {
  render: () => ({
    components: { ProField },
    setup() {
      const value = ref(0)

      return { value }
    },
    template: `
      <div style="max-width: 400px;">
        <h3>ProField 数字输入</h3>
        <ProField v-model="value" valueType="inputNumber" :fieldProps="{ min: 0, max: 100 }" />
        <p style="margin-top: 8px; color: #666; font-size: 12px;">当前值: {{ value }}</p>
      </div>
    `,
  }),
}

// ==================== 完整参数演示 ====================

export const AllValueType: Story = {
  render: () => ({
    components: { ProField },
    setup() {
      const textValue = ref('')
      const numberValue = ref(0)
      const selectValue = ref('')
      const checkboxValue = ref([])
      const switchValue = ref(false)
      const dateValue = ref('')
      const rateValue = ref(0)
      const sliderValue = ref(0)
      const colorValue = ref('')
      
      const selectOptions = [
        { label: '选项1', value: 'option1' },
        { label: '选项2', value: 'option2' },
        { label: '选项3', value: 'option3' },
      ]
      
      const checkboxOptions = [
        { label: '多选1', value: 'check1' },
        { label: '多选2', value: 'check2' },
        { label: '多选3', value: 'check3' },
      ]
      
      return {
        textValue,
        numberValue,
        selectValue,
        checkboxValue,
        switchValue,
        dateValue,
        rateValue,
        sliderValue,
        colorValue,
        selectOptions,
        checkboxOptions,
      }
    },
    template: `
      <div style="max-width: 600px;">
        <h3>ProField 所有值类型演示</h3>
        
        <h4 style="margin-top: 20px;">1. 文本输入 (text)</h4>
        <ProField v-model="textValue" valueType="text" placeholder="请输入文本" />
        
        <h4 style="margin-top: 20px;">2. 数字输入 (inputNumber)</h4>
        <ProField v-model="numberValue" valueType="inputNumber" :fieldProps="{ min: 0, max: 100, step: 1 }" />
        
        <h4 style="margin-top: 20px;">3. 下拉选择 (select)</h4>
        <ProField v-model="selectValue" valueType="select" :valueEnum="selectOptions" placeholder="请选择" />
        
        <h4 style="margin-top: 20px;">4. 复选框 (checkbox)</h4>
        <ProField v-model="checkboxValue" valueType="checkbox" :valueEnum="checkboxOptions" />
        
        <h4 style="margin-top: 20px;">5. 开关 (switch)</h4>
        <ProField v-model="switchValue" valueType="switch" />
        
        <h4 style="margin-top: 20px;">6. 日期选择 (datePicker)</h4>
        <ProField v-model="dateValue" valueType="datePicker" placeholder="请选择日期" />
        
        <h4 style="margin-top: 20px;">7. 评分 (rate)</h4>
        <ProField v-model="rateValue" valueType="rate" />
        
        <h4 style="margin-top: 20px;">8. 滑块 (slider)</h4>
        <ProField v-model="sliderValue" valueType="slider" :fieldProps="{ min: 0, max: 100 }" />
        
        <h4 style="margin-top: 20px;">9. 颜色选择 (colorPicker)</h4>
        <ProField v-model="colorValue" valueType="colorPicker" />
        
        <div style="margin-top: 24px; padding: 16px; background: #f5f5f5; border-radius: 4px;">
          <h4>当前所有值:</h4>
          <p>文本: {{ textValue }}</p>
          <p>数字: {{ numberValue }}</p>
          <p>下拉: {{ selectValue }}</p>
          <p>复选: {{ checkboxValue }}</p>
          <p>开关: {{ switchValue }}</p>
          <p>日期: {{ dateValue }}</p>
          <p>评分: {{ rateValue }}</p>
          <p>滑块: {{ sliderValue }}</p>
          <p>颜色: {{ colorValue }}</p>
        </div>
      </div>
    `,
  }),
}
