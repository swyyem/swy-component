<style scoped>
.profield-tip {
  color: var(--el-color-danger);
  margin-right: 4px;
}

.profield-nolabel :deep(.el-form-item__content) {
  margin-left: 0 !important;
}

.profield-nolabel > :deep(.el-form-item__label) {
  display: none;
}

.profield-nolabel.el-form-item--label-top > :deep(.el-form-item__label) {
  display: none;
}

.label-tooltip {
  display: flex;
  align-items: center;
}

.el-form-item :deep(.el-form-item__content) {
  flex-wrap: nowrap;
}

.label-position-top.el-form-item--label-top > :deep(.el-form-item__label) {
  display: flex;
  justify-content: flex-start;
}

:deep(.pro-tooltip--popper) {
  opacity: 0.1;
}

.component-box {
  width: 100%;
  height: 100%;
}

.error-box {
  display: flex;
  align-items: center;
  margin-left: 6px;
}
</style>

<script lang="ts" setup generic="T extends ProComponentObject">
/**
 * required 统一放入 rules 中处理
 * 默认 message 取 label 加上不能为空
 */
import type { ProComponentObject } from '../common.types'
import type {
  PropFormFieldProps,
  ProFormValueType,
  EffectCallbackType,
  GroupProps,
  ProFormFieldInstance,
  ProFormInjectEvents,
} from './form.types'
import type { ProFieldInstance } from '../proField/index.type'
import FormStore from './formStore'
import { ElFormItem, ElTooltip, ElIcon, type FormItemInstance } from 'element-plus'
import { Warning } from '@element-plus/icons-vue'
import { isEqual, pick } from 'lodash-unified'
import type { ProFormListDataType } from '../proFormList/index.types'
import {
  computed,
  inject,
  cloneVNode,
  useSlots,
  ref,
  onMounted,
  onUnmounted,
  watch,
  type Slots,
  nextTick,
  useAttrs,
} from 'vue'
import { omitProps, structuredClone } from './utils'
import { isArray } from '../utils'

defineOptions({
  name: 'ProFormField',
})

defineExpose<ProFormFieldInstance>({
  getFieldRef: () => {
    return fieldComponentRef
  },
})
// 定义 emit 事件
const emit = defineEmits<{
  'update:label': [value: string]
  'update:required': [value: boolean]
  'update:rules': [value: PropFormFieldProps['rules']]
  'update:params': [value: PropFormFieldProps['params']]
  'update:valueEnum': [value: PropFormFieldProps['valueEnum']]
  'update:fieldProps': [value: PropFormFieldProps['fieldProps']]
  'update:display': [value: PropFormFieldProps['display']]
  'keydown:enter': [value: string]
}>()
const formItemRef = ref<FormItemInstance>()
const tableTooltipRef = ref<InstanceType<typeof ElTooltip>>()
const errorMessage = computed(() => {
  if (formItemRef.value?.validateState === 'error') {
    return formItemRef.value?.validateMessage || ''
  }
  return ''
})
// showMessage 如果不设置默认值 true，则会被设置成 false，required 同样的问题
const props = withDefaults(defineProps<PropFormFieldProps>(), {
  immFocus: false,
  showMessage: true,
  hasLabelSpace: true,
  required: undefined,
  colon: undefined,
  display: 'visible',
  for: 'proformnoexist',
})
// 当 label 为 undefined 时，添加样式
const itemClass = props.hasLabelSpace ? '' : 'profield-nolabel'
const slots: Slots = useSlots()
const formStore = inject<FormStore<T>>('formStore')
const proformPosition = inject<GroupProps>('proformPosition')
const proformEvents = inject<ProFormInjectEvents>('formEvents', {} as ProFormInjectEvents)
const parentListData = inject<ProFormListDataType>('ProFormListData', {} as ProFormListDataType)
const parentListIndex = inject<number>('ProFormListIndex', -1)
// 注入 GridItem 提供的引用
const childDisplayState = inject<{
  formFieldIsNone: ReturnType<typeof ref<boolean>>
  formFieldIsHidden: ReturnType<typeof ref<boolean>>
}>('gridItemChildDisplay', {
  formFieldIsNone: ref(false),
  formFieldIsHidden: ref(false),
})

