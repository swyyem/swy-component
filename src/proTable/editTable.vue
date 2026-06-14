<script lang="ts" setup generic="T extends ProComponentObject">
/**
 * 编辑时，table 数据和 form 数据同步说明
 * tableData 和 from 数据同步
 * tableData 是 shallow 的数组，但对象和 form 是绑定的
 * form 的类型是Record<string, T>，而不是 T
 */
import {
  computed,
  ref,
  provide,
  inject,
  type ComputedRef,
  type Ref,
  onMounted,
  onUnmounted,
  toRef,
  toRaw,
  useSlots,
  useAttrs,
  watch,
} from 'vue'
import { ElButton, type FormValidateFailure } from 'element-plus'
import { throttle } from 'lodash-unified'
import { isUndefined } from '../utils'
import { useRefFromArray } from '../utils/hooks'
import { importMethod } from './utils/tools'
import {
  omit,
  removeInternalKey,
  getListFromForm,
  clearInvalidField,
  isEmpty,
  getEditColumnsKey,
  findFirstMatchedKV,
  findColumnIndex,
  getEditColumns,
} from './utils'
import { handleEnter, setColumnInstance } from './utils/editableRowByKey'
import ChainEventBus from '../tool/eventBus'
import { ProForm } from '../index'
import ProBaseTable from './baseTable.vue'
import { InternalAddPrefix } from './variable'
import { useEditable } from './useEditable'
import AddIcon from './icons/add.vue'
import type { ProComponentObject, ProComponentAny } from '../common.types'
import type { ProFormInstance } from '../form/form.types'
import type {
  KeyType,
  ProBaseTableProps,
  ProBaseTableInstance,
  ProTableFormValidateType,
  ProTableEditProps,
  ProColumn,
  ProRecordDataType,
  ProTableFormInvalidFieldsType,
  ProColumns,
} from './table.types'
import type { ProUnifyTableProviderProps } from './proTable.types'
import type { ProTableEditInstance, ProTableEditProviderProps } from './proTableEdit.types'

defineOptions({
  name: 'ProTable',
  inheritAttrs: false,
})
const props = withDefaults(defineProps<ProBaseTableProps<T>>(), {
  recordCreatorProps: undefined,
  recordCreatorDisabled: false,
  pagination: undefined,
  toolbar: undefined,
  manualRequest: undefined,
  edit: false,
  editable: false,
  waterfall: false,
  currentChangeRepeat: false,
})

const { onLoad, onDataChange, ...restProps } = props
const attrs = useAttrs()
const mergeProps = computed(() => ({ ...restProps, ...attrs }))

// const emit = defineEmits<ProTableEmits>()
const slots = useSlots() as ProComponentAny

const ProUnifyTableData = inject<ProUnifyTableProviderProps<T>>('ProUnifyTableData')!
// 表格 form 的类型
type TableFormType = Record<string, T>
const formRef = ref<ProFormInstance<TableFormType>>()
const ProFormProps = computed(() => {
  return props.formProps || {}
})
const columns = toRef(props, 'columns') as Ref<ProColumns<T>>
// key 的递增
const internalIndex = ProUnifyTableData.internalIndex

/*
 * 第一次回调，使用在编辑场景的默认新增一行
 * 情况1，传入了 request 请求，等数据返回后调用
 * 情况2，没有传入 request，使用 data | dataSource，等 setTableData 后调用
 * 情况3，既没有 request，也没有 data | dataSource，需要初始化后调用
 * 使用 baseTable 的 onFirstData 处理
 **/
const firstAddRef = ref(true)
const addRecord = () => {
  if (editableConfig.value?.defaultRow && editMode.value) {
    return Promise.resolve().then(() => {
      // console.log('=create=', Date.now())
      onCreate(new MouseEvent('click', { bubbles: true }))
    })
  }
  return Promise.reject()
}
const handleFirstCallback = () => {
  if (firstAddRef.value) {
    addRecord().then(() => {
      firstAddRef.value = false
    })
  }
}

