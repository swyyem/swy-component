# ProTable 使用示例

> 以下示例均来自 `src/stories/table/` 目录下的真实代码，使用 `@df/toco-ui-vue` 组件库。

---

## 通用数据结构（common.ts）

所有示例共用的行数据类型和列配置：

```ts
export type RowVO = {
  id: number
  name: string
  age: number
  birth: string
  selected: boolean
  region: string
  enableFlag: boolean
  children?: RowVO[]
  hasChildren?: boolean
}

// 基础列配置
export const columns = [
  { label: '序号', type: 'index', width: '50' },
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄', width: 100 },
  { prop: 'birth', label: '出生日期', width: 160 },
  {
    prop: 'selected',
    label: '勾选',
    valueType: 'checkbox',
    width: 80,
    proFieldProps: { fieldProps: { multiple: false } },
  },
  {
    prop: 'region',
    label: '籍贯',
    width: 100,
    valueType: 'selectEnhance',
    proFieldProps: {
      fieldProps: {
        valueEnum: [
          { label: '浙江', value: '1' },
          { label: '江西', value: '2' },
          { label: '江苏', value: '3' },
        ],
      },
    },
  },
]

// 多级表头列配置
export const multipleColumns = [
  { label: '序号', type: 'seq', width: '50' },
  {
    label: '多级信息',
    align: 'center',
    children: [
      {
        label: '二级信息',
        align: 'center',
        children: [
          { prop: 'name', label: '姓名' },
          { prop: 'age', label: '年龄', width: 100 },
        ],
      },
      {
        label: '二级信息22',
        align: 'center',
        children: [
          { prop: 'birth', label: '出生日期', width: 160 },
          { prop: 'selected', label: '勾选', valueType: 'checkbox', width: 80 },
        ],
      },
    ],
  },
]

// 模拟请求
export const getTableData = async (params: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          count: 52,
          result: list,   // RowVO[]
        },
      })
    }, 2000)
  })
}
```

---

## 示例一：基础用法（base.tsx）

带搜索过滤、新增按钮、操作列（编辑 + 启停用）的标准列表。

```tsx
import { ref } from 'vue'
import { ElInput, type ButtonType } from 'element-plus'
import ProTable, {
  ActionButton,
  type ProTableInstance,
  type ProColumns,
  type ProTableToolbarProps,
} from '@df/toco-ui-vue'

// 操作列：根据行数据动态返回按钮属性
const getButtonProps = (row?: RowVO) => {
  const type: ButtonType = row?.enableFlag ? 'danger' : 'primary'
  return { type, link: true, label: row?.enableFlag ? '停用' : '启用' }
}
const getPopconfirmProps = (row?: RowVO) => ({
  title: `确定要${row?.enableFlag ? '停用' : '启动'}吗？`,
  onConfirm: (data: RowVO) => {
    if (data) data.enableFlag = !row?.enableFlag
  },
})

// 弹窗表单配置
const formDialog = {
  title: '这是一个 FormDialog',
  width: '70%',
  formProps: {
    labelWidth: '100',
    columns: [
      { label: '姓名', name: 'name', required: true },
      { label: '年龄', name: 'age' },
    ],
  },
}

// 列配置（在 columns 基础上追加操作列）
const baseColumns: ProColumns<RowVO> = [
  ...columns,
  {
    label: '操作',
    valueType: 'option',
    width: 80,
    actions: [
      {
        buttonProps: { label: '编辑', type: 'primary', link: true },
        dialogProps: formDialog,
        request: (data: RowVO) => {
          console.log(data, 'request')
        },
      },
      {
        buttonProps: getButtonProps,
        popconfirmProps: getPopconfirmProps,
      },
    ],
  },
]

// 搜索区
const filterBase: ProTableToolbarProps<RowVO>['filtersCustom'] = ({ searchForm, onSearch }) => {
  return (
    <ElInput
      modelValue={searchForm.text}
      onUpdate:modelValue={(v: string) => { searchForm.text = v }}
      placeholder="请输入文本"
      onKeydown={(e: KeyboardEvent) => { if (e.key === 'Enter') onSearch() }}
    />
  )
}

// 新增按钮
const customBase = () => (
  <ActionButton<RowVO>
    buttonProps={{ type: 'primary', label: '新增' }}
    dialogProps={formDialog}
    request={(data?: RowVO) => { console.log(data, 'request') }}
  />
)

// 渲染
const tableRef = ref<ProTableInstance<RowVO>>()
;<div style="height: 500px">
  <ProTable<RowVO>
    ref={tableRef}
    rowKey="id"
    request={getTableData}
    columns={baseColumns}
    toolbar={{
      title: '基础表单',
      filtersCustom: filterBase,
      buttonsCustom: customBase,
    }}
  />
</div>
```