const currentListIndex = parentListIndex !== -1 ? `[${parentListIndex}]` : ''
const name = props.name
const originName = Array.isArray(name) ? name.join('.') : name
const colon = computed(() =>
  props.colon !== undefined ? props.colon : (proformPosition?.colon ?? false),
)
const emptyText = computed(() => {
  return proformPosition?.emptyText
})
const isDisplayErrorIcon = computed(() => {
  return proformPosition?.fieldErrorType === 'icon'
})

const labelPositionClass = proformPosition?.labelPosition === 'top' ? 'label-position-top' : ''

// label 加冒号
const labelText = computed(() => {
  const label = fieldModel?.getState('label')
  return colon.value && label ? `${label}：` : label
})
const realName = parentListData.name
  ? `${parentListData.name}${currentListIndex}.${originName}`
  : originName
// 添加 prop 的计算属性
const propName = computed(() => {
  return realName.replace(/\[(\d+)\]/g, '.$1')
})
// 只是为了布局和联动，没有 value 和 rules
const isLayout = props.layout ? true : false

// const visible = ref(false)

const ElFormItemProps = computed(() => {
  type Props = typeof props
  const excluded: (keyof Props)[] = [
    'name',
    'display',
    'effects',
    'fieldProps',
    'layout',
    'showMessage',
    'mode',
    'valueEnum',
    'request',
    'params',
    'hasLabelSpace',
    'ellipsis',
    'copyable',
    'lineClamp',
    'immFocus',
    'validateBeforeEnter',
  ]
  return omitProps(props, excluded)
})
const attrs = useAttrs()
const textProps = computed(() => {
  const res = pick(attrs, ['ellipsis', 'copyable', 'lineClamp'])
  return res
})
// watch(() => fieldsError, (newVal) => {
//   console.log(newVal, 'newVal')
// })
// 添加数据
formStore?.addModel(realName, {
  label: props.label,
  required: props.required,
  rules: props.rules,
  params: props.params,
  valueEnum: props.valueEnum,
  fieldProps: structuredClone(props.fieldProps),
  display: props.display,
  valueType: attrs.valueType as string,
})
// 添加副作用
formStore?.addEffect(realName, props.effects)
// 添加 effect 的回调
formStore?.addEffectCb(realName, ((key, value) => {
  const eventName = `update:${key}` as keyof typeof emit
  emit(eventName, value)
}) as EffectCallbackType)
// 如果触发时机为 blur，则需要设置 blur 事件透传至子组件
const hasBlur = props.effects ? props.effects.some((effect) => effect.trigger === 'blur') : false
const effectBlur = hasBlur
  ? () => {
      formStore?.runEffects(realName, 'blur')
    }
  : undefined
const fieldModel = formStore?.getModel(realName)
// console.log('=fieldModel=', fieldModel)
const isHidden = computed(() => fieldModel?.getState('display') === 'hidden')
const isNone = computed(() => fieldModel?.getState('display') === 'none')
// 监听组件是否卸载
watch(isNone, (newVal) => {
  if (newVal) {
    // v-if 为 true 时组件将被卸载，对应的 value 逻辑移除
    formStore?.removeSnapshot(realName)
  }
  if (childDisplayState && childDisplayState.formFieldIsNone) {
    childDisplayState.formFieldIsNone.value = newVal || false
  }
})
// 监听组件是否隐藏
watch(isHidden, (newVal) => {
  if (childDisplayState && childDisplayState.formFieldIsHidden) {
    childDisplayState.formFieldIsHidden.value = newVal || false
  }
})