const editableConfig = computed(() => {
  const editableProps = props.editable || props.edit
  if (editableProps === false) {
    return undefined
  }
  let res = { type: 'single' } as ProTableEditProps<T>
  // string 的场景
  if (typeof editableProps === 'string') {
    res.type = editableProps
  } else {
    res = editableProps as ProTableEditProps<T>
  }
  if (isUndefined(res.defaultRow)) {
    res.defaultRow = true
  }
  if (isUndefined(res.keyboard)) {
    res.keyboard = true
  }
  // 编辑模式默认就是 edit
  if (isUndefined(res.mode)) {
    res.mode = 'edit'
  } else {
    // 不是 read 就只能是 edit
    res.mode = res.mode !== 'read' ? 'edit' : 'read'
  }
  return res
})
const editMode = computed(() => editableConfig.value?.mode === 'edit')
watch(editMode, (newEditMode) => {
  if (newEditMode) {
    // 切换到编辑新增一行
    addRecord()
  } else {
    // 切换到只读，删除该行
    if (editableConfig.value?.defaultRow) {
      const data = baseTableRef.value?.getRealDataHasKey() || []
      dataRef.value = data
    }
  }
})
const baseTableRef = ref<ProBaseTableInstance<T>>()
const dataRef = ref(props.dataSource || props.defaultData || props.data || []) as Ref<T[]>

watch(
  () => props.data,
  (val) => {
    dataRef.value = val ?? []
  },
)

