import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import type { ConcreteComponent } from 'vue'
import { ProTransfer, type ProTransferChangeMethod, type ProTransferValueType } from '../index'

const meta = {
  title: 'Example/ProTransfer',
  component: ProTransfer as unknown as ConcreteComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '基于表格的 transfer',
      },
    },
  },
} satisfies Meta<typeof ProTransfer>

export default meta
type Story = StoryObj<typeof ProTransfer>

type RowVO = {
  id: number
  code: string
  name: string
}
const generateData = (n: number = 10, start?: number, str = ''): RowVO[] => {
  const res: RowVO[] = []
  const realStart = start || 0
  for (let i = 0; i < n; i++) {
    res.push({
      id: realStart + i,
      code: `code${realStart + i}`,
      name: `name${realStart + i}${str}`,
    })
  }
  return res
}
// 基础用法
export const Basic: Story = {
  render: () => ({
    setup() {
      const selectRef = ref()
      const select = ref()
      const saveSelect = (val: any) => {
        select.value = val
      }
      const handleChange: ProTransferChangeMethod = (value, direction, moved) => {
        console.log('=changed=', value, direction, moved)
      }
      const handleLeftChange = (value: ProTransferValueType) => {
        console.log('=changed left=', value)
      }
      const handleRightChange = (value: ProTransferValueType) => {
        console.log('=changed right=', value)
      }
      const tableProps = {
        columns: [
          {
            title: '编码',
            dataKey: 'code',
          },
          {
            title: '名称',
            dataKey: 'name',
          },
        ],
      }
      const valueEnum = generateData(10)
      return () => (
        <div>
          <h3>基本用法</h3>
          <ProTransfer
            ref={selectRef}
            modelValue={select.value}
            valueKey="id"
            onUpdate:modelValue={saveSelect}
            onChange={handleChange}
            onLeftCheckChange={handleLeftChange}
            onRightCheckChange={handleRightChange}
            data={valueEnum}
            tableProps={tableProps}
          />
        </div>
      )
    },
  }),
}
