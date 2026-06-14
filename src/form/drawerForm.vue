<template>
  <component :is="triggerDom" v-if="triggerDom" @click="onOpen" />
  <slot v-else name="trigger" @click="onOpen"></slot>
  <el-drawer destroy-on-close v-bind="mergeDrawerProps" v-model="dialogVisible">
    <template #header>
      <div>{{ title }}</div>
    </template>
    <ProForm ref="formRef" v-bind="formProps" :submitter="formSubmitter">
      <slot></slot>
    </ProForm>
    <template #footer>
      <FormFooter v-bind="dialogSubmitter" :onSubmit="onSubmit" :onReset="onCancel" />
    </template>
  </el-drawer>
</template>
<script lang="ts" setup>
import { computed, reactive, ref, toRefs } from 'vue'
import { ElDrawer } from 'element-plus'
import ProForm from './form.vue'
import FormFooter from './footer'
import type { DrawerFormProps } from './modalForm.types'
import type { SubmitterProps } from './form.types'
const formSubmitter: SubmitterProps = {
  submitButtonProps: false,
  resetButtonProps: false,
}
// 记录：如果不设置 undefined，则默认为 false
const props = withDefaults(defineProps<DrawerFormProps>(), {
  open: undefined,
})
const { formProps, drawerProps, title, width, submitter } = toRefs(props)
const mergeDrawerProps = computed(() => {
  return {
    ...drawerProps.value,
    size: width.value || '40%',
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

defineOptions({
  name: 'DrawerForm',
})
</script>