const handleDataChange = (v: T[]) => {
  // 如果不等于才赋值
  if (toRaw(dataRef.value) !== toRaw(v)) {
    dataRef.value = v
  }
  onDataChange?.(v) // 手动透传
}
const handleLoad = (v: T[]) => {
  onLoad?.(v)
}
// 获取 row 的唯一Key
const getRowKey = ProUnifyTableData.getRowKey
const formData = useRefFromArray<T, TableFormType>(dataRef, getRowKey)
// 获取对应的控件实例
const getFormInstanceByKey = (key: string, rowData: T) => {
  const instances = formRef.value?.getFormInstances() || []
  const prefix = getRowKey.value(rowData) as string
  const fullKey = `${prefix}.${key}`
  const matchIns = instances.find((item: ProComponentAny) => item.key === fullKey)
  if (matchIns) {
    return matchIns.getInstance() || matchIns.instance
  }
  return null
}
const setScrollTop = (rowIndex: number, columnIndex?: number) => {
  return baseTableRef.value?.setScrollTop(rowIndex, columnIndex)
}
const getRealTableDataHasKey = () => baseTableRef.value?.getRealDataHasKey() || []
// 编辑的 cell 的标记
const editingCell = ref<string>()
// 编辑的 row 的标记
const editingRowKeys = ref<KeyType[]>([])
// 编辑的记录
const editRecords = ref([]) as Ref<T[]>
// 删除的记录
const removeRecords = ref([]) as Ref<T[]>
type SetInvalidControlType = (invalidFields: ProTableFormInvalidFieldsType) => void
// cell 场景下校验不通过的控件提示
const setInvalidControl: SetInvalidControlType = (invalidFields) => {
  const tableData = toRaw(dataRef.value)
  // 有校验的 column 不一定设置了 required
  const requiredColumns = getEditColumns<T>(columns.value)
  // 找出排在前面的 row
  const firstRow = findFirstMatchedKV<T>(invalidFields, tableData, (item: T) => {
    return getRowKey.value(item) as string
  })
  if (firstRow.match) {
    const firstRowKey = getRowKey.value(firstRow.match) as string
    const firstColumn = findFirstMatchedKV<ProColumn<T>>(
      invalidFields[firstRowKey],
      requiredColumns,
      (item: ProColumn<T>) => {
        return item.dataKey!
      },
    )
    // 定位进入编辑态
    if (firstColumn.match) {
      const columnKey = firstColumn.match.dataKey
      const columnIndex = findColumnIndex(columns.value, columnKey)
      editingCell.value = columnKey
      editingRowKeys.value = [firstRowKey]
      setScrollTop(firstRow.index, columnIndex)
    }
  }
}
type HandleMethod = (() => void) | undefined
type HandleBoolMethod = ((v: KeyboardEvent) => void) | undefined
// 给 pipeline 追加参数
ProUnifyTableData.pipeline.add((params) => {
  let editing = false
  const type = editableConfig.value?.type
  const mode = editableConfig.value?.mode
  let onClick: HandleMethod = undefined
  let onDoubleClick: HandleMethod = undefined
  let onBlur: HandleMethod = undefined
  let onKeyDownEnter: HandleBoolMethod = undefined
  const rowKeyValue = params.rowKeyValue
  const columnKey = params.columnKey
  const proColumn = params.proColumn
  // 如果是行编辑模式
  if (type === 'single' || type === 'multiple') {
    editing = editingRowKeys.value.includes(rowKeyValue)
  } else if (type === 'cell') {
    // 单元格编辑
    editing = editingRowKeys.value.includes(rowKeyValue) && editingCell.value === columnKey
    if (editableConfig.value?.cellProps?.mode === 'doubleClick') {
      onDoubleClick = () => {
        editingCell.value = columnKey
        editingRowKeys.value = [rowKeyValue]
      }
    } else {
      onClick = () => {
        editingCell.value = columnKey
        editingRowKeys.value = [rowKeyValue]
      }
    }
    onBlur = () => {
      // blur 事件有延迟，当点击了其他 cell 时，则不需要清空
      if (editingCell.value !== columnKey || !editingRowKeys.value.includes(rowKeyValue)) {
        return
      }
      // TODO: 触发onchange
      editingRowKeys.value = editingRowKeys.value.filter((key) => key !== rowKeyValue)
      editingCell.value = undefined
    }
  } else if (type === 'only') {
    editing = true
  }
  // 如果editableConfig 配置了 mode = 'read'，则都为只读
  if (mode === 'read') {
    editing = false
  } else {
    // 如果当前列配置了 mode='read'，则表示当前列不能编辑
    if (proColumn.mode === 'read') {
      editing = false
    }
  }
  if (editing && editableConfig.value?.keyboard) {
    onKeyDownEnter = () => {
      // 内部已经处理了 enter 键的判断
      handleEnter({
        columns: columns.value, // 需要传入完整的 column
        editContext: editingContext,
        rowData: params.rowData,
        currentColumn: proColumn,
      })
    }
  }
  return {
    onClick,
    onDoubleClick,
    onBlur,
    editing,
    'onKeydown:enter': onKeyDownEnter,
  }
})
const editingContext = {
  childrenColumnName: 'children',
  rowKey: props.rowKey,
  formRef: formRef,
  editable: editableConfig,
  editingCell,
  editingRowKeys,
  getRowKey,
  removeRecords,
  editRecords,
  internalIndex: internalIndex,
  getFormInstanceByKey: getFormInstanceByKey,
  onCreate: (e: MouseEvent) => onCreate(e),
  setColumnFocus: (rowData: T) => {
    handleEnter({
      columns: columns.value,
      editContext: editingContext,
      rowData,
      hasEnter: false,
    })
  },
  setInvalidControl,
  setScrollTop,
  getData: () => {
    return baseTableRef.value?.getDataHasKey() || []
  },
  setData: (newValue: T[]) => {
    baseTableRef.value?.setTableData(newValue, true)
  },
}
// editableConfig 设置 keyboardEmptyColumns
const KeyboardEmptyColumnKeys: ComputedRef<string[]> = computed<string[]>(() => {
  const keyboardEmptyColumns = editableConfig.value?.keyboardEmptyColumns
  if (keyboardEmptyColumns) {
    return keyboardEmptyColumns
  }
  return getEditColumnsKey(columns.value)
})

/** 编辑态场景 */
const editorImpl = useEditable<T>(editingContext)
const lastColumns = computed(() => {
  return editorImpl.transformEditableColumns(columns.value)
})
// 新增一行
const createButtonProps = computed(() => {
  if (props.recordCreatorProps === false) {
    return {}
  }
  return omit(props.recordCreatorProps || {}, [
    'placement',
    'position',
    'creatorButtonText',
    'onClick',
  ])
})
const creatorButtonText = computed(() => {
  if (props.recordCreatorProps === false) {
    return undefined
  }
  return props.recordCreatorProps?.creatorButtonText || '新增一行'
})