---

## 示例二：数据控制（data.tsx）

通过 `data` prop 外部传入数据，配合 `onDataChange` 同步表格内部变化。

```tsx
import { ref } from 'vue'
import { ElButton } from 'element-plus'
import ProTable, { type ProTableInstance } from '@df/toco-ui-vue'

const list = generateData(5, 40)
const outerData = ref(list)

// 追加数据
const changeData = () => {
  outerData.value = list.concat(generateData(5, 50))
}

// 同步表格内部数据变化（如排序、编辑等导致的数据变化）
const handleLoad = (v: RowVO[]) => {
  outerData.value = v
}

;<div style="height: 500px">
  <ProTable<RowVO>
    rowKey="id"
    columns={columns}
    toolbar={{
      title: '数据',
      buttonsCustom: () => (
        <ElButton type="primary" onClick={changeData}>
          追加数据
        </ElButton>
      ),
    }}
    data={outerData.value}
    onDataChange={handleLoad}
  />
</div>
```

---

## 示例三：交互事件（event.tsx）

单击行选中（`firstRowSelected` + `onCurrentChange`）和右键菜单（`menuConfig` + `onMenuClick`）。

```tsx
import { ref } from 'vue'
import { ElButton } from 'element-plus'
import ProTable, {
  type ProTableInstance,
  type ProTableMenuVisibleParams,
  type ProTableMenuClickParams,
} from '@df/toco-ui-vue'

// 右键菜单配置
const menuConfig = {
  className: 'menu-test',
  visibleMethod: (params: ProTableMenuVisibleParams<RowVO>) => {
    console.log('=params=', params)
    return true
  },
  body: {
    options: [
      { label: '测试1', value: 'one', disabled: true },
      { label: '测试2', value: 'two', visible: false },
      {
        label: '测试3',
        value: 'three',
        children: [
          { label: '子菜单1', value: 'child-one' },
          { label: '子菜单2', value: 'child-two' },
        ],
      },
    ],
  },
  header: {
    options: [{ label: '头部', value: 'three' }],
  },
}

const tableRef = ref<ProTableInstance<RowVO>>()

// 外部控制选中行
const handleSelected = () => {
  const data = tableRef.value?.getData()
  if (data) tableRef.value?.setCurrentRow(data[2])
}

;<div style="height: 500px">
  <ProTable<RowVO>
    ref={tableRef}
    rowKey="id"
    columns={columns}
    request={getTableData}
    toolbar={{
      title: '交互事件',
      buttonsCustom: () => (
        <ElButton type="primary" onClick={handleSelected}>
          选中第三行
        </ElButton>
      ),
    }}
    firstRowSelected={true}
    onCurrentChange={(current: RowVO | null, prev: RowVO) => {
      console.log('current-change', current, prev)
    }}
    menuConfig={menuConfig}
    onMenuClick={(params: ProTableMenuClickParams<RowVO>) => {
      console.log('menu-click', params)
    }}
  />
</div>
```

---

## 示例四：展开行（expand.tsx）

通过 `expandable` 控制展开状态，通过 `expand` slot 自定义展开行内容（支持内嵌子表格）。