// 监听 valueEnum, params, label, required, rules 的变化
watch(
  () => props.valueEnum,
  (newValueEnum) => {
    fieldModel?.setState('valueEnum', newValueEnum)
  },
)
watch(
  () => props.params,
  (newParams) => {
    fieldModel?.setState('params', newParams)
  },
)
watch(
  () => props.label,
  (newLabel) => {
    fieldModel?.setState('label', newLabel)
  },
)
watch(
  () => props.required,
  (newRequired) => {
    fieldModel?.setState('required', newRequired)
  },
)
watch(
  () => props.rules,
  (newRules) => {
    fieldModel?.setState('rules', newRules)
  },
)
watch(
  () => props.fieldProps,
  (newFieldProps, oldFieldProps) => {
    // 处理旧值中存在但新值中不存在的属性，设置为 undefined
    const newFieldMap: ProFormValueType = {}
    if (oldFieldProps) {
      Object.keys(oldFieldProps).forEach((key) => {
        if (newFieldProps && !(key in newFieldProps)) {
          newFieldMap[key] = undefined
        }
      })
    }
    if (newFieldProps) {
      Object.keys(newFieldProps).forEach((key) => {
        newFieldMap[key] = newFieldProps[key]
      })
    }
    const oldFieldState = fieldModel?.getState('fieldProps')
    // oldFieldState 合并到 newFieldMap
    if (oldFieldState) {
      Object.keys(oldFieldState).forEach((key) => {
        if (!newFieldMap[key]) {
          newFieldMap[key] = oldFieldState[key]
        }
      })
    }
    fieldModel?.setState('fieldProps', newFieldMap)
  },
  { deep: true },
)

watch(
  () => formStore?.getValue(realName),
  (newValue, oldValue) => {
    if (!isEqual(newValue, oldValue)) {
      props.onValueChange?.(newValue)
    }
  },
)

const handleValueChange = (value: unknown) => {
  formStore?.setValue(realName, value)
  // props.onValueChange?.(value)
}
const handleEnhanceOptionChange = (option: unknown) => {
  fieldModel?.setState('option', option)
}
const triggerKeydownEnter = () => {
  // 如果 props 上有 onKeydownEnter，则调用
  if (parentListData.onKeydownEnter) {
    setTimeout(() => {
      parentListData.onKeydownEnter(realName)
    }, 50)
  } else if (proformEvents.onKeydownEnter) {
    setTimeout(() => {
      proformEvents.onKeydownEnter?.(realName)
    }, 50)
  } else {
    emit('keydown:enter', realName)
  }
}
const handleKeydownEnter = () => {
  // 开启了校验通过才能触发回车
  if (props.validateBeforeEnter) {
    formItemRef.value
      ?.validate('change')
      .then(() => {
        triggerKeydownEnter()
        tableTooltipRef.value?.hide()
      })
      .catch(() => {
        tableTooltipRef.value?.onOpen()
      })
  } else {
    triggerKeydownEnter()
  }
}
const fieldComponentRef = ref<ProFieldInstance>()
const getFieldChildRef = () => {
  return fieldComponentRef.value?.getControlRef
    ? fieldComponentRef.value?.getControlRef()
    : fieldComponentRef.value
}
// 监听 mode 变化, 备注 checkbox 状态未变不会触发 mode
watch(
  () => props.mode,
  (newVal) => {
    if (newVal === 'edit' && props.immFocus) {
      nextTick(() => {
        getFieldChildRef()?.focus?.()
      })
    }
  },
)
onMounted(() => {
  if (!isLayout && fieldComponentRef.value) {
    parentListData.addColumnKey?.(realName)
    const componentInstance = fieldComponentRef.value.childRef || fieldComponentRef.value
    // 添加实例
    formStore?.addInstance(realName, componentInstance, () => getFieldChildRef())
    // 初始化 value
    if (props.initialValue) {
      formStore?.setValue(realName, props.initialValue)
    }
    // initEffect 支持 name 数组，如果是数组，需要判断是否匹配
    const initEffect = proformPosition?.initEffect
    if (initEffect) {
      const isArr = isArray(initEffect)
      const matchEffect = isArr ? initEffect.includes(name) : initEffect
      if (matchEffect && props.effects && props.effects.length > 0) {
        nextTick(() => {
          // console.log('=field next=', Date.now())
          formStore?.runEffects(realName, 'change')
          formStore?.runEffects(realName, 'blur')
        })
      }
    }
  }
})

