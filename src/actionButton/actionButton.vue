<template>
  <template v-if="internalSlots['button']">
    <slot name="button" />
  </template>

  <template v-else-if="getButtonProps && getButtonProps?.slot?.button">
    <SlotRenderer :fn="getButtonProps?.slot?.button" :slotProps="{ open, visible }" />
  </template>

  <template v-else>
    <el-button v-if="isShowDialog" @click="open" v-bind="getButtonProps">
      {{ getButtonProps?.label }}
    </el-button>

    <el-popconfirm v-else-if="getPopconfirmProps" v-bind="lastPopconfirmProps" @confirm="onConfirm">
      <template #reference>
        <el-button v-bind="getButtonProps">
          {{ getButtonProps?.label }}
        </el-button>
      </template>
    </el-popconfirm>

    <el-button v-else @click="onConfirm" v-bind="getButtonProps">
      {{ getButtonProps?.label }}
    </el-button>
  </template>

  <template v-if="isShowDialog">
    <!-- @vue-generic {T} -->
    <ProFormDialog ref="FormDialogRef" v-model="visible" v-bind="getFormDialogProps">
      <template
        v-for="(slotFn, slotName) in mergedSlots"
        :key="slotName"
        v-slot:[slotName]="slotProps"
      >
        <slot v-if="internalSlots[slotName]" :name="slotName" v-bind="slotProps" />

        <SlotRenderer v-else :fn="slotFn" :slotProps="slotProps" />
      </template>
    </ProFormDialog>
  </template>
</template>

<script setup lang="ts" generic="T extends ProComponentObject">
import { ElButton, ElPopconfirm } from 'element-plus'
import { omit } from 'lodash-unified'
import type { ProComponentObject } from '../common.types'
import { ProFormDialog } from '../index'
import { ref, computed, inject, useSlots, defineComponent, type Ref, type VNode } from 'vue'
import type { ActionButtonProps, ActionInnerPopconfirmProps } from './actionButton.types'
import type { ProTableInstance } from '../index'

defineOptions({ name: 'ActionButton' })
const SlotRenderer = defineComponent({
  name: 'SlotRenderer',
  props: {
    fn: { type: Function as unknown as () => (p?: any) => VNode | VNode[], required: true },
    slotProps: { type: Object as () => Record<string, any>, default: () => ({}) },
  },
  setup(props) {
    return () => {
      try {
        return props.fn(props.slotProps)
      } catch (e) {
        console.error('SlotRenderer render error:', e)
        return null
      }
    }
  },
})

const props = withDefaults(defineProps<ActionButtonProps<T>>(), {})
const exposeTable = inject<Ref<ProTableInstance<T>>>('exposeTable', {} as Ref<ProTableInstance<T>>)
const internalSlots = useSlots() as Record<string, any>
const FormDialogRef = ref()
const visible = ref(false)

const getPopconfirmProps = computed(() => {
  const source =
    typeof props.popconfirmProps === 'function'
      ? props.popconfirmProps(rowData.value)
      : props.popconfirmProps
  return source
})
// 去除 onConfirm
const lastPopconfirmProps = computed(() => {
  const excluded: Array<keyof ActionInnerPopconfirmProps<T>> = ['onConfirm']
  return omit(getPopconfirmProps.value || {}, excluded)
})

const rowData = computed(() => props.rowData || ({} as T))
const getButtonProps = computed(() => {
  return typeof props.buttonProps === 'function'
    ? props.buttonProps(rowData.value)
    : props.buttonProps
})

const isShowDialog = computed(() => {
  return Object.keys(props?.dialogProps ?? {}).length > 0
})
const getFormDialogProps = computed(() => {
  return {
    ...props.dialogProps,
    rowData: rowData.value,
    dialogInitialData: props.dialogInitialData,
    beforeRequest: props.beforeRequest,
    afterRequest: props.afterRequest,
    request: props.request,
  }
})

const open = () => (visible.value = true)

const runPipeline = async (qto: T) => {
  const qt = props.beforeRequest ? await props.beforeRequest(qto) : qto
  const result = props.request ? await props.request(qt) : undefined
  if (props.afterRequest) {
    await props.afterRequest(result)
  } else {
    exposeTable?.value?.refresh(true)
  }
}

const onConfirm = async () => {
  const qto = rowData.value
  if (getPopconfirmProps.value?.onConfirm) {
    await getPopconfirmProps.value.onConfirm(qto)
    return
  }
  await runPipeline(qto)
}

const getFormRef = () => FormDialogRef.value?.ProFormRef

defineExpose({
  visible,
  FormDialogRef,
  getFormRef,
})

const mergedSlots = computed(() => {
  const map: Record<string, any> = {}

  if (internalSlots) {
    Object.keys(internalSlots).forEach((k) => {
      map[k] = internalSlots[k]
    })
  }
  if (getFormDialogProps.value?.slot) {
    Object.entries(getFormDialogProps.value?.slot).forEach(([name, fn]) => {
      map[name] = fn
    })
  }

  return map
})
</script>

<style scoped></style>
