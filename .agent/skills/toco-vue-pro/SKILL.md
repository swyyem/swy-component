---
name: toco-vue-pro
description: 使用 @df/toco-ui-vue 组件库搭建业务页面的标准流程。当用户需要新建业务页面、列表页、表单页时，必须使用此 Skill。
examples:
  - examples/pro-table-examples.md
  - examples/pro-form-examples.md
---

# 业务页面搭建规范

## ⚠️ 使用此 Skill 前必须执行

在生成任何业务页面代码之前，**必须**先使用 `view_file` 工具读取以下两个示例文件的完整内容，并将其作为代码风格、结构和 API 用法的参考依据：

- `examples/pro-table-examples.md` —— ProTable 的 5 个真实业务示例（基础列表、编辑表格、单行选中、多级表头、树形表格）
- `examples/pro-form-examples.md` —— ProForm 的 5 个真实业务示例（基础表单、effects 联动、ModalForm、batchLogic、DrawerForm）

读取完成后，严格参照示例中的写法生成代码，不得自行发明未在示例或规范中出现的 API 用法。

---

本项目所有业务页面必须基于 `@df/toco-ui-vue` 组件库进行搭建，禁止直接使用 `element-plus` 中的基础组件单独实现表格和表单逻辑。

---

## 一、核心组件速查

| 场景      | 使用组件                      | 说明                          |
| --------- | ----------------------------- | ----------------------------- |
| 数据列表  | `ProTable`                    | 带搜索/分页/工具栏的高级表格  |
| 普通表单  | `ProForm`                     | 支持 valueType 的高级表单     |
| 弹窗表单  | `ModalForm` / `ActionButton`  | 弹出层表单，推荐 ActionButton |
| 抽屉表单  | `DrawerForm`                  | 侧边抽屉表单                  |
| 搜索筛选  | `QueryFilter`                 | 搜索表单组件                  |
| 按钮+弹窗 | `ActionButton`                | 集成刷新逻辑的操作按钮        |
| 对话框    | `ProDialog` / `ProFormDialog` | 对话框容器                    |
| 下拉选择  | `ProSelect`                   | 支持远程搜索的选择框          |
| 日期选择  | `ProDatePicker`               | 日期/时间选择器               |
| 标签输入  | `ProInputTag`                 | 标签输入组件                  |
| 穿梭框    | `ProTransfer`                 | 穿梭框组件                    |

---

## 二、标准列表页结构（最常用）

绝大多数业务页面是「带搜索的数据表格」，使用以下模板：

### 2.1 基础列表页模板

```vue
<template>
  <ProTable
    row-key="id"
    :columns="columns"
    :request="fetchTableData"
    :toolbar="toolbar"
  />
</template>

<script lang="ts" setup>
import { h } from 'vue'
import type { ProColumns, ProTableToolbarProps } from '@df/toco-ui-vue'
import ProTable, { ActionButton } from '@df/toco-ui-vue'

// ① 定义行数据类型
interface RowVO {
  id: number
  name: string
  status: number
  // ...其他字段
}

// ② 定义列配置
const columns: ProColumns<RowVO> = [
  {
    type: 'seq', // 内置序号列
    width: 60,
    align: 'center',
  },
  {
    label: '名称',
    prop: 'name',
  },
  {
    label: '状态',
    prop: 'status',
    valueType: 'select', // 使用下拉选择
    proFieldProps: {
      fieldProps: {
        options: [
          { label: '启用', value: 1 },
          { label: '停用', value: 0 },
        ],
      },
    },
  },
  {
    label: '操作',
    valueType: 'option',
    fixed: 'right',
    width: 160,
    actions: [
      {
        buttonProps: { label: '编辑', type: 'primary', link: true },
        dialogProps: addDialog, // 编辑弹窗配置
        request: (data) => handleEdit(data), // 提交接口
      },
      {
        buttonProps: { label: '删除', type: 'danger', link: true },
        popconfirmProps: {
          title: '确认删除？',
          onConfirm: (data) => handleDelete(data),
        },
      },
    ],
  },
]

// ③ 弹窗表单配置（新增/编辑共用，编辑时 rowData 自动作为初始值传入）
const addDialog = {
  title: '新增数据',
  width: '600px',
  formProps: {
    labelWidth: '100',
    columns: [
      { label: '名称', name: 'name', required: true },
      {
        label: '状态',
        name: 'status',
        valueType: 'select',
        proFieldProps: {
          fieldProps: {
            options: [
              { label: '启用', value: 1 },
              { label: '停用', value: 0 },
            ],
          },
        },
      },
    ],
  },
}

// ④ 工具栏配置
const toolbar: ProTableToolbarProps<RowVO> = {
  title: '列表标题',
  filtersCustom: ({ searchForm, onSearch }) => {
    // 搜索区自定义控件（输入框等）
    return h(ElInput, {
      modelValue: searchForm.name,
      'onUpdate:modelValue': (v: string) => {
        searchForm.name = v
      },
      placeholder: '请输入名称',
      onKeydown: (e: KeyboardEvent) => {
        if (e.key === 'Enter') onSearch()
      },
    })
  },
  buttonsCustom: () => {
    // 操作按钮（新增等）
    return h(ActionButton<RowVO>, {
      buttonProps: { type: 'primary', label: '新增' },
      dialogProps: addDialog,
      request: (data) => handleAdd(data),
    })
  },
}

// ④ 请求数据方法
async function fetchTableData(params: Record<string, any>) {
  const res = await YourApi.getList(params)
  return {
    data: res.data.list,
    total: res.data.total,
  }
}
</script>
```

