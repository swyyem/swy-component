import { ref, nextTick, onMounted } from 'vue'
import type { StoryObj } from '@storybook/vue3'
import { ElDivider } from 'element-plus'
import {
  ProForm,
  type ProFormValueType,
  type ProFormInstance,
} from '../../index'
import { columns } from './common'

export const Layout: StoryObj<typeof ProForm> = {
  name: '布局',
  args: {
    labelWidth: 120,
    labelPosition: 'right',
    grid: true,
    gutter: 8,
    colLimit: 2,
  },
  argTypes: {
    labelWidth: {
      control: 'number',
      table: { disable: false },
    },
    labelPosition: {
      control: { type: 'radio' },
      options: ['left', 'right', 'top'],
      table: { disable: false },
    },
    grid: {
      control: { type: 'boolean' },
    },
    gutter: {
      control: 'object',
    },
    colLimit: {
      control: 'number',
    },
  },
  render: (args) => {
    return {
      setup() {
        const formRef = ref<ProFormInstance>()
        const handleSubmit = (values: ProFormValueType) => {
          console.log('columns submit', values)
        }
        onMounted(() => {
          nextTick(() => {})
        })
        return () => (
          <div>
            <div class="exam--desc">
              默认使用了 grid 布局，colLimit 控制一行几列，gutter
              控制左右的间距。
            </div>
            <ElDivider />
            <ProForm
              ref={formRef}
              {...args}
              columns={columns}
              onSubmit={handleSubmit}
            />
            <div class="exam--desc">使用 inline，grid 则为 false。</div>
            <ElDivider />
            <ProForm
              inline={true}
              labelWidth={100}
              columns={columns}
              onSubmit={handleSubmit}
            />
          </div>
        )
      },
    }
  },
}
