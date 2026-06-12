import { ref, nextTick, onMounted } from 'vue'
import type { StoryObj } from '@storybook/vue3'
import { ElDivider } from 'element-plus'
import {
  ProForm,
  ProFormField,
  ProField,
  ProFormText,
  type ProFormValueType,
  type ProFormInstance,
} from '../../index'

export const Tag: StoryObj<typeof ProForm> = {
  name: '标签写法',
  args: {
    labelWidth: 120,
    labelPosition: 'right',
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
            <div class="exam--desc">支持标签的写法(但还是推荐使用 json)</div>
            <ElDivider />
            <ProForm
              ref={formRef}
              {...args}
              onSubmit={handleSubmit}
            >
              <ProFormText
                name="name"
                label="姓名"
                required
              />
              <ProFormField
                name="name1"
                label="姓名1"
              >
                <ProField />
              </ProFormField>
            </ProForm>
          </div>
        )
      },
    }
  },
}
