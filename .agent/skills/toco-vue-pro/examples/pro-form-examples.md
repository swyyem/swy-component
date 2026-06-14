# ProForm 使用示例

> 以下示例均来自 `src/stories/form/` 目录下的真实代码，使用 `@df/toco-ui-vue` 组件库。

---

## 示例一：基础用法（base.tsx）

使用 `columns` json 配置渲染表单，覆盖文本、数字、日期、单选、复选、下拉、价格等常用控件。  
通过 `ref` 获取表单实例，调用 `validate` 和 `getFormValues`。

```tsx
import { ref } from 'vue'
import { ProForm, type ProFormValueType, type ProFormInstance } from '@df/toco-ui-vue'

const formRef = ref<ProFormInstance>()

const columns = [
  { label: '姓名', name: 'name', required: true },
  {
    label: '年龄',
    valueType: 'inputNumber',
    name: 'age',
    required: true,
    fieldProps: { placeholder: '请输入' },
  },
  {
    label: '性别',
    valueType: 'radio',
    name: 'gender',
    required: true,
    valueEnum: [
      { key: 'male', value: 'male', label: '男' },
      { key: 'female', value: 'female', label: '女' },
    ],
  },
  {
    label: '出生日期',
    required: true,
    valueType: 'dateTimePicker',
    name: 'birth',
  },
  {
    label: '勾选',
    valueType: 'checkbox',
    name: 'selected',
    required: true,
    fieldProps: { multiple: false },
  },
  {
    label: '籍贯',
    valueType: 'selectEnhance',
    name: 'region',
    required: true,
    valueEnum: [
      { key: '1', value: '1', label: '浙江' },
      { key: '2', value: '2', label: '江西' },
    ],
    colProps: { colStyle: { width: '280px' } },
  },
  {
    label: '时间区间',
    valueType: 'dateTimeRangePicker',
    name: 'datePicker',
    required: true,
    fieldProps: {
      clearable: true,
      startPlaceholder: '开始时间',
      endPlaceholder: '结算时间',
    },
    colProps: { colStyle: { width: '450px' } },
  },
  { label: '价格', valueType: 'price', name: 'price', required: true },
]

const handleSubmit = (values: ProFormValueType) => {
  console.log('submit', values)
}

// 渲染
;<ProForm
  ref={formRef}
  formTitle="基础 json"
  mode="edit"
  emptyText="-"
  labelWidth={120}
  columns={columns}
  initialValues={{ birth: Date.now(), datePicker: [Date.now(), Date.now()] }}
  onSubmit={handleSubmit}
/>
```

---

## 示例二：表单联动（effect.tsx）

使用 `effects` 实现字段间联动：值联动、显隐联动、选项联动、必填联动、批量联动。

```tsx
import { ProForm, type EffectContextType, type EffectType } from '@df/toco-ui-vue'

const provinceEnums = [
  { key: 'zhejiang', value: 'zhejiang', label: '浙江' },
  { key: 'jiangxi', value: 'jiangxi', label: '江西' },
]
const countryEnums = [
  { key: 'China', value: 'China', label: '中国' },
  { key: 'Japan', value: 'Japan', label: '日本' },
]

// ① 值联动：选省份 → 自动填城市
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
  { label: '城市', name: 'city', fieldProps: { disabled: true } },
]

// ② 显隐联动
const displayColumns = [
  {
    label: '城市是否显示',
    valueType: 'radio',
    name: 'display',
    required: true,
    valueEnum: [
      { key: '1', value: '1', label: '是' },
      { key: '0', value: '0', label: '否' },
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
  { label: '城市', name: 'city', display: 'hidden' as const },
]

// ③ 选项联动
const valueEnumColumns = [
  {
    label: '改变选项',
    valueType: 'radio',
    name: 'display',
    required: true,
    valueEnum: [
      { key: '1', value: '1', label: '国家' },
      { key: '2', value: '2', label: '省份' },
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
  { label: '选项', valueType: 'selectEnhance', name: 'options', valueEnum: countryEnums },
]

// ④ 必填联动
const requiredColumns = [
  {
    label: '姓名是否必填',
    valueType: 'radio',
    name: 'display',
    required: true,
    valueEnum: [
      { key: '1', value: '1', label: '是' },
      { key: '0', value: '0', label: '否' },
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
  { label: '姓名', name: 'name', required: true },
]

// ⑤ batchLogic：一个字段变化同时修改多个字段
// ⚠️ 注意：不能在 batchLogic 中修改当前字段本身，否则会死循环
const batchLogicFn: EffectType['batchLogic'] = (val, { setFormValues, getValue }) => {
  console.log('当前值:', val, '姓名:', getValue('name'))
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
      { key: '1', value: '1', label: '张三' },
      { key: '2', value: '2', label: '李四' },
    ],
    effects: [{ target: '', batchLogic: batchLogicFn }],
  },
  { label: '姓名', name: 'name', required: true },
  { label: '年龄', name: 'age', required: true },
]
```

