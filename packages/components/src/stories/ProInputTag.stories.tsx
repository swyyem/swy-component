import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import { ProInputTag } from '../index'

const meta = {
  title: 'Example/ProInputTag',
  component: ProInputTag,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '基于 ProSelect 封装的 inputTag 组件，和 element-plus 的 inputTag 表现不一样，该组件是把输入过的内容放在下拉区域',
      },
    },
  },
} satisfies Meta<typeof ProInputTag>

export default meta
type Story = StoryObj<typeof ProInputTag>

// 基础用法
export const Basic: Story = {
  render: () => ({
    setup() {
      const selectRef = ref()
      const select = ref()
      const saveSelect = (val: any) => {
        select.value = val
      }
      const handleRemove = (val: any) => {
        console.log('=remove=', val)
      }
      return () => (
        <div style="width: 200px; height: 100px">
          <h3>基本用法</h3>
          <ProInputTag
            ref={selectRef}
            placeholder="请输入"
            modelValue={select.value}
            onUpdate:modelValue={saveSelect}
            onRemove-tag={handleRemove}
          />
        </div>
      )
    },
  }),
}
