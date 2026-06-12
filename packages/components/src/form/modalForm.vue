<template>
  <component :is="triggerDom" v-if="triggerDom" @click="onOpen" />
  <slot v-else name="trigger" @click="onOpen"></slot>
  <el-dialog destroy-on-close v-bind="mergeModalProps" v-model="dialogVisible">
    <template #header>
      {{ title }}
    </template>
    <ProForm ref="formRef" v-bind="formProps" :submitter="formSubmitter">
      <slot></slot>
    </ProForm>
    <template #footer>
      <FormFooter v-bind="dialogSubmitter" :onSubmit="onSubmit" :onReset="onCancel" />
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { computed, reactive, ref, toRefs } from 'vue'
import { ElDialog } from 'element-plus'
import ProForm from './form.vue'
import FormFooter from './footer'
import type { ModalFormProps } from './modalForm.types'
import type { SubmitterProps } from './form.types'
const formSubmitter: SubmitterProps = {
  submitButtonProps: false,
  resetButtonProps: false,
}
// 记录：如果不设置 undefined，则默认为 false
const props = withDefaults(defineProps<ModalFormProps>(), {
  open: undefined,
})
const { formProps, modalProps, title, width, submitter } = toRefs(props)
const mergeModalProps = computed(() => {
  return {
    ...modalProps.value,
    width: width.value || '50%',
  }
})
const triggerDom = computed(() => {
  return props.trigger || null
})
// submitterButton
const submitButtonProps = reactive({
  loading: false,
})
// submitter
// TODO: i18n
const dialogSubmitter = computed(() => {
  return {
    searchConfig: {
      resetText: '取消',
      submitText: '确认',
    },
    submitButtonProps,
    ...submitter.value,
  }
})

// props 存在 open
const hasOpen = typeof props.open === 'boolean'
const emit = defineEmits<{
  'update:open': [value: boolean]
}>()
// 内部状态控制
const internalVisible = ref(false)
const dialogVisible = computed({
  get() {
    return hasOpen ? props.open : internalVisible.value
  },
  set(val) {
    if (hasOpen) {
      emit('update:open', val)
      // 兼容 antpro
      if (props.onOpenChange) {
        props.onOpenChange(val)
      }
    } else {
      internalVisible.value = val
    }
  },
})
const formRef = ref()
const onSubmit = () => {
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      if (props.onFinish) {
        const res = props.onFinish(formRef.value.getFormValues())
        if (res) {
          submitButtonProps.loading = true
          Promise.resolve(res).then((val) => {
            submitButtonProps.loading = false
            if (val) {
              onCancel()
            }
          })
        }
      }
    }
  })
}
const onOpen = () => {
  dialogVisible.value = true
}
const onCancel = () => {
  dialogVisible.value = false
}

defineExpose({
  formRef: formRef,
})

defineOptions({
  name: 'ModalForm',
})
</script>