onUnmounted(() => {
  if (!isLayout) {
    // 移除实例
    formStore?.removeInstance(realName)
    parentListData.removeColumnKey?.(realName)
  }
  formStore?.removeModel(realName)
  formStore?.removeSnapshot(realName)
  // formStore?.removeValue(realName)
  formStore?.removeEffect(realName)
})

const getChildComponent = () => {
  // console.log('=field render=')
  const defaultSlots = slots.default?.()
  if (defaultSlots?.length === 1) {
    if (attrs.valueType === 'table') {
      return cloneVNode(defaultSlots[0], {
        ref: fieldComponentRef,
        mode: props.mode || formStore?.getMode(),
        rowKey: fieldModel?.getState('fieldProps')?.rowKey,
        data: formStore?.getValue(realName),
        onDataChange: handleValueChange,
        fieldProps: fieldModel?.getState('fieldProps'),
      })
    } else {
      return cloneVNode(defaultSlots[0], {
        ...textProps.value,
        key: realName,
        ref: fieldComponentRef,
        modelValue: formStore?.getValue(realName),
        'onUpdate:modelValue': handleValueChange,
        'onUpdate:option': handleEnhanceOptionChange,
        'onKeydown:enter': handleKeydownEnter,
        request: props.request,
        optionData: fieldModel?.getState('option'),
        mode: props.mode || formStore?.getMode(),
        fieldProps: fieldModel?.getState('fieldProps'),
        params: fieldModel?.getState('params'),
        valueEnum: fieldModel?.getState('valueEnum'),
        emptyText: emptyText.value,
        onBlur: effectBlur,
      })
    }
  }
  return defaultSlots
}
</script>

<template>
  <el-form-item
    ref="formItemRef"
    v-bind="ElFormItemProps"
    v-if="!isNone"
    v-show="!isHidden"
    :class="[itemClass, labelPositionClass]"
    :showMessage="props.showMessage"
    :required="isLayout ? false : fieldModel?.getState('required')"
    :prop="propName"
    :label="labelText"
    :rules="fieldModel?.getState('rules')"
  >
    <el-tooltip
      v-if="!isDisplayErrorIcon"
      ref="tableTooltipRef"
      placement="top"
      :content="errorMessage"
      :disabled="!errorMessage"
    >
      <div class="component-box">
        <component :is="getChildComponent" :key="propName" />
      </div>
    </el-tooltip>
    <div v-else class="component-box">
      <component :is="getChildComponent" :key="propName" />
    </div>
    <template #error="{ error }">
      <div class="error-box" v-if="isDisplayErrorIcon">
        <el-tooltip placement="top-end" :content="error">
          <el-icon color="#E8322E" size="16">
            <Warning />
          </el-icon>
        </el-tooltip>
      </div>
      <div v-else></div>
    </template>

    <template v-if="isLayout && !props.tooltip" #label>
      <span v-if="fieldModel?.getState('required')" class="profield-tip">*</span>
      {{ labelText }}
    </template>

    <template v-else-if="!isLayout && props?.tooltip" #label>
      <div class="label-tooltip">
        {{ labelText }}
        <el-tooltip
          v-if="props.fieldProps?.tooltip"
          :content="props.fieldProps?.tooltip"
          placement="top"
        >
          <el-icon>
            <Warning />
          </el-icon>
        </el-tooltip>
      </div>
    </template>
  </el-form-item>
</template>
