import type { Meta, StoryObj } from '@storybook/vue3'
import { ref, reactive, h } from 'vue'
import ProTable, { ProSelect, ProOption } from '@swy/components'
import type { ProColumn } from '@swy/components'

interface DataType {
  id: number
  name: string
  age: number
  address: string
  status: number
  createTime: string
}

const meta: Meta<typeof ProSelect> = {
  title: 'Components/ProSelect',
  component: ProSelect,
  tags: ['autodocs'],
  argTypes: {
    multiple: {
      control: 'boolean',
      description: '是否多选',
    },
    filterable: {
      control: 'boolean',
      description: '是否可搜索',
    },
    clearable: {
      control: 'boolean',
      description: '是否可清空',
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用',
    },
  },
}

export default meta
type Story = StoryObj<typeof ProSelect>

// ==================== 基础下拉选择 ====================

export const BasicSelect: Story = {
  render: () => ({
    components: { ProSelect },
    setup() {
      const value = ref('')
      
      const options = [
        { label: '选项1', value: 'option1' },
        { label: '选项2', value: 'option2' },
        { label: '选项3', value: 'option3' },
        { label: '选项4', value: 'option4' },
        { label: '选项5', value: 'option5' },
      ]

      const handleChange = (val: any) => {
        console.log('选中值:', val)
      }

      return { value, options, handleChange }
    },
    template: `
      <div style="max-width: 400px;">
        <h3>ProSelect 基础下拉选择</h3>
        <p style="color: #666; font-size: 12px; margin-bottom: 16px;">
          参数: valueEnum, placeholder, @change
        </p>
        <ProSelect 
          v-model="value" 
          :valueEnum="options" 
          placeholder="请选择"
          @change="handleChange"
        />
        <p style="margin-top: 8px; color: #666; font-size: 12px;">当前值: {{ value || '未选择' }}</p>
      </div>
    `,
  }),
}

// ==================== 多选下拉 ====================

export const MultipleSelect: Story = {
  render: () => ({
    components: { ProSelect },
    setup() {
      const value = ref<string[]>([])
      
      const options = [
        { label: '选项1', value: 'option1' },
        { label: '选项2', value: 'option2' },
        { label: '选项3', value: 'option3' },
        { label: '选项4', value: 'option4' },
        { label: '选项5', value: 'option5' },
      ]

      return { value, options }
    },
    template: `
      <div style="max-width: 400px;">
        <h3>ProSelect 多选下拉</h3>
        <p style="color: #666; font-size: 12px; margin-bottom: 16px;">
          参数: multiple, collapseTags, collapseTagsTooltip, maxCollapseTags
        </p>
        <ProSelect 
          v-model="value" 
          :valueEnum="options" 
          multiple
          :collapseTags="true"
          :collapseTagsTooltip="true"
          :maxCollapseTags="3"
          placeholder="请选择(可多选)"
        />
        <p style="margin-top: 8px; color: #666; font-size: 12px;">当前值: {{ value.length > 0 ? value.join(', ') : '未选择' }}</p>
      </div>
    `,
  }),
}

// ==================== 可搜索下拉 ====================

export const FilterableSelect: Story = {
  render: () => ({
    components: { ProSelect },
    setup() {
      const value = ref('')
      
      const options = [
        { label: '北京', value: 'beijing' },
        { label: '上海', value: 'shanghai' },
        { label: '广州', value: 'guangzhou' },
        { label: '深圳', value: 'shenzhen' },
        { label: '杭州', value: 'hangzhou' },
        { label: '成都', value: 'chengdu' },
        { label: '武汉', value: 'wuhan' },
        { label: '西安', value: 'xian' },
      ]

      return { value, options }
    },
    template: `
      <div style="max-width: 400px;">
        <h3>ProSelect 可搜索下拉</h3>
        <p style="color: #666; font-size: 12px; margin-bottom: 16px;">
          参数: filterable, allowCreate, defaultFirstOption
        </p>
        <ProSelect 
          v-model="value" 
          :valueEnum="options" 
          filterable
          allowCreate
          defaultFirstOption
          placeholder="请输入搜索或创建新选项"
        />
        <p style="margin-top: 8px; color: #666; font-size: 12px;">当前值: {{ value || '未选择' }}</p>
      </div>
    `,
  }),
}

// ==================== 禁用状态 ====================