const onCreate = (e: MouseEvent) => {
  // 禁止添加
  if (props.recordCreatorDisabled) {
    return
  }
  if (props.recordCreatorProps && props.recordCreatorProps.onClick) {
    props.recordCreatorProps.onClick(e, {
      add: (data: T) => editorImpl.operateMethods.add(data),
    })
  } else {
    editorImpl.operateMethods.add()
  }
}

// 事件总线
const editEventBus = new ChainEventBus()
// 设置编辑行
const setEditRecord = (record: T, columnKey: KeyType) => {
  const idVal = getRowKey.value(record)
  editEventBus.emit(`change:${columnKey as string}`)
  const isAdd = typeof idVal === 'string' && idVal.startsWith(InternalAddPrefix)
  if (isAdd) {
    return
  }
  const existIndex = editRecords.value.findIndex((item) => {
    const itemKey = getRowKey.value(item)
    return idVal === itemKey
  })
  if (existIndex === -1) {
    editRecords.value.push(record)
  }
}

provide<ProTableEditProviderProps<T>>('ProEditTableData', {
  setEditRecord: setEditRecord,
  editingCell,
  editingRowKeys,
  editMode,
  editableConfig,
  editEventBus,
})
type FormValuesType = Record<KeyType, T>
// 获取表单中的增，改，删的数据
const getRecordSet = (): ProRecordDataType<T> => {
  const formDataValue = getRealTableDataHasKey()
  // 新增的数据带入了 InternalAddPrefix
  const addSet = formDataValue.filter((item: T) => {
    const idVal = getRowKey.value(item)
    return typeof idVal === 'string' && idVal.startsWith(InternalAddPrefix)
  })
  // 删除的数据
  return {
    add: getListFromForm<T>(
      addSet as T[],
      formRef.value?.getFormFullValues() as FormValuesType,
      getRowKey.value,
    ),
    edit: getListFromForm<T>(
      editRecords.value as T[],
      formRef.value?.getFormFullValues() as FormValuesType,
      getRowKey.value,
    ),
    remove: removeInternalKey(removeRecords.value) as T[],
  }
}
// expose
const currentExpose = ref<ProTableEditInstance<T>>({
  validate: (cb?: ProTableFormValidateType) => {
    let realResult = false
    const validPromise = formRef.value?.validate(
      (_isValid: boolean, invalidFields?: FormValidateFailure['fields']) => {
        // 移除空行的校验
        const dataList = baseTableRef.value?.getDataHasKey() || []
        const res = clearInvalidField<T>({
          invalidFields,
          list: dataList,
          rowKey: props.rowKey,
          getRowKey: getRowKey.value,
          emptyColumns: KeyboardEmptyColumnKeys.value,
          includeEmpty: !editableConfig.value?.defaultRow,
        })
        // 空则认为校验通过
        realResult = isEmpty(res.invalidFields)
        if (!realResult) {
          setInvalidControl(res.invalidFields)
        }
        cb?.(realResult, res.invalidFields)
      },
    ) as ReturnType<ProFormInstance<T>['validate']>
    // 移除空行后的结果
    return validPromise.then(() => realResult)
  },
  resetForm: (data: T[]) => {
    baseTableRef.value?.setTableData(data, true)
  },
  getFormData: () => {
    if (formRef.value) {
      // form 的值都会同步到 tableData 中，直接返回 tableData 即可，如果form 中存在非 column 字段，则需要使用 getFormFullValues
      return getListFromForm<T>(
        getRealTableDataHasKey(),
        formRef.value?.getFormFullValues(),
        getRowKey.value,
      )
    }
    return []
  },
  getFormRecord: () => {
    return getRecordSet()
  },
  getFormInstances: () => {
    return formRef.value?.getFormInstances() || []
  },
  getFormInstanceByKey: getFormInstanceByKey,
  actions: {
    add: editorImpl.operateMethods.add,
    delete: editorImpl.operateMethods.delete,
    exportMethod: () => Promise.resolve(),
    importMethod: importMethod,
  },
  setColumnPosition: (row: T, columnKey: string) => {
    setColumnInstance<T>(row, columnKey, editingContext, columns.value)
  },
} as ProTableEditInstance<T>)
const excludeKeys = ['getRealDataHasKey', 'tableBodyRef', 'actions', 'onFirstData']

