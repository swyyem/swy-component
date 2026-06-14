<template>
  <ProDialog
    ref="ProDialogRef"
    v-bind="props"
    type="formDialog"
    v-model="dialogVisible"
    :close-on-click-modal="false"
    :before-close="onClose"
    @submit="onSubmit"
  >
    <template #dialog-header v-if="slots['dialog-header']">
      <slot name="dialog-header"></slot>
    </template>
    <!-- @vue-generic {T} -->
    <ProForm
      ref="ProFormRef"
      :colon="true"
      :submitter="false"
      :inline="false"
      :gutter="0"
      v-bind="proFormProps"
      :initialValues="initialValues"
      @finish="handleSubmit"
    ></ProForm>

    <template #dialog-footer v-if="slots['dialog-footer']">
      <slot name="dialog-footer"></slot>
    </template>
    <template #footer v-if="slots['footer']">
      <slot name="footer"></slot>
    </template>
  </ProDialog>
</template>

<script setup lang="ts" generic="T extends ProComponentObject">
import { ref, useSlots, inject, type Ref, watch, computed } from 'vue'
import ProDialog from './dialog.vue'
import { ProForm, type ProTableInstance, type ProFormInstance } from '../index.ts'
import type { ProComponentObject } from '../common.types'
import type { FormDialogType } from './dialog.types.ts'

const emits = defineEmits(['update:modelValue', 'refresh'])

defineOptions({
  name: 'useDialog',
})

const props = withDefaults(defineProps<FormDialogType<T>>(), {
  modelValue: false,
  type: 'dialog',
  footer: true,
  hasPadding: true,
  destroyOnClose: true,
  dialogType: 'formDialog',
  draggable: true,
  modal: true,
  showClose: true,
  appendTo: 'body',
  closeOnClickModal: false,
  closeOnPressEscape: true,
  lockScroll: true,
  openDelay: 0,
  closeDelay: 0,
  headerAriaLevel: '2',
  title: '',
  ariaLevel: '2',
  width: '1000',
  inTableRolling: false,
  okText: '确 定',
  cancelText: '取 消',
})

const proFormProps = computed(() => {
  return props.formProps || {}
})

const exposeTable = inject<Ref<ProTableInstance<T>>>('exposeTable', {} as Ref<ProTableInstance<T>>)

const slots = useSlots() as any

const ProDialogRef = ref()
const ProFormRef = ref<ProFormInstance<T>>()

const dialogVisible = ref(props.modelValue)

const getRowData = async () => {
  const { dialogInitialData, rowData } = props
  return dialogInitialData ? await dialogInitialData(rowData) : rowData
}

const runPipeline = async (qto: T) => {
  const qt = props.beforeRequest ? await props.beforeRequest(qto) : qto
  const result = props.request ? await props.request(qt) : undefined
  if (props.afterRequest) {
    await props.afterRequest(result)
  } else {
    if (exposeTable.value) {
      exposeTable.value?.refresh(true)
    }
  }
}

const handleSubmit = async (value: T) => {
  try {
    if (props.onFormSubmit) {
      await props.onFormSubmit(value)
    } else {
      await runPipeline(value)
    }
    emits('update:modelValue', false)
  } catch (error) {
    console.log(error)
  }
}
const initialValues = ref(props.rowData) as Ref<T>
watch(
  () => props.modelValue,
  async (val) => {
    // 弹窗显示时获取数据
    if (val) {
      const row = await getRowData()
      if (row) {
        initialValues.value = row
      }
    }
    dialogVisible.value = val
  },
)

const onClose = () => {
  ProFormRef.value?.setFormValues({} as T, true)
  ProFormRef.value?.resetFields()
  emits('update:modelValue', false)
}

const onSubmit = async () => {
  return await ProFormRef.value?.submit()
}

defineExpose({
  ProFormRef,
  ProDialogRef,
})
</script>

<style scoped></style>