export const DisabledSelect: Story = {
  render: () => ({
    components: { ProSelect },
    setup() {
      const value1 = ref('option1')
      const value2 = ref('')
      
      const options = [
        { label: '选项1', value: 'option1' },
        { label: '选项2', value: 'option2', disabled: true },
        { label: '选项3', value: 'option3' },
      ]

      return { value1, value2, options }
    },
    template: `
      <div style="max-width: 400px;">
        <h3>ProSelect 禁用状态</h3>
        <p style="color: #666; font-size: 12px; margin-bottom: 16px;">
          参数: disabled, valueEnum中的disabled属性
        </p>
        
        <h4 style="margin-top: 16px;">整体禁用</h4>
        <ProSelect 
          v-model="value1" 
          :valueEnum="options" 
          disabled
        />
        
        <h4 style="margin-top: 24px;">部分选项禁用</h4>
        <ProSelect 
          v-model="value2" 
          :valueEnum="options" 
          placeholder="请选择(选项2被禁用)"
        />
      </div>
    `,
  }),
}

// ==================== 尺寸配置 ====================

export const SelectSizes: Story = {
  render: () => ({
    components: { ProSelect },
    setup() {
      const value1 = ref('')
      const value2 = ref('')
      const value3 = ref('')
      
      const options = [
        { label: '选项1', value: 'option1' },
        { label: '选项2', value: 'option2' },
        { label: '选项3', value: 'option3' },
      ]

      return { value1, value2, value3, options }
    },
    template: `
      <div style="max-width: 500px;">
        <h3>ProSelect 尺寸配置</h3>
        <p style="color: #666; font-size: 12px; margin-bottom: 16px;">
          参数: size (large / default / small)
        </p>
        
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <div>
            <p style="margin-bottom: 8px;">Large:</p>
            <ProSelect v-model="value1" :valueEnum="options" size="large" placeholder="大尺寸" />
          </div>
          
          <div>
            <p style="margin-bottom: 8px;">Default:</p>
            <ProSelect v-model="value2" :valueEnum="options" size="default" placeholder="默认尺寸" />
          </div>
          
          <div>
            <p style="margin-bottom: 8px;">Small:</p>
            <ProSelect v-model="value3" :valueEnum="options" size="small" placeholder="小尺寸" />
          </div>
        </div>
      </div>
    `,
  }),
}

// ==================== 全选功能 ====================

export const CheckAllSelect: Story = {
  render: () => ({
    components: { ProSelect },
    setup() {
      const value = ref<string[]>([])
      
      const options = [
        { label: '选项1', value: 'option1' },
        { label: '选项2', value: 'option2' },
        { label: '选项3', value: 'option3' },
        { label: '选项4', value: 'option4' },
        { label: '选项5', value: 'option5' },
      ]

      return { value, options }
    },
    template: `
      <div style="max-width: 400px;">
        <h3>ProSelect 全选功能</h3>
        <p style="color: #666; font-size: 12px; margin-bottom: 16px;">
          参数: checkAll, checkAllText, multiple
        </p>
        <ProSelect 
          v-model="value" 
          :valueEnum="options" 
          multiple
          :checkAll="true"
          checkAllText="全选"
          placeholder="请选择(支持全选)"
        />
        <p style="margin-top: 8px; color: #666; font-size: 12px;">当前值: {{ value.length > 0 ? value.join(', ') : '未选择' }}</p>
      </div>
    `,
  }),
}

// ==================== 远程搜索 ====================

export const RemoteSearch: Story = {
  render: () => ({
    components: { ProSelect },
    setup() {
      const value = ref('')
      const loading = ref(false)
      const options = ref<any[]>([])
      
      const remoteMethod = async (query: string) => {
        if (!query) {
          options.value = []
          return
        }
        
        loading.value = true
        // 模拟远程请求
        await new Promise(resolve => setTimeout(resolve, 500))
        
        options.value = [
          { label: `搜索结果1 - ${query}`, value: 'remote1' },
          { label: `搜索结果2 - ${query}`, value: 'remote2' },
          { label: `搜索结果3 - ${query}`, value: 'remote3' },
        ]
        
        loading.value = false
      }

      return { value, options, loading, remoteMethod }
    },
    template: `
      <div style="max-width: 400px;">
        <h3>ProSelect 远程搜索</h3>
        <p style="color: #666; font-size: 12px; margin-bottom: 16px;">
          参数: remoteMethod, filterable, keywordRequest
        </p>
        <ProSelect 
          v-model="value" 
          :valueEnum="options" 
          filterable
          :keywordRequest="true"
          :remoteMethod="remoteMethod"
          placeholder="请输入关键词搜索"
        />
        <p style="margin-top: 8px; color: #666; font-size: 12px;">当前值: {{ value || '未选择' }}</p>
      </div>
    `,
  }),
}

