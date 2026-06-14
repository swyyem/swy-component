import { ref, nextTick, onMounted } from 'vue'
import type { StoryObj } from '@storybook/vue3'
import {
  ProForm,
  type ProFormValueType,
  type ProFormInstance,
} from '../../index'
import { columns } from './common'

export const Basic: StoryObj<typeof ProForm> = {
  name: '基础用法',
  args: {
    formTitle: '基础 json',
    mode: 'edit',
    emptyText: '-',
    labelWidth: 120,
    columns: columns,
    initialValues: {
      birth: new Date().getTime(),
      datePicker: [new Date().getTime(), new Date().getTime()],
    },
  },
  argTypes: {
    labelWidth: {
      control: 'number',
      table: { disable: false },
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
            <ProForm
              ref={formRef}
              {...args}
              onSubmit={handleSubmit}
            />
          </div>
        )
      },
    }
  },
}