```tsx
import { ref, reactive } from 'vue'
import { ElButton } from 'element-plus'
import ProTable, {
  type ProTableInstance,
  type ProTableExpandableProps,
} from '@df/toco-ui-vue'

const expandableConfig: ProTableExpandableProps<RowVO> = reactive({
  expandedRowKeys: [11],  // 默认展开的行 key
  onExpandedRowsChange: (keys, rows) => {
    console.log('=onExpandedRowsChange rows=', rows)
    expandableConfig.expandedRowKeys = keys  // 受控：同步展开状态
  },
})

// 外部控制展开哪些行
const changeExpand = () => {
  expandableConfig.expandedRowKeys = [12, 13]
}

// 展开行内容：自定义显示，支持内嵌 ProTable
const custom = (res: any) => {
  const { row } = res
  return (
    <div style={{ padding: '10px' }}>
      <p>是否选中: {row.selected ? '是' : '否'}</p>
      <h3>子表格</h3>
      <ProTable
        rowKey="chargeItemId"
        defaultData={generateData(3, 100)}
        columns={expandColumns}
        toolbar={false}
        pagination={false}
        autoHeight={true}
      />
    </div>
  )
}

const tableRef = ref<ProTableInstance<RowVO>>()
;<div style="height: 500px">
  <ProTable<RowVO>
    ref={tableRef}
    rowKey="id"
    columns={columns}
    request={getTableData}
    toolbar={{ title: '展开行' }}
    expandable={expandableConfig}
    v-slots={{
      expand: custom,
      'toolbar-buttons': () => (
        <ElButton type="primary" onClick={changeExpand}>
          控制 expand
        </ElButton>
      ),
    }}
  />
</div>
```

---

## 示例五：布局（layout.tsx）

控制表格高度、样式类名、分页等布局相关配置。

```tsx
import ProTable from '@df/toco-ui-vue'

;<div style="height: 500px">
  <ProTable<RowVO>
    rowKey="id"
    columns={columns}
    request={getTableData}
    toolbar={{ title: '布局' }}
    // 外层容器类名
    containerClass="test-table--containerClass"
    tableClassName="test-table--tableClassName"
    bodyClassName="test-table--bodyClassName"
    bodyMainClassName="test-table--bodyMainClassName"
    // 高度配置
    autoHeight={false}
    height={300}        // 固定高度（包含表头和分页）
    maxHeight={400}     // 最大高度，autoHeight=true 时生效
    sameMaxHeight={true} // height 和 maxHeight 保持一致
    round={true}         // 圆角
    // 分页
    pagination={{ pageSize: 20 }}
  />
</div>
```

---

## 示例六：多级表头（multiple.tsx）

在 `columns` 中嵌套 `children` 实现多级表头。

```tsx
import ProTable from '@df/toco-ui-vue'

// 多级表头列配置（见 common.ts 中的 multipleColumns）
const multipleColumns = [
  { label: '序号', type: 'seq', width: '50' },
  {
    label: '多级信息',
    align: 'center',
    children: [
      {
        label: '二级信息',
        align: 'center',
        children: [
          { prop: 'name', label: '姓名' },
          { prop: 'age', label: '年龄', width: 100 },
        ],
      },
      {
        label: '二级信息22',
        align: 'center',
        children: [
          { prop: 'birth', label: '出生日期', width: 160 },
          { prop: 'selected', label: '勾选', valueType: 'checkbox', width: 80 },
        ],
      },
    ],
  },
]

;<div style="height: 500px">
  <ProTable<RowVO>
    rowKey="id"
    columns={multipleColumns}
    request={getTableData}
    toolbar={{ title: '多级表头' }}
  />
</div>
```

---

## 示例七：多选（selection.tsx）

通过 `rowSelection` 配置多选，支持受控模式（`selectedRowKeys`）、禁用特定行（`selectable`）。

