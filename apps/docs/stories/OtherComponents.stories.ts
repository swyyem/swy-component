import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import { ProTransfer, ActionButton, QueryFilter, ProDatePicker } from '@swy/components'

// ==================== ProTransfer ====================

const transferMeta: Meta<typeof ProTransfer> = {
  title: 'Components/ProTransfer',
  component: ProTransfer,
  tags: ['autodocs'],
}

export default transferMeta
type TransferStory = StoryObj<typeof ProTransfer>

export const BasicTransfer: TransferStory = {
  render: () => ({
    components: { ProTransfer },
    setup() {
      const value = ref([])
      
      const data = [
        { key: '1', label: '选项1' },
        { key: '2', label: '选项2' },
        { key: '3', label: '选项3' },
        { key: '4', label: '选项4' },
        { key: '5', label: '选项5' },
      ]

      return { value, data }
    },
    template: `
      <div>
        <h3>ProTransfer 基础穿梭框</h3>
        <p style="color: #666; font-size: 12px; margin-bottom: 16px;">
          参数: data, v-model, titles, buttonTexts
        </p>
        <ProTransfer 
          v-model="value" 
          :data="data"
          :titles="['待选', '已选']"
        />
        <p style="margin-top: 8px; color: #666; font-size: 12px;">当前值: {{ value }}</p>
      </div>
    `,
  }),
}

export const TransferWithFilter: TransferStory = {
  render: () => ({
    components: { ProTransfer },
    setup() {
      const value = ref([])
      
      const data = Array.from({ length: 20 }, (_, i) => ({
        key: String(i + 1),
        label: `选项${i + 1}`,
      }))

      return { value, data }
    },
    template: `
      <div>
        <h3>ProTransfer 带搜索穿梭框</h3>
        <p style="color: #666; font-size: 12px; margin-bottom: 16px;">
          参数: filterable, filterPlaceholder
        </p>
        <ProTransfer 
          v-model="value" 
          :data="data"
          filterable
          filterPlaceholder="请输入搜索关键词"
          :titles="['待选', '已选']"
        />
      </div>
    `,
  }),
}

// ==================== ActionButton ====================

export const ActionButtonBasic = {
  render: () => ({
    components: { ActionButton },
    template: `
      <div>
        <h3>ActionButton 基础用法</h3>
        <p style="color: #666; font-size: 12px; margin-bottom: 16px;">
          参数: type, icon, text, @click
        </p>
        <div style="display: flex; gap: 12px;">
          <ActionButton type="primary" text="主要按钮" />
          <ActionButton type="success" text="成功按钮" />
          <ActionButton type="warning" text="警告按钮" />
          <ActionButton type="danger" text="危险按钮" />
        </div>
      </div>
    `,
  }),
}

export const ActionButtonWithIcon = {
  render: () => ({
    components: { ActionButton },
    template: `
      <div>
        <h3>ActionButton 带图标</h3>
        <p style="color: #666; font-size: 12px; margin-bottom: 16px;">
          参数: icon
        </p>
        <div style="display: flex; gap: 12px;">
          <ActionButton type="primary" text="编辑" icon="Edit" />
          <ActionButton type="danger" text="删除" icon="Delete" />
          <ActionButton type="success" text="添加" icon="Plus" />
        </div>
      </div>
    `,
  }),
}

export const ActionButtonDisabled = {
  render: () => ({
    components: { ActionButton },
    template: `
      <div>
        <h3>ActionButton 禁用状态</h3>
        <p style="color: #666; font-size: 12px; margin-bottom: 16px;">
          参数: disabled
        </p>
        <div style="display: flex; gap: 12px;">
          <ActionButton type="primary" text="正常按钮" />
          <ActionButton type="primary" text="禁用按钮" :disabled="true" />
        </div>
      </div>
    `,
  }),
}

// ==================== QueryFilter ====================

export const QueryFilterBasic = {
  render: () => ({
    components: { QueryFilter },
    template: `
      <div>
        <h3>QueryFilter 基础查询</h3>
        <p style="color: #666; font-size: 12px; margin-bottom: 16px;">
          参数: columns, @search, @reset
        </p>
        <QueryFilter />
      </div>
    `,
  }),
}

// ==================== ProDatePicker ====================

export const DatePickerBasic = {
  render: () => ({
    components: { ProDatePicker },
    setup() {
      const dateValue = ref('')
      const rangeValue = ref([])

      return { dateValue, rangeValue }
    },
    template: `
      <div style="max-width: 500px;">
        <h3>ProDatePicker 日期选择</h3>
        <p style="color: #666; font-size: 12px; margin-bottom: 16px;">
          参数: type, v-model, placeholder, format
        </p>
        
        <h4 style="margin-top: 16px;">日期选择</h4>
        <ProDatePicker v-model="dateValue" type="date" placeholder="请选择日期" />
        <p style="margin-top: 8px; color: #666; font-size: 12px;">当前值: {{ dateValue }}</p>
        
        <h4 style="margin-top: 24px;">日期范围</h4>
        <ProDatePicker v-model="rangeValue" type="daterange" placeholder="请选择日期范围" />
        <p style="margin-top: 8px; color: #666; font-size: 12px;">当前值: {{ rangeValue }}</p>
      </div>
    `,
  }),
}

export const DatePickerDateTime = {
  render: () => ({
    components: { ProDatePicker },
    setup() {
      const dateTimeValue = ref('')
      const dateTimeRangeValue = ref([])

      return { dateTimeValue, dateTimeRangeValue }
    },
    template: `
      <div style="max-width: 500px;">
        <h3>ProDatePicker 日期时间选择</h3>
        <p style="color: #666; font-size: 12px; margin-bottom: 16px;">
          参数: type='datetime' / 'datetimerange'
        </p>
        
        <h4 style="margin-top: 16px;">日期时间</h4>
        <ProDatePicker v-model="dateTimeValue" type="datetime" placeholder="请选择日期时间" />
        <p style="margin-top: 8px; color: #666; font-size: 12px;">当前值: {{ dateTimeValue }}</p>
        
        <h4 style="margin-top: 24px;">日期时间范围</h4>
        <ProDatePicker v-model="dateTimeRangeValue" type="datetimerange" placeholder="请选择日期时间范围" />
        <p style="margin-top: 8px; color: #666; font-size: 12px;">当前值: {{ dateTimeRangeValue }}</p>
      </div>
    `,
  }),
}

export const DatePickerMonthYear = {
  render: () => ({
    components: { ProDatePicker },
    setup() {
      const monthValue = ref('')
      const yearValue = ref('')

      return { monthValue, yearValue }
    },
    template: `
      <div style="max-width: 500px;">
        <h3>ProDatePicker 年月选择</h3>
        <p style="color: #666; font-size: 12px; margin-bottom: 16px;">
          参数: type='month' / 'year'
        </p>
        
        <h4 style="margin-top: 16px;">月份选择</h4>
        <ProDatePicker v-model="monthValue" type="month" placeholder="请选择月份" />
        <p style="margin-top: 8px; color: #666; font-size: 12px;">当前值: {{ monthValue }}</p>
        
        <h4 style="margin-top: 24px;">年份选择</h4>
        <ProDatePicker v-model="yearValue" type="year" placeholder="请选择年份" />
        <p style="margin-top: 8px; color: #666; font-size: 12px;">当前值: {{ yearValue }}</p>
      </div>
    `,
  }),
}
