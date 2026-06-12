import { ref, nextTick, onMounted } from 'vue'
import type { StoryObj } from '@storybook/vue3'
import { ElDivider, ElTag } from 'element-plus'
import {
  ProForm,
  type ProFormValueType,
  type ProFormInstance,
  type EffectContextType,
  type EffectType,
} from '../../index'

const provinceEnums = [
  {
    key: 'zhejiang',
    value: 'zhejiang',
    label: '浙江',
  },
  {
    key: 'jiangxi',
    value: 'jiangxi',
    label: '江西',
  },
]
const countryEnums = [
  {
    key: 'China',
    value: 'China',
    label: '中国',
  },
  {
    key: 'Japan',
    value: 'Japan',
    label: '日本',
  },
  {
    key: 'Korea',
    value: 'Korea',
    label: '韩国',
  },
]
const effectColumns = [
  {
    label: '省份',
    valueType: 'selectEnhance',
    name: 'province',
    required: true,
    valueEnum: provinceEnums,
    effects: [
      {
        target: 'city',
        decorator: {
          value: "ctx.$self.value === 'zhejiang' ? '杭州' : '南昌'",
        },
      },
    ],
  },
  {
    label: '城市',
    name: 'city',
    fieldProps: {
      disabled: true,
    },
  },
]

const displayColumns = [
  {
    label: '城市是否显示',
    valueType: 'radio',
    name: 'display',
    required: true,
    valueEnum: [
      {
        key: '1',
        value: '1',
        label: '是',
      },
      {
        key: '0',
        value: '0',
        label: '否',
      },
    ],
    effects: [
      {
        target: 'city',
        decorator: {
          display: "ctx.$self.value === '1' ? 'visible' : 'hidden'",
        },
      },
    ],
  },
  {
    label: '城市',
    name: 'city',
    display: 'hidden' as const,
  },
]
const valueEnumColumns = [
  {
    label: '改变选项',
    valueType: 'radio',
    name: 'display',
    required: true,
    valueEnum: [
      {
        key: '1',
        value: '1',
        label: '国家',
      },
      {
        key: '2',
        value: '2',
        label: '省份',
      },
    ],
    effects: [
      {
        target: 'options',
        decorator: {
          valueEnum: (ctx: EffectContextType) => {
            return ctx.$self.value === '1' ? countryEnums : provinceEnums
          },
        },
      },
    ],
  },
  {
    label: '选项',
    valueType: 'selectEnhance',
    name: 'options',
    valueEnum: countryEnums,
  },
]
const requiredColumns = [
  {
    label: '姓名是否必填',
    valueType: 'radio',
    name: 'display',
    required: true,
    valueEnum: [
      {
        key: '1',
        value: '1',
        label: '是',
      },
      {
        key: '0',
        value: '0',
        label: '否',
      },
    ],
    effects: [
      {
        target: 'name',
        decorator: {
          required: "ctx.$self.value === '1' ? true : false",
        },
      },
    ],
  },
  {
    label: '姓名',
    name: 'name',
    required: true,
  },
]

const batchLogicMultiple: EffectType['batchLogic'] = (
  val,
  { setFormValues, getValue },
) => {
  console.log('=val=', val, getValue('name'))
  const hasOne = val === '1'
  setFormValues({
    name: hasOne ? '张三' : '李四',
    age: hasOne ? 25 : 22,
  })
}

const multipleColumns = [
  {
    label: '多个变化',
    valueType: 'radio',
    name: 'display',
    required: true,
    valueEnum: [
      {
        key: '1',
        value: '1',
        label: '张三',
      },
      {
        key: '2',
        value: '2',
        label: '李四',
      },
    ],
    effects: [
      {
        target: '',
        batchLogic: batchLogicMultiple,
      },
    ],
  },
  {
    label: '姓名',
    name: 'name',
    required: true,
  },
  {
    label: '年龄',
    name: 'age',
    required: true,
  },
]
export const Effect: StoryObj<typeof ProForm> = {
  name: '联动',
  render: () => {
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
              labelWidth={120}
              formTitle="选择省份填入城市"
              columns={effectColumns}
              onSubmit={handleSubmit}
            />
            <ElDivider />
            <ProForm
              labelWidth={120}
              formTitle="控制显示"
              columns={displayColumns}
              initialValues={{ display: '0' }}
            />
            <ElDivider />
            <ProForm
              labelWidth={120}
              formTitle="改变下拉选项"
              columns={valueEnumColumns}
              initialValues={{ display: '1' }}
            />
            <ElDivider />
            <ProForm
              labelWidth={120}
              formTitle="改变必填"
              columns={requiredColumns}
              initialValues={{ display: '1' }}
            />
            <ElDivider />
            <div class="exam--desc">
              如果当前值的变化需要改变多个表单项，或者多个隐藏的值，可以使用
              effects 中的 `batchLogic`。
            </div>
            <div class="exam--desc">
              <ElTag
                type="danger"
                effect="dark"
              >
                注意
              </ElTag>
              <span
                class="exam--danger"
                style="margin-left: 8px"
              >
                不能在 `batchLogic` 中改变当前的值，否则会陷入无限循环直接卡死
              </span>
            </div>
            <ElDivider />
            <ProForm
              labelWidth={120}
              formTitle="改变多项"
              columns={multipleColumns}
            />
          </div>
        )
      },
    }
  },
}
