<template>
  <el-dialog
    class="pro-dialog"
    v-if="dialogVisible"
    v-bind="getProps"
    v-model="dialogVisible"
    :destroy-on-close="props.destroyOnClose"
    :append-to-body="true"
    :before-close="(doneFn: DoneFn) => onClose(doneFn)"
  >
    <div ref="scrollContainer" :class="setClass" :style="setMinHeight">
      <div ref="dialogContainerHeaderRef">
        <component :is="realHeaderVNode" ref="headerInstanceRef" />
      </div>
      <template v-if="props.inTableRolling">
        <template v-if="tableHeight">
          <component
            v-for="(vnode, index) in realVNode"
            :height="tableHeight"
            :key="index"
            :is="vnode"
            :ref="
              (el: any) => {
                if (Number(index) === 0) instanceRef = el
              }
            "
          />
        </template>
      </template>

      <template v-else>
        <component
          v-for="(vnode, index) in realVNode"
          :height="tableHeight"
          :key="index"
          :is="vnode"
          :ref="
            (el: any) => {
              if (Number(index) === 0) instanceRef = el
            }
          "
        />
      </template>

      <div ref="dialogContainerFooterRef">
        <slot name="dialog-footer"></slot>
      </div>
    </div>

    <template #footer v-if="footer">
      <div ref="dialogFooterRef" class="pro-dialog-footer" v-if="getFooter">
        <slot name="footer"></slot>
      </div>

      <div ref="dialogFooterRef" class="pro-dialog-footer" v-else>
        <el-button @click="() => onClose(() => {})">{{ props.cancelText }}</el-button>
        <el-button type="primary" :loading="loading" @click="onConfirm">
          {{ props.okText }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {
  computed,
  useSlots,
  useAttrs,
  ref,
  onMounted,
  nextTick,
  watch,
  Fragment,
  type VNode,
} from 'vue'
import { ElDialog, ElButton, ElMessageBox } from 'element-plus'
import type { DoneFn, hisDialogProps } from './dialog.types'

defineOptions({ name: 'HisDialog' })

const emits = defineEmits(['update:modelValue'])

const props = withDefaults(defineProps<hisDialogProps>(), {
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
  width: '1000',
  inTableRolling: false,
  okText: '确 定',
  cancelText: '取 消',
})
const slots = useSlots() as any
const attrs: any = useAttrs()
const loading = ref(false)

const scrollContainer = ref()
const tableHeight = ref<number | undefined>(undefined)

const dialogContainerHeaderRef = ref()
const dialogContainerFooterRef = ref()
const dialogFooterRef = ref()

const instanceRef = ref<any>(null)
const headerInstanceRef = ref<any>(null)

function findFirstComponentVNode(vnodes: any): any {
  if (!vnodes) return null
  if (!Array.isArray(vnodes)) vnodes = [vnodes]

  for (const vnode of vnodes) {
    if (!vnode) continue

    if (vnode.shapeFlag & 1) return vnode

    if (vnode.shapeFlag & 6) return vnode

    if (vnode.type === Fragment && vnode.children) {
      const found = findFirstComponentVNode(vnode.children)
      if (found) return found
    }

    if (Array.isArray(vnode.children)) {
      const found = findFirstComponentVNode(vnode.children)
      if (found) return found
    }
  }
  return null
}

const realVNode = computed<VNode>(() => {
  const vnodes = slots.default?.({
    height: tableHeight.value,
  }) as VNode
  return vnodes || []
})

const realHeaderVNode = computed<VNode>(() => {
  const vnodes = slots['dialog-header']?.() as VNode
  return vnodes ? findFirstComponentVNode(vnodes) : null
})

const getProps = computed(() => ({
  ...props,
  ...attrs,
  width: props.width || '1000px',
}))

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emits('update:modelValue', val),
})

const getFooter = computed<boolean>(() => {
  return slots.footer && slots.footer()?.length > 0
})

watch(
  () => dialogVisible.value,
  async (val) => {
    if (val) {
      if (attrs?.onOpen) await attrs.onOpen()
      await nextTick()
      onSetTableHeight()
    }
  },
  { immediate: true },
)

const onSetTableHeight = () => {
  const header = dialogContainerHeaderRef.value?.offsetHeight || 0
  const footer1 = dialogContainerFooterRef.value?.offsetHeight || 0
  const footer2 = dialogFooterRef.value?.offsetHeight || 0
  const border = scrollContainer.value ? getBorderNumber(scrollContainer.value) : 0

  if (props.fullscreen) {
    tableHeight.value = window.innerHeight - 48 - header - footer1 - footer2 - border
  } else {
    tableHeight.value = window.innerHeight - 92 - 48 - header - footer1 - footer2 - border - 12
  }
}

// header slot 状态检测（ProForm / ProTable）
function headerFormStatus() {
  const exposed = headerInstanceRef.value
  if (!exposed) return false

  // ProForm
  if (exposed.hasEditorStatus) {
    return exposed.hasEditorStatus()
  }

  // ProTable
  if (exposed.getFormRecord) {
    const data = exposed.getFormRecord()
    return data ? data.add?.length > 0 || data.edit?.length > 0 : false
  }

  return false
}

function defaultTableStatus() {
  const exposed = instanceRef.value
  const data = exposed?.getFormRecord?.()
  return data ? data.add?.length > 0 || data.edit?.length > 0 : false
}

function defaultFormStatus() {
  const exposed = instanceRef.value
  return exposed?.hasEditorStatus?.() ?? false
}

const getDefault = computed(() => {
  if (props.dialogType === 'tableFormDialog') return headerFormStatus() || defaultTableStatus()

  if (props.dialogType === 'tableDialog') return defaultTableStatus()

  if (props.dialogType === 'formDialog') return defaultFormStatus()

  return false
})

const setClass = computed(() => {
  if (props.type === 'tabDialog')
    return props.hasPadding ? 'tab-dialog' : 'tab-dialog tab-dialog-no-padding'
  if (props.type === 'formDialog') return 'form-dialog'
  return ''
})

const setMinHeight = computed(() => (props.minHeight ? { minHeight: `${props.minHeight}px` } : {}))

const onBeforeClose = async (fn: (doneFn?: DoneFn) => void) => {
  if (props?.hasEditStatus) {
    if (props?.hasEditStatus?.()) {
      closeMessage(fn)
      return
    } else {
      await fn?.()
      dialogVisible.value = false
      return
    }
  }

  if (getDefault.value) {
    closeMessage(fn)
    return
  }

  await fn?.()
  dialogVisible.value = false
}

const closeMessage = (fn?: (doneFn?: DoneFn) => void) => {
  ElMessageBox.confirm('信息未保存，是否放弃未保存的更改？').then(() => {
    fn?.()
    dialogVisible.value = false
  })
}

const onClose = (doneFn: DoneFn) => {
  if (props.beforeClose) onBeforeClose(() => props.beforeClose?.(doneFn))
  else onBeforeClose(() => () => doneFn())
}

const onConfirm = async () => {
  try {
    loading.value = true
    const res = await props.onSubmit?.()
    loading.value = false
    if (res) dialogVisible.value = false
  } catch {
    loading.value = false
  }
}

const getBorderNumber = (el: HTMLElement) => {
  const styles = getComputedStyle(el)
  const toNum = (px: string) => parseFloat(px) || 0

  return (
    toNum(styles.paddingTop) +
    toNum(styles.paddingBottom) +
    toNum(styles.marginTop) +
    toNum(styles.marginBottom)
  )
}

onMounted(() => {
  tableHeight.value = undefined
})

defineExpose({
  onBeforeClose,
  closeMessage,
})
</script>
