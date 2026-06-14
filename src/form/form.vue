<template>
  <div :class="['form__title--style', props.formTitleClass]" v-if="props.formTitle">
    {{ props.formTitle }}
  </div>
  <el-form ref="formRef" v-bind="ElFormProps" :model="formData" @submit.prevent>
    <template v-if="props.columns">
      <template v-if="props.searchForm">
        <slot name="search"></slot>
      </template>
      <template v-else>
        <ElRow v-if="realGrid" :gutter="props.gutter">
          <!-- @vue-generic {T} -->
          <FormFields :columns="getColumns" :inline="props.inline"></FormFields>
        </ElRow>
        <!-- @vue-generic {T} -->
        <FormFields v-else :columns="getColumns" :inline="props.inline"></FormFields>
      </template>
    </template>
    <template v-else>
      <div v-if="realGrid" :style="{ ...setColLimit }">
        <slot></slot>
      </div>
      <slot v-else></slot>
    </template>
    <FormFooter
      v-if="props.submitter !== false"
      v-bind="formSubmitter"
      :inline="props.inline"
      :onSubmit="onSubmit"
      :onReset="onReset"
    />
  </el-form>
</template>
<script lang="ts" setup generic="T extends ProComponentObject">
import type { ProComponentObject } from '../common.types'
import type { ProFormInstance, ProFormProps, ProFormEmits, FiledForm } from './form.types'
import type { FormValidateCallback, FormValidationResult, FormInstance } from 'element-plus'
import { ElForm, ElRow } from 'element-plus'
import { computed, provide, reactive, ref, toRaw, watch, onMounted, useAttrs } from 'vue'
import FormStore from './formStore'
import FormFooter from './footer'
import FormFields from './formFields.vue'
import { disposeDataByEmpty, omitProps, getPureData, getRealColumnKeys } from './utils'
import { isEqual } from 'lodash-unified'
import { removeInternalKey } from '../proTable/utils/index'