// ==================== 表格模式 ====================

export const TableModeSelect: Story = {
  render: () => ({
    components: { ProSelect, ProTable },
    setup() {
      const value = ref<any>(null)
      
      const columns: ProColumn<DataType>[] = [
        { title: 'ID', name: 'id', valueType: 'text' },
        { title: '姓名', name: 'name', valueType: 'text' },
        { title: '年龄', name: 'age', valueType: 'text' },
        { title: '地址', name: 'address', valueType: 'text' },
      ]
      
      const dataSource: DataType[] = [
        { id: 1, name: '张三', age: 25, address: '北京', status: 1, createTime: '2024-01-01' },
        { id: 2, name: '李四', age: 30, address: '上海', status: 1, createTime: '2024-01-02' },
        { id: 3, name: '王五', age: 28, address: '广州', status: 0, createTime: '2024-01-03' },
      ]
      
      const tableProps = {
        columns,
        dataSource,
        rowKey: 'id',
      }

      return { value, tableProps }
    },
    template: `
      <div style="max-width: 800px;">
        <h3>ProSelect 表格模式</h3>
        <p style="color: #666; font-size: 12px; margin-bottom: 16px;">
          参数: tableProps (显示表格供选择)
        </p>
        <ProSelect 
          v-model="value" 
          :tableProps="tableProps"
          :contentHeight="300"
          placeholder="请选择表格中的数据"
        />
        <p style="margin-top: 8px; color: #666; font-size: 12px;">当前值: {{ value ? JSON.stringify(value) : '未选择' }}</p>
      </div>
    `,
  }),
}

// ==================== 完整参数演示 ====================

export const AllProps: Story = {
  render: () => ({
    components: { ProSelect },
    setup() {
      const value = ref('')
      const disabled = ref(false)
      const clearable = ref(true)
      const filterable = ref(true)
      const multiple = ref(false)
      
      const options = [
        { label: '选项1', value: 'option1' },
        { label: '选项2', value: 'option2' },
        { label: '选项3', value: 'option3' },
      ]

      return { 
        value, 
        options, 
        disabled, 
        clearable, 
        filterable, 
        multiple 
      }
    },
    template: `
      <div style="max-width: 500px;">
        <h3>ProSelect 完整参数演示</h3>
        <p style="color: #666; font-size: 12px; margin-bottom: 16px;">
          所有参数: multiple, disabled, clearable, filterable, allowCreate, collapseTags, 
          teleported, fitInputWidth, remoteShowSuffix, manualRequest, waterfall, showArrow, 
          reserveKeyword, persistent, autocomplete, effect, popperClass, popperOptions, 
          valueKey, multipleLimit, maxCollapseTags, clearIcon, suffixIcon, tagType, tagEffect, 
          validateEvent, offset, placement, fallbackPlacements, tabindex, contentHeight, 
          keywordRequest, checkAll, checkAllText
        </p>
        
        <div style="margin-bottom: 16px; padding: 12px; background: #f5f5f5; border-radius: 4px;">
          <el-checkbox v-model="disabled">禁用</el-checkbox>
          <el-checkbox v-model="clearable" style="margin-left: 16px;">可清空</el-checkbox>
          <el-checkbox v-model="filterable" style="margin-left: 16px;">可搜索</el-checkbox>
          <el-checkbox v-model="multiple" style="margin-left: 16px;">多选</el-checkbox>
        </div>
        
        <ProSelect 
          v-model="value" 
          :valueEnum="options" 
          :disabled="disabled"
          :clearable="clearable"
          :filterable="filterable"
          :multiple="multiple"
          :waterfall="false"
          :showArrow="true"
          :reserveKeyword="true"
          :persistent="true"
          autocomplete="off"
          effect="light"
          valueKey="value"
          :multipleLimit="0"
          :maxCollapseTags="1"
          tagType="info"
          tagEffect="light"
          :validateEvent="true"
          :offset="12"
          placement="bottom-start"
          :tabindex="0"
          :contentHeight="274"
          placeholder="请选择"
        />
        
        <div style="margin-top: 16px; padding: 12px; background: #f0f5ff; border-radius: 4px;">
          <p style="margin: 0; font-size: 12px;">当前值: {{ value || '未选择' }}</p>
        </div>
      </div>
    `,
  }),
}
