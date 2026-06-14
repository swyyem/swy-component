/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineComponent, ref, onMounted, onBeforeUnmount, h, watch, computed } from 'vue'
import { ElSelect, ElOption, ElCheckbox, type CheckboxValueType } from 'element-plus'
import { omit } from 'lodash-unified'
import type { PropType } from 'vue'
import {
  handleOnlyRequest,
  isEqual,
  renderRead,
  filterDisabledOptions,
  handleValueEnum,
} from '../utils'
import { getDefaultValueByMultiple } from '../../utils/value'
import { isUndefined } from '../../utils'
import type {
  ProSchemaValueEnumType,
  ProFieldRequestData,
  ProSelectProps,
  ProSchemaValueEnumValue,
} from '../index.type'
import ProText from './text/pro-text.vue'
import type { TextSpecifiledProps } from './text/type'

export default defineComponent({
  props: {
    fieldProps: {
      type: Object as PropType<Partial<ProSelectProps>>,
      required: true,
    },
    textProps: {
      type: Object as PropType<Omit<TextSpecifiledProps, 'copyText'>>,
    },
    mode: {
      type: String as PropType<string>,
      required: true,
    },
    modelValue: {
      type: [String, Number, Boolean, Array, Object, null] as PropType<
        string | number | boolean | object | null | Array<string | number | boolean | object | null>
      >,
    },
    emptyText: {
      type: String as PropType<string>,
    },
    request: {
      type: Function as PropType<ProFieldRequestData>,
    },
    valueEnum: {
      type: Array as PropType<ProSchemaValueEnumType[]>,
      default: () => {
        return []
      },
    },
    params: {
      type: [Object, Number, String] as PropType<object | number | string>,
    },
    debounceTime: {
      type: Number,
      default: () => {
        return 100
      },
    },
  },
  setup(props, { slots, expose, emit }) {
    const options = ref<ProSchemaValueEnumType[]>(handleValueEnum(props))
    const childRef = ref(null)
    onMounted(async () => {
      const res = await handleOnlyRequest(props)
      if (res.length > 0) {
        options.value = res
      }
    })
    // 组件卸载时停止监听
    onBeforeUnmount(() => {
      stopValueEnumWatch()
      stopModelValueWatch()
      stopCurrentWatch()
    })
    // 开启全选状态
    const checkStatus = computed(() => {
      return props.fieldProps.multiple && props.fieldProps.checkAll
    })
    const defaultValue = getDefaultValueByMultiple(props.modelValue, props.fieldProps.multiple)
    const checkAllText = props.fieldProps.checkAllText ?? '全部'
    const currentValue = ref(defaultValue)
    const isAll = ref(false)
    const isIndeterminate = ref(
      checkStatus.value ? (defaultValue as []).length > 0 && !isAll.value : false,
    )

    // 监听 modelValue 的变化
    const stopModelValueWatch = watch(
      () => props.modelValue,
      (newValue) => {
        if (isEqual(newValue, currentValue.value)) {
          return
        }
        currentValue.value = newValue
      },
    )

    const stopCurrentWatch = watch([currentValue, options], ([val, newOptions]) => {
      if (props.fieldProps.multiple) {
        const realVal = (val as []) || []
        if (realVal.length === 0) {
          isAll.value = false
          isIndeterminate.value = false
        } else if (realVal.length === filterDisabledOptions(newOptions).length) {
          isAll.value = true
          isIndeterminate.value = false
        } else {
          isIndeterminate.value = true
        }
      }
      if (!isUndefined(val)) {
        // proField 组件是通过 fieldProps 传入的，emit 无效，需手动调用
        props.fieldProps['onUpdate:modelValue']?.(val)
      }
    })
    // 监听 props 的变化
    const stopValueEnumWatch = watch(
      () => [props.params, props.valueEnum],
      async ([newParams, newValueEnum], [oldParams, oldValueEnum]) => {
        const { request, valueEnum } = props

        if (request && !isEqual(newParams, oldParams)) {
          options.value = await handleOnlyRequest(props)
        }
        if (!request && !isEqual(newValueEnum, oldValueEnum)) {
          options.value = valueEnum
        }
      },
      { deep: true }, // 启用深度监听
    )

    const handleCheckAll = (val: CheckboxValueType) => {
      isIndeterminate.value = false
      if (val) {
        currentValue.value = (
          options.value as { disabled: boolean; value: ProSchemaValueEnumValue }[]
        )
          .filter((item) => !item.disabled)
          .map((item) => item.value)
      } else {
        currentValue.value = []
      }
    }

    expose({
      childRef,
      getChild: () => childRef.value,
      getText: (v: any) => {
        if (v) {
          const { text } = renderRead(options, { modelValue: v })
          return text || v
        }
        return v
      },
    })

    return () => {
      const { mode, emptyText } = props
      if (mode === 'read') {
        const { renderChildH, text } = renderRead(options, props)

        const renderH = renderChildH.length
          ? h(ProText, { ...props.textProps, ref: childRef, copyText: text }, () => renderChildH)
          : h(ProText, { ...props.textProps, ref: childRef, copyText: emptyText }, () => emptyText)

        return renderH
      }

      // 判断 slots 是否为空对象
      const hasSlots = Object.keys(slots || {}).length > 0
      const slotCont = {
        ...(hasSlots
          ? slots
          : {
              default: () =>
                options.value.map((option: any) =>
                  h(ElOption, {
                    ...option,
                    key: option.value,
                  }),
                ),
            }),
      }
      if (checkStatus.value) {
        slotCont.header = () => [
          h(ElCheckbox, {
            label: checkAllText,
            modelValue: isAll.value,
            indeterminate: isIndeterminate.value,
            'onUpdate:modelValue': (val: CheckboxValueType) => handleCheckAll(val),
          }),
        ]
      }
      const otherFieldProps = omit(props.fieldProps, ['checkAll', 'checkAllText'])
      const multipleFieldProps = {
        ...otherFieldProps,
        modelValue: currentValue.value,
        'onUpdate:modelValue': (val: ProSchemaValueEnumValue[]) => {
          currentValue.value = val
          // 只处理单选
          if (!otherFieldProps.multiple) {
            emit('keydown:enter')
          }
        },
      }
      // 默认为 true
      if (isUndefined(multipleFieldProps.automaticDropdown)) {
        multipleFieldProps.automaticDropdown = true
      }
      return h(ElSelect, { ...multipleFieldProps, ref: childRef }, slotCont)
    }
  },
})