---

## 示例三：值的读取与设置（value.tsx）

支持两种方式控制表单值：`v-model` 双向绑定，或通过实例方法 `getFormValues` / `setFormValues`。

```tsx
import { ref } from 'vue'
import { ElButton } from 'element-plus'
import { ProForm, type ProFormValueType, type ProFormInstance } from '@df/toco-ui-vue'

const formRef = ref<ProFormInstance>()
const formValue = ref<ProFormValueType>({})

// v-model 方式：实时同步
;<ProForm
  modelValue={formValue.value}
  onUpdate:modelValue={(v: ProFormValueType) => { formValue.value = v }}
  labelWidth={120}
  columns={columns}
  onSubmit={(values) => console.log(values)}
/>

// 实例方法方式
const handleGetValue = () => {
  const val = formRef.value?.getFormValues()
  console.log('当前表单值：', val)
}

const handleSetValue = () => {
  formRef.value?.setFormValues({ name: '张三' })
}

;<ProForm ref={formRef} labelWidth={120} columns={columns} />
```

---

## 示例四：布局（layout.tsx）

`ProForm` 默认使用 grid 布局，`colLimit` 控制每行列数，`gutter` 控制间距；也支持 `inline` 行内布局。

```tsx
import { ProForm } from '@df/toco-ui-vue'

// Grid 布局：一行两列，间距 8px
;<ProForm
  labelWidth={120}
  labelPosition="right"
  grid={true}
  gutter={8}
  colLimit={2}
  columns={columns}
  onSubmit={handleSubmit}
/>

// inline 行内布局（grid 自动为 false）
;<ProForm
  inline={true}
  labelWidth={100}
  columns={columns}
  onSubmit={handleSubmit}
/>
```

---

## 示例五：标签写法（jsx.tsx）

除 json columns 外，也支持标签（JSX）写法，但**推荐使用 json columns**。

```tsx
import { ProForm, ProFormField, ProField, ProFormText } from '@df/toco-ui-vue'

;<ProForm labelWidth={120} onSubmit={handleSubmit}>
  <ProFormText name="name" label="姓名" required />
  <ProFormField name="name1" label="姓名1">
    <ProField />
  </ProFormField>
</ProForm>
```

---

## 示例六：valueType: table（table.tsx）

表单中内嵌可编辑表格，表格行数据与表单数据联动（通过 effects 实现父子联动）。

```tsx
import { ElButton } from 'element-plus'
import { ProForm, type EffectContextType, type ProEffectContextObject } from '@df/toco-ui-vue'

const columns = [
  {
    label: '姓名',
    name: 'name',
    required: true,
    // 外层姓名变化 → 同步更新表格中所有行的 name 字段
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
        filtersCustom: () => <ElButton type="primary">自定义按钮</ElButton>,
      },
      rowKey: 'id',
      columns: [
        {
          prop: 'name',
          label: '姓名',
          required: true,
          // 表格行内联动：姓名 → 自动填年龄
          effects: (key: string) => [
            {
              target: `${key}.age`,
              decorator: {
                value: (ctx: any) => (ctx.$self.value === '张三1' ? '88' : '99'),
              },
            },
          ],
        },
        { prop: 'age', label: '年龄', required: true },
      ],
      autoHeight: true,
      waterfall: true,
      editable: { type: 'cell' },
    },
  },
]

;<ProForm
  mode="edit"
  emptyText="-"
  formTitle="table"
  columns={columns}
  initialValues={{
    name: '张三',
    list: [
      { id: 1, name: '赵五', age: 25 },
      { id: 2, name: '李四', age: 22 },
    ],
  }}
  onSubmit={async (values) => {
    console.log('submit', values)
  }}
/>
```