```tsx
import { ref, reactive } from 'vue'
import { ElButton } from 'element-plus'
import ProTable, {
  type ProTableInstance,
  type ProTableRowSelectionProps,
} from '@df/toco-ui-vue'

const rowSelection = reactive<ProTableRowSelectionProps<RowVO>>({
  type: 'checkbox',
  repel: false,           // 互斥（只能选一个）
  checkStrictly: false,   // 树形表格下父子是否关联
  selectedRowKeys: [12],  // 受控：初始默认选中
  selectable: (row) => row.id !== 10,  // id=10 的行禁止选中
  onChange: (rowKeys, rows) => {
    console.log('=rowKeys=', rowKeys, rows)
  },
})

// 外部控制选中状态
const clearSelection = () => { rowSelection.selectedRowKeys = [] }
const changeSelection = () => { rowSelection.selectedRowKeys = [12, 13] }

const tableRef = ref<ProTableInstance<RowVO>>()
;<div>
  <div style="margin: 8px auto">
    <ElButton type="primary" onClick={clearSelection}>清除 selection</ElButton>
    <ElButton type="primary" onClick={changeSelection}>控制 selection</ElButton>
  </div>
  <div style="height: 500px">
    <ProTable<RowVO>
      ref={tableRef}
      rowKey="id"
      columns={columns}
      request={getTableData}
      toolbar={{ title: '多选' }}
      rowSelection={rowSelection}
    />
  </div>
</div>
```

---

## 示例八：左右插槽（side.tsx）

通过 `table-side` slot 在表格右侧嵌套一张子表格，实现左右联动布局。

```tsx
import { ref } from 'vue'
import { ElButton } from 'element-plus'
import ProTable, { type ProTableInstance } from '@df/toco-ui-vue'

const tableRef = ref<ProTableInstance<RowVO>>()
const childTableRef = ref<ProTableInstance<RowVO>>()

const handleSetData = () => {
  childTableRef.value?.setData(generateData(20))
  tableRef.value?.resize()  // 子表格数据变化后，重新计算左侧表格高度
}

const pagination = { pageSize: 10, layout: 'total, prev, next, jumper, sizes' }

;<div style="height: 500px">
  <ProTable<RowVO>
    ref={tableRef}
    rowKey="id"
    columns={columns}
    request={getTableData}
    toolbar={{ title: '左右布局' }}
    pagination={pagination}
    v-slots={{
      'toolbar-buttons': () => (
        <ElButton type="primary" onClick={handleSetData}>
          插槽表格数据修改
        </ElButton>
      ),
      // 右侧插槽 table-side：嵌套子表格
      'table-side': () => (
        <div class="base-table--side">
          <ProTable
            ref={childTableRef}
            rowKey="id"
            request={getTableData}
            columns={childColumns}
            toolbar={false}
            pagination={pagination}
          />
        </div>
      ),
    }}
  />
</div>
```

---

## 示例九：编辑表格（edit.tsx）

通过 `editable` 开启可编辑表格，支持 cell / single / multiple / only 四种模式。  
通过实例方法 `validate`、`getFormData`、`getFormRecord` 获取和校验数据。