defineOptions({
  name: 'ProForm',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<ProFormProps<T>>(), {
  initialValues: () => ({}) as T,
  grid: undefined,
  params: () => ({}),
  keyboard: true,
  omitNil: true,
  autoFocusFirstInput: false,
  showMessage: true,
  validateOnRuleChange: true,
  gutter: 20,
  colLimit: 1,
  submitter: undefined,
  colon: undefined,
  initEffect: false,
  fieldErrorType: 'icon',
  formatValue: (v: T) => v,
  inline: false,
})
const realGrid = computed(() => {
  // inline 模式下， grid 必须为 false
  if (props.inline === true) {
    return false
  }
  // 如果用户手动传了 grid (boolean)，直接返回
  if (typeof props.grid === 'boolean') {
    return props.grid
  }
  return true
})
const emit = defineEmits<ProFormEmits<T>>()

const ElFormProps = computed(() => {
  type Props = typeof props
  const excluded: (keyof Props)[] = [
    'modelValue',
    'initialValues',
    'params',
    'mode',
    'omitNil',
    'autoFocusFirstInput',
    'rules',
    'submitter',
    'request',
    'initEffect',
    'colon',
    'colLimit',
    'gutter',
    'columns',
    'formTitle',
    'formTitleClass',
    'grid',
    'searchForm',
    'fieldErrorType',
    'emptyText',
    'searchBtn',
    'formatValue',
    'keyboard',
    'keyboardColumnKeys',
  ]
  return Object.assign(omitProps(props, excluded), useAttrs() || {})
})

const setColLimit = computed(() => {
  return {
    display: 'grid',
    gridTemplateColumns: `repeat(${props.colLimit}, 1fr)`,
    columnGap: `${props.gutter}px`,
  }
})
// 传入 modelValue 标记受控模式，不支持
const isControlled = props.modelValue !== undefined
const initData = getPureData(toRaw(props.initialValues), props.omitNil)
const firstData = isControlled ? props.modelValue : initData
const formStore = new FormStore<T>(firstData, props.rules, props.mode, props.keyboard)
const formData = formStore.getValues()
// 外部的 modelValue 变化需要使用 Object.assign
watch(
  () => props.modelValue,
  (changedModelValue) => {
    // console.log('=changedModelValue=', changedModelValue)
    if (changedModelValue && changedModelValue !== formData) {
      // 浅比较后再深比较一次
      if (!isEqual(toRaw(changedModelValue), toRaw(formData))) {
        formStore.setSyncValues(changedModelValue)
      }
    }
  },
)
// 记录第一次的值
const realInitialValues = ref(getPureData(firstData))
// 初始值可以改变，部分场景需要
watch(
  () => props.initialValues,
  (changedValues) => {
    const copyData = getPureData(changedValues, props.omitNil)
    realInitialValues.value = getPureData(copyData)
    // 未使用 modelValue
    if (formStore && !isControlled) {
      formStore.setValues(copyData)
    }
  },
)
const effectFirst = ref(true)
// 监听表单数据变化
watch(
  formData,
  (newValue, oldValue) => {
    // console.log('=formData=', formData)
    const cleanNewValue = toRaw(newValue) as T
    emit('valuesChange', cleanNewValue, toRaw(oldValue) as T)
    if (isControlled) {
      emit('update:modelValue', cleanNewValue)
    }
    // props.onValuesChange?.(toRaw(newValue), toRaw(oldValue))
    // 表单在 initEffect 的场景记录一次 初始值
    if (props.initEffect && effectFirst.value) {
      realInitialValues.value = getPureData(cleanNewValue, props.omitNil)
      effectFirst.value = false
    }
  },
  { deep: true },
)

const getGroupLabel = {
  labelPosition: props.labelPosition,
  labelWidth: props.labelWidth,
  inline: props.inline,
  labelSuffix: props.labelSuffix,
  colon: props.colon,
  emptyText: props.emptyText,
  fieldErrorType: props.fieldErrorType,
  initEffect: props.initEffect,
  grid: realGrid.value,
}

provide('formStore', formStore)
provide('proformPosition', getGroupLabel)

const keyboardColumnKeys = computed(() => {
  if (!props.keyboard) {
    return []
  }
  if (props.keyboardColumnKeys) {
    return props.keyboardColumnKeys
  }
  // 优先取 columns 的 name
  if (props.columns) {
    return getRealColumnKeys(props.columns)
  }
  const allInstances = formStore.getInstancesRef()
  return allInstances.value.map((v) => v.key)
})

const onKeydownEnter = (key: string) => {
  if (!props.keyboard) {
    return
  }
  const instances = formStore.getInstances()
  // 根据当前的 key 找到下一个 key
  const nextIndex = keyboardColumnKeys.value.findIndex((v) => v === key) + 1

  if (nextIndex > 0 && nextIndex < keyboardColumnKeys.value.length) {
    const nextKey = keyboardColumnKeys.value[nextIndex]
    // console.log('=nextKey=', nextKey, keyboardColumnKeys.value)
    const ins = instances.find((v) => v.key === nextKey)
    console.log('=ins=', instances, ins?.getInstance())
    ins?.getInstance()?.focus?.()
  }
}
const formInjectEvents = computed(() => {
  return props.keyboard
    ? {
        onKeydownEnter,
      }
    : {}
})
provide('formEvents', formInjectEvents.value)

const onRequest = () => {
  if (props.request) {
    props
      .request(props.params || {})
      .then((res) => {
        formStore.setValues(res)
      })
      .catch((error) => {
        console.error('获取表单数据失败:', error)
      })
  }
}

const getColumns = computed(() => {
  if (!props.columns) return []

  const { colLimit, inline } = props

  // 非网格布局时的处理
  if (!realGrid.value) {
    return inline
      ? props.columns.map((col) => ({
          ...col,
          colProps: { ...(col.colProps || {}), isCol: false },
        }))
      : props.columns
  }

  // 网格布局时的处理
  return props.columns.map((col) => ({
    ...col,
    colProps: {
      ...(col.colProps || {}),
      span: col.colProps?.span || (colLimit ? Math.floor(24 / colLimit) : undefined),
    },
  }))
})

const getValueTypeTableKey = computed(() => {
  return (
    props.columns
      ?.filter((v: FiledForm) => v.valueType === 'table')
      ?.map((v: FiledForm) => v.name || v.prop) || []
  )
})

const getFormLogicValues = () => {
  const keys = getValueTypeTableKey.value
  if (keys.length > 0) {
    const logicValues = toRaw(formStore?.getLogicValues()) || {}
    keys.forEach((key: string) => {
      if (key in logicValues) {
        logicValues[key] = removeInternalKey(logicValues[key])
      }
    })
    return logicValues
  }
  return props.formatValue(toRaw(formStore?.getLogicValues()))
}

const getFormInstances = (key?: string) => {
  if (key) {
    return formStore.getInstances()?.filter((item) => item.key === key)
  }
  return formStore.getInstances()
}

// 抛出对象
const currentInstance = {
  getFormFullValues: () => props.formatValue(formStore?.getNormalValues()),
  getFormValues: () => getFormLogicValues(),
  setFormValues: (data: T, isCover?: boolean) => {
    formStore.setValues(props.omitNil ? disposeDataByEmpty(data) : data, isCover)
  },
  removeFormValues: (data: T) => {
    formStore.deleteValues(data)
  },
  validate: async (cb?: FormValidateCallback) => {
    if (getValueTypeTableKey.value?.length === 0) {
      return formRef.value?.validate(cb) as FormValidationResult
    }
    let realResult = false
    const validPromise = formRef.value?.validate(async (a, b) => {
      const val = await Promise.all(
        getValueTypeTableKey.value.map(async (key) => {
          const ins = getFormInstances(key)?.[0]
          return await ins?.instance?.validate()
        }),
      )
      const isVal = val.every((item) => item === true)
      realResult = isVal && a
      cb?.(realResult, b)
    }) as ReturnType<ProFormInstance<T>['validate']>
    return validPromise.then(() => realResult)
  },
  resetFields: () => {
    formRef.value?.resetFields()
  },
  submit: async (): Promise<any> => {
    return await onSubmit()
  },
  reset: (e: MouseEvent) => {
    onReset(e)
  },
  hasEditorStatus: () => {
    const status = isEqual(realInitialValues.value, formStore?.getNormalValues())
    // 相等就是没有编辑过
    return !status
  },
  getFormInstances: getFormInstances,
}
// 对外暴露方法
defineExpose<ProFormInstance<T>>(currentInstance)

onMounted(() => {
  // console.log('=mounted=', formStore)
  onRequest()
  // 触发 onInit
  emit('init', toRaw(formStore?.getValues()) as T, currentInstance)
  // props.onInit?.(toRaw(formStore?.getValues()), currentInstance)
  // if (props.autoFocusFirstInput) {
  //   const firstInput = formStore.getInstances()[0]
  //   if (firstInput) {
  //     // 先不处理
  //     // firstInput.instance.focus()
  //   }
  // }
})

watch(
  () => props.params,
  () => {
    onRequest()
  },
)

// 监听 mode 变化
watch(
  () => props.mode,
  (newMode) => {
    formStore.setMode(newMode)
  },
)
// submitterButton
const submitButtonProps = reactive({
  loading: false,
})
// submitter
const formSubmitter = computed(() => {
  return {
    submitButtonProps,
    ...(props.submitter || {}),
  }
})

// 收集所有表单控件实例
// const formFieldControls = reactive([]);

const formRef = ref<FormInstance>()
const onSubmit = async () => {
  emit('submit', getFormLogicValues())
  // props.onSubmit?.(getFormLogicValues())
  try {
    const val = await formRef.value?.validate()
    if (val) {
      // if (props.onFinish) {
      try {
        submitButtonProps.loading = true
        // await props.onFinish(getFormLogicValues())
        await emit('finish', getFormLogicValues())
        submitButtonProps.loading = false
        return Promise.resolve(true)
      } catch {
        submitButtonProps.loading = false
        return Promise.resolve(false)
      }
      // }
    } else {
      // props.onFinishFailed?.(getFormLogicValues())
      emit('finishFailed', getFormLogicValues())
    }
  } catch {
    return Promise.resolve(false)
  }
}

const onReset = (e: MouseEvent) => {
  formRef.value?.resetFields()
  // props.onReset?.(e)
  emit('reset', e)
}
</script>

<style lang="less" scoped>
.operation {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 18px;
}

.form__title--style {
  color: #1d1e1f;
  font-weight: bold;
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  font-size: 16px;

  &::before {
    content: '';
    display: inline-block;
    width: 3px;
    height: 16px;
    background-color: var(--el-color-primary);
    margin-right: 4px;
  }
}
</style>