### 2.2 request 返回格式规范

`request` 函数必须返回以下格式：

```ts
// 有分页
return {
  code: 200,
  data: {
    result: T[],    // 列表数据
    total: number // 总数量
  }
}

// 无分页（数组直接返回）
return {
  code: 200,
  data: T[],
}
```

---

## 三、弹窗表单规范（ActionButton + ProFormDialog）

操作列的按钮，如「新增」「编辑」，统一使用 `ActionButton` 组件，**不要**单独使用 `ElButton` + `ElDialog` 实现。

### 3.1 ActionButton 配置

```ts
import type { ActionButtonProps } from '@df/toco-ui-vue'

// 新增按钮配置示例
const addButtonConfig: ActionButtonProps<RowVO> = {
  buttonProps: {
    type: 'primary',
    label: '新增',
  },
  dialogProps: {
    title: '新增数据',
    width: '600px',
    // 表单字段配置
    columns: [
      {
        label: '名称',
        prop: 'name',
        required: true,
        valueType: 'text',
      },
      {
        label: '状态',
        prop: 'status',
        valueType: 'select',
        proFieldProps: {
          fieldProps: {
            options: [
              { label: '启用', value: 1 },
              { label: '停用', value: 0 },
            ],
          },
        },
      },
    ],
  },
  // 提交接口，完成后自动刷新表格
  request: async (formData) => {
    await YourApi.add(formData)
  },
}
```

### 3.2 编辑按钮配置（在 columns.actions 中使用）

```ts
// columns 操作列中的编辑按钮
actions: [
  {
    buttonProps: (rowData) => ({
      label: '编辑',
      type: 'primary',
      link: true,
    }),
    dialogProps: {
      title: '编辑数据',
      columns: [...], // 表单字段配置，同新增
    },
    // rowData 会自动作为表单初始值传入
    request: async (formData) => {
      await YourApi.update(formData)
    },
  },
]
```

---

## 四、valueType 类型参考

`valueType` 用于 `ProForm` 和 `ProTable columns` 中，控制渲染哪种表单控件：

| valueType       | 控件         | 说明             |
| --------------- | ------------ | ---------------- |
| `text`          | 文本输入框   | 默认值           |
| `textarea`      | 多行文本框   | -                |
| `select`        | 下拉选择     | 需配置 options   |
| `radio`         | 单选按钮     | 需配置 options   |
| `checkbox`      | 复选框       | 需配置 options   |
| `date`          | 日期选择     | -                |
| `dateTime`      | 日期时间选择 | -                |
| `dateRange`     | 日期范围     | -                |
| `dateTimeRange` | 日期时间范围 | -                |
| `number`        | 数字输入框   | -                |
| `price`         | 金额输入框   | 内置千分位格式化 |
| `option`        | 操作列       | 用于操作按钮列   |

---

## 五、编辑表格（内联编辑）

当表格需要直接在行内编辑时，使用 `editable` 配置：

```vue
<template>
  <ProTable
    row-key="id"
    :columns="editColumns"
    :editable="{
      type: 'cell', // single / multiple / cell / only
    }"
    ref="tableRef"
  />
</template>

<script lang="ts" setup>
import type { ProBaseTableInstance } from '@df/toco-ui-vue'

const tableRef = ref<ProBaseTableInstance<RowVO>>()

// 保存数据
async function handleSave() {
  const valid = await tableRef.value?.validate()
  if (!valid) return
  const data = tableRef.value?.getFormData()
  // 调用接口保存 data
}
</script>
```

---

## 六、常见问题与规范

### ✅ DO（应该做）

- `rowKey` 必须配置，且对应字段值在列表中唯一（通常是 `id`）
- `columns` 的 `prop` 字段名与接口返回的字段名保持一致
- 操作按钮统一使用 `ActionButton` 或 `columns.actions`
- 请求接口统一在 `request` 函数中处理，不要在外部单独发请求再 `setData`
- 需要手动控制数据时，配合 `data` + `onDataChange` 使用
- 多参考 examples 文件夹下的案例

### ❌ DON'T（不应该做）

- 不要直接使用 `ElTable` 实现列表，统一使用 `ProTable`
- 不要直接使用 `ElDialog` + `ElForm` 实现弹窗表单，使用 `ActionButton` 或 `ModalForm`
- 如果按钮操作会改变表格数据，不要使用 `ElButton` 作为操作列按钮，使用 `columns.actions` 配置
- 不在 `columns` 中的 `render` 函数里写复杂逻辑，应抽成独立函数

---

## 七、分页配置

```ts
// 隐藏分页
pagination={false}

// 自定义分页位置和每页数量
:pagination="{
  pageSizes: [10, 20, 50, 100],
  pageSize: 20,
  position: ['bottomRight'],
  onChange: (currentPage, pageSize) => {
    console.log(currentPage, pageSize)
  }
}"
```

---

## 八、表格实例方法

通过 `ref` 获取表格实例，可调用以下常用方法：

```ts
const tableRef = ref<ProBaseTableInstance<RowVO>>()

tableRef.value?.refresh() // 刷新表格（清空页码）
tableRef.value?.onSearch({ name }) // 带参数搜索（清空页码）
tableRef.value?.onCurrentSearch() // 搜索（保留页码）
tableRef.value?.getSelectionRows() // 获取多选行数据
tableRef.value?.setData(list, true) // 覆盖表格数据
tableRef.value?.setCurrentRow(row) // 设置当前选中行
```
