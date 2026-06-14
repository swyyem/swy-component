import { ref, nextTick, onMounted } from 'vue'
import { ElButton } from 'element-plus'
import type { StoryObj } from '@storybook/vue3'
import {
  ProForm,
  type ProFormValueType,
  type ProFormInstance,
  type EffectContextType,
  type ProEffectContextObject,
} from '../../index'

const columns = [
  {
    label: '姓名',
    name: 'name',
    required: true,
    effects: [
      {
        target: 'list',
        decorator: {
          value: (ctx: EffectContextType) => {
            const target = (ctx.$target as ProEffectContextObject).value
            return target?.map((item: any) => ({
              ...item,
              name: ctx.$self.value,
            }))
          },
        },
      },
    ],
  },
  {
    label: 'table',
    valueType: 'table',
    name: 'list',
    required: true,
    hasLabelSpace: false,
    fieldProps: {
      toolbar: {
        title: '自定义',
        filtersCustom: () => {
          return <ElButton type="primary">自定义按钮</ElButton>
        },
      },
      rowKey: 'id',
      columns: [
        {
          prop: 'name',
          label: '姓名',
          required: true,
          effects: (key: string) => {
            return [
              {
                target: `${key}.age`,
                decorator: {
                  value: (ctx: any) => {
                    return ctx.$self.value === '张三1' ? '88' : '99'
                  },
                },
              },
            ]
          },
        },
        {
          prop: 'age',
          label: '年龄',
          required: true,
        },
      ],
      autoHeight: true,
      waterfall: true,
      editable: {
        type: 'cell',
      },
    },
  },
]

export const Table: StoryObj<typeof ProForm> = {
  name: 'valueType: table',
  args: {
    mode: 'edit',
    emptyText: '-',
    initialValues: {
      name: '张三',
      list: [
        {
          id: 1,
          name: '赵五',
          age: 25,
        },
        {
          id: 2,
          name: '李四',
          age: 22,
        },
      ],
    },
    formTitle: 'table',
    columns: columns,
  },
  render: (args) => {
    return {
      setup() {
        const formRef = ref<ProFormInstance>()
        const handleSubmit = async (values: ProFormValueType) => {
          console.log('columns submit', values, await formRef.value?.validate())
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
