<script lang="ts" setup generic="OriginT extends ProComponentObject">
import {
  computed,
  nextTick,
  ref,
  onMounted,
  provide,
  useSlots,
  watch,
  type VNode,
  useAttrs,
} from 'vue'
import type { ProComponentObject, ProComponentAny } from '../common.types'
import { getValue } from '../utils/value'
import Pipeline from '../utils/pipeline'
import { isUndefined } from '../utils'
import ProBaseTable from './baseTable.vue'
import ProEditTable from './editTable.vue'
import { useColumns } from './useColumn'
import { InternalKey } from './variable'
import type {
  ProTableRowSelectionProps,
  ProColumn,
  VueRawSlots,
  ProBaseTableInstance,
} from './table.types'
import type { ProTableInstance, ProUnifyTableProviderProps, ProTableProps } from './proTable.types'
import type { ProTableEditInstance, ProTableEditProviderProps } from './proTableEdit.types'

type T = OriginT & {
  [InternalKey]?: string
}
defineOptions({
  name: 'ProTable',
  inheritAttrs: false,
})
const props = withDefaults(defineProps<ProTableProps<T>>(), {
  pagination: undefined,
  toolbar: undefined,
  manualRequest: undefined,
  recordCreatorProps: undefined,
  recordCreatorDisabled: false,
  round: true,
  refreshClearChecked: true,
  edit: false,
  editable: false,
})
const attrs = useAttrs()
const mergeProps = computed(() => ({ ...props, ...attrs }))
// 编辑的配置
const editable = computed(() => {
  const editableProps = props.editable || props.edit
  if (editableProps === false) {
    return false
  }
  return true
})
const baseTableRef = ref<ProBaseTableInstance<T>>()
const editTableRef = ref<ProTableEditInstance<T>>()
// expose
const exposeTable = ref<ProTableInstance<T>>({} as ProTableInstance<T>)
const columnOperateParams = {
  actions: {},
}
const excludeKeys = ['getRealDataHasKey', 'tableBodyRef']
const syncExpose = () => {
  const instance = editable.value ? editTableRef : baseTableRef
  // 清空旧的方法
  Object.keys(exposeTable.value).forEach(
    (key) => delete exposeTable.value[key as keyof ProTableInstance<T>],
  )
  if (instance.value) {
    // 遍历子组件实例的方法
    const arr = Object.entries(instance.value) as Array<
      [keyof ProTableInstance<T>, ProComponentAny]
    >
    // console.log('=arr=', arr)
    arr.forEach(([key, value]) => {
      if (!excludeKeys.includes(key)) {
        exposeTable.value[key] = value
      }
    })
    columnOperateParams.actions = instance.value.actions
  }
  // console.log('=instance=', instance.value?.actions)
}
onMounted(() => {
  syncExpose()
})
// editable 变化时同步
watch(editable, async () => {
  await nextTick() // 等待组件切换完成
  syncExpose()
})
defineExpose(exposeTable.value)
// root 获取到 columns
const slots = useSlots() as ProComponentAny
const columns = computed(() => {
  const list = slots.default?.({}) || []
  const operateSlot = slots['column-operating']?.(columnOperateParams) || []
  if (operateSlot.length > 0) {
    list.push(operateSlot[0])
  }
  // 没有配置 columns，但传入了 slot
  const columnProps = list
    .filter((vnode: VNode) => {
      const type: ProComponentAny = vnode.type || {}
      // 只筛选出 ProColumn 组件
      if (typeof type === 'object' && type.name === 'ProColumn') {
        return true
      }
      return false
    })
    .map((vnode: VNode) => {
      const vprops = vnode.props || {}
      const children = vnode.children
      if (typeof children === 'object' && children !== null && 'default' in children) {
        const slots = children as VueRawSlots
        const defaultSlot = slots.default
        if (typeof defaultSlot === 'function') {
          if (vprops.valueType === 'option') {
            vprops.cellRenderer = defaultSlot
          } else {
            vprops.render = defaultSlot
          }
        }
      }
      return vprops as ProColumn<T>
    })
  return (props.columns || []).concat(columnProps)
})
const rowSelectionType = computed(() => {
  const rowSelection = props.rowSelection || ({} as ProTableRowSelectionProps<T>)
  const { type } = rowSelection
  return type
})
// 获取 row 的唯一Key
const getRowKey = computed(() => {
  const rowKey = props.rowKey || InternalKey
  return (record: T) => {
    const res = getValue(record, rowKey)
    if (!isUndefined(res)) {
      return res
    }
    return getValue(record, InternalKey)
  }
})
// key 的递增
const internalIndex = {
  value: 0,
}
const pipeline = new Pipeline()
const columnContext = {
  getRowKey,
  pipeline,
  rowSelectionType: rowSelectionType.value,
}
// columns 需要在最外层生成，方便 edit 包裹
const tableColumns = useColumns<T>(columns, columnContext)
provide<ProUnifyTableProviderProps<T>>('ProUnifyTableData', {
  getRowKey,
  internalIndex,
  pipeline,
})
// editableConfig 默认 undefined，防止外部嵌套导致类型错误
const defaultEditMode = computed(() => false)
const defaultEditableConfig = computed(() => undefined)
provide<Partial<ProTableEditProviderProps<T>>>('ProEditTableData', {
  editMode: defaultEditMode,
  editableConfig: defaultEditableConfig,
})

provide(
  'exposeTable',
  computed(() => exposeTable.value),
)
</script>
<template>
  <!-- @vue-generic {T} -->
  <ProEditTable ref="editTableRef" v-bind="mergeProps" :columns="tableColumns" v-if="editable">
    <!-- @ts-ignore 忽略 key 的类型提示 -->
    <template v-for="(_, key) in slots" v-slot:[key]="scope">
      <!-- @ts-ignore 忽略 key 的类型提示 -->
      <slot :name="key" v-bind="scope" />
    </template>
  </ProEditTable>
  <!-- @vue-generic {T} -->
  <ProBaseTable ref="baseTableRef" v-bind="mergeProps" :columns="tableColumns" v-else>
    <!-- @ts-ignore 忽略 key 的类型提示 -->
    <template v-for="(_, key) in slots" v-slot:[key]="scope">
      <!-- @ts-ignore 忽略 key 的类型提示 -->
      <slot :name="key" v-bind="scope" />
    </template>
  </ProBaseTable>
</template>