```tsx
import { ref, reactive } from 'vue'
import { ElButton, ElPopconfirm } from 'element-plus'
import ProTable, {
  type ProTableInstance,
  type ProTableEditProps,
  type ProColumns,
} from '@df/toco-ui-vue'

const tableEditorRef = ref<ProTableInstance<RowVO>>()

const editableConfig = reactive<ProTableEditProps<RowVO>>({
  type: 'cell',         // cell：单元格点击编辑
  mode: 'edit',         // 'read' 切换到只读模式
  defaultRow: false,    // 是否默认新增一行
  // keyboard: true,    // 开启键盘 enter 跳格
  // keyboardNextCell: 'campusId',     // 回车进入到下一行的目标列
  // keyboardFirstCell: 'age',          // 指定定位一行的第一个 cell
  // keyboardColumns: ['name', 'age'], // 自定义 enter 顺序
})

// 切换只读/编辑
const handleMode = () => {
  editableConfig.mode = editableConfig.mode === 'read' ? 'edit' : 'read'
}

// 校验
const handleValidate = () => {
  tableEditorRef.value?.validate()?.then((v) => console.log('validate result:', v))
}

// 获取数据
const handleData = () => {
  // 编辑后的完整数据
  console.log('getFormData:', tableEditorRef.value?.getFormData())
  // 变更记录：{ add: [], edit: [], remove: [] }，未改动的行不返回
  console.log('getFormRecord:', tableEditorRef.value?.getFormRecord())
  // 多选选中行
  console.log('getSelectionRows:', tableEditorRef.value?.getSelectionRows())
}

// cell 模式下必须自行配置操作列
const editorColumns: ProColumns<RowVO> = [
  ...columns,
  {
    title: '操作',
    width: '80',
    valueType: 'option',
    fixed: 'right',
    render(rowData) {
      return (
        <ElPopconfirm
          title="确定要删除吗"
          onConfirm={() => tableEditorRef.value?.actions.delete(rowData)}
        >
          {{
            reference: () => <ElButton link type="danger">删除</ElButton>,
          }}
        </ElPopconfirm>
      )
    },
  },
]

;<div>
  <div style="margin: 8px auto">
    <ElButton type="primary" onClick={handleMode}>
      切换{editableConfig.mode === 'read' ? '编辑' : '只读'}
    </ElButton>
    <ElButton type="primary" onClick={handleValidate}>表格验证</ElButton>
    <ElButton type="primary" onClick={handleData}>获取表格数据</ElButton>
  </div>
  <div style="height: 500px">
    <ProTable<RowVO>
      ref={tableEditorRef}
      rowKey="id"
      columns={editorColumns}
      request={getTableData}
      toolbar={{ title: '编辑表格' }}
      editable={editableConfig}
    />
  </div>
</div>
```

---

## 示例十：树形表格（tree.tsx）

支持静态 `children` 和懒加载（`lazy` + `load`）两种方式，可配合多选使用。

```tsx
import { ref } from 'vue'
import ProTable, {
  type ProTableInstance,
  type ProTableExpandableProps,
  type ProTableRowSelectionProps,
} from '@df/toco-ui-vue'

// 懒加载子级数据
const load = (row: RowVO, treeNode: unknown, resolve: (data: RowVO[]) => void) => {
  setTimeout(() => {
    resolve(generateData(2))  // 异步返回子级数据
  }, 1000)
}

const expandableConfig: ProTableExpandableProps<RowVO> = {
  onExpandedRowsChange: (keys, rows) => {
    console.log('=onExpandedRowsChange rows=', rows)
    expandableConfig.expandedRowKeys = keys  // 受控：同步展开状态
  },
}

const rowSelection: ProTableRowSelectionProps<RowVO> = {
  type: 'checkbox',
  checkStrictly: false,  // false：父子联动选中，true：父子独立
  onChange: (rowKeys, rows) => {
    console.log('=rowKeys=', rowKeys, rows)
  },
}

// request 返回的数据中，有 children 字段的行自动渲染为树形
// hasChildren: true 的行会显示展开箭头，点击时触发 load
const getTreeData = async (params: any) => {
  const list = generateData(params.size, 10)
  list[0].children = generateData(5)           // 静态子级
  list[0].children[0].children = generateData(3)
  list[1].hasChildren = true                   // 懒加载子级
  return { data: { count: 351, result: list } }
}

const tableRef = ref<ProTableInstance<RowVO>>()
;<div style="height: 500px">
  <ProTable<RowVO>
    ref={tableRef}
    rowKey="id"
    columns={columns}
    request={getTreeData}
    toolbar={{ title: '树形表格' }}
    lazy={true}
    load={load}
    treeProps={{ children: 'children', hasChildren: 'hasChildren' }}
    rowSelection={rowSelection}
    expandable={expandableConfig}
  />
</div>
```