onMounted(() => {
  if (baseTableRef.value) {
    // 遍历子组件实例的方法
    const arr = Object.entries(baseTableRef.value) as Array<
      [keyof ProTableEditInstance<T>, ProComponentAny]
    >
    arr.forEach(([key, value]) => {
      // 如果是刷新，需要清空编辑的记录
      if (key === 'refresh') {
        currentExpose.value.refresh = (clear?: boolean) => {
          removeRecords.value = []
          editRecords.value = []
          return value(clear)
        }
      } else if (!excludeKeys.includes(key)) {
        currentExpose.value[key] = value
      }
    })
    // baseTable actions 合并过去
    Object.assign(currentExpose.value.actions, baseTableRef.value.actions)
    // console.log('=currentExpose=', currentExpose.value)
  }
})
defineExpose<ProTableEditInstance<T>>(currentExpose.value)
const handleWheel = throttle(() => {
  // 鼠标引起的滚动需要隐藏空间的下拉区域
  const tableWrap = baseTableRef.value?.tableBodyRef.value?.querySelector('.el-scrollbar__wrap')
  const activeElement = document.activeElement
  if (activeElement && tableWrap && tableWrap.contains(activeElement)) {
    // console.log('=select=', document.activeElement)
    ;(activeElement as HTMLElement).blur()
  }
}, 200)
onMounted(() => {
  const tableWrap = baseTableRef.value?.tableBodyRef.value?.querySelector('.el-scrollbar__wrap')
  if (tableWrap) {
    tableWrap.addEventListener('wheel', handleWheel)
  }
})
onUnmounted(() => {
  const tableWrap = baseTableRef.value?.tableBodyRef.value?.querySelector('.el-scrollbar__wrap')
  if (tableWrap) {
    tableWrap.removeEventListener('wheel', handleWheel)
  }
  editEventBus.offAll()
})
</script>

<template>
  <!-- @vue-generic {TableFormType} -->
  <ProForm
    v-model="formData"
    :omit-nil="false"
    v-bind="ProFormProps"
    ref="formRef"
    :submitter="false"
    :grid="false"
    :keyboard="false"
    class="pro-table-form"
    fieldErrorType="tip"
  >
    <!-- @vue-generic {T} -->
    <ProBaseTable
      ref="baseTableRef"
      v-bind="mergeProps"
      :columns="lastColumns"
      :data="dataRef"
      @data-change="handleDataChange"
      @load="handleLoad"
      @firstData="handleFirstCallback"
    >
      <template v-for="(_, key) in slots" v-slot:[key]="scope">
        <slot :name="key" v-bind="scope" />
      </template>
      <template #body-bottom>
        <div v-if="props.recordCreatorProps !== false && editMode" class="pro-table--operate">
          <ElButton type="primary" class="add-btn" v-bind="createButtonProps" @click="onCreate">
            <span class="add-btn__icon"> <AddIcon /> </span>{{ creatorButtonText }}
          </ElButton>
        </div>
      </template>
    </ProBaseTable>
  </ProForm>
</template>
<style lang="less">
.pro-table-form {
  display: contents;
}

.pro-table--operate {
  position: relative;
  top: -1px;
  height: 32px;
  border: 1px solid var(--pro-table-border-color);
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;

  .add-btn {
    width: 100%;
    background-color: transparent;
    color: var(--pro-table-add-color);
    border: 0;
    border-top: 0;

    &__icon {
      margin-right: 4px;
    }
  }
}
</style>
