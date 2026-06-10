/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineComponent, ref, onMounted, onBeforeUnmount, h, watch, computed } from 'vue'
import { ElCheckboxGroup, ElCheckbox } from 'element-plus'
import { omit } from 'lodash-unified'
import type { CheckboxGroupProps, CheckboxProps, CheckboxValueType } from 'element-plus'
import type { PropType } from 'vue'
import ProCheckbox from '../instead/checkbox.vue'
import ProText from './text/pro-text.vue'
import { handleRequest, isEqual, renderRead } from '../utils'
import { isEnter } from '../../utils/keyboard'
import { isUndefined } from '../../utils'
import type {
  ProSchemaValueEnumType,
  ProSchemaValueEnumValue,
  ProFieldRequestData,
  ProCheckboxProps,
} from '../index.type'
import type { TextSpecifiledProps } from './text/type'

export default defineComponent({
  props: {
    fieldProps: {
      type: Object as PropType<Partial<ProCheckboxProps>>,
      required: true,
    },
    textProps: {
      type: Object as PropType<Omit<TextSpecifiledProps, 'copyText'>>,
    },
    emptyText: {
      type: String as PropType<string>,
    },
    mode: {
      type: String as PropType<string>,
      required: true,
    },
    modelValue: {
      type: [Array, String, Number, Boolean] as PropType<
        ProSchemaValueEnumValue[] | ProSchemaValueEnumValue
      >,
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
      type: [Object, Number, String],
    },
    debounceTime: {
      type: Number,
      default: () => {
        return 100
      },
    },
  },
  emits: ['update:modelValue', 'keydown:enter'],
  setup(props, { slots, emit, expose }) {
    const options = ref<any[]>([])
    const childRef = ref(null)
    const currentValue = ref(props.modelValue)
    const multiple = computed(() => props.fieldProps.multiple ?? true)
    const readContinue = computed(() => {
      if (props.mode === 'read') {
        return props.fieldProps.readContinue ?? false
      }
      // 编辑态始终 false
      return false
    })
    // 全选状态
    const isAll = ref(false)
    const isIndeterminate = ref(false)

    const stopModelValueWatch = watch(
      () => props.modelValue,
      (newValue) => {
        if (multiple.value) {
          currentValue.value = newValue || []
        } else {
          currentValue.value = newValue
        }
      },
    )

    const stopCurrentWatch = watch([currentValue, options], ([val, newOptions]) => {
      if (multiple.value) {
        const realVal = (val as ProSchemaValueEnumValue[]) || []
        const realOptions = (newOptions || []).filter((item) => !item.disabled)
        if (realVal.length === 0) {
          isAll.value = false
          isIndeterminate.value = false
        } else if (realVal.length === realOptions.length) {
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

    const handleCheckAll = (val: CheckboxValueType) => {
      isIndeterminate.value = false
      if (val) {
        currentValue.value = options.value
          .filter((item) => !item.disabled)
          .map((item) => item.value)
      } else {
        currentValue.value = []
      }
    }

    onMounted(async () => {
      options.value = await handleRequest(props)
    })
    // 组件卸载时停止监听
    onBeforeUnmount(() => {
      stopValueEnumWatch()
      stopModelValueWatch()
      stopCurrentWatch()
    })

    // 监听 props 的变化
    const stopValueEnumWatch = watch(
      () => [props.params, props.valueEnum],
      async ([newParams, newValueEnum], [oldParams, oldValueEnum]) => {
        const { request, valueEnum } = props

        if (request && !isEqual(newParams, oldParams)) {
          options.value = await handleRequest(props)
        }
        if (!request && !isEqual(newValueEnum, oldValueEnum)) {
          options.value = valueEnum
        }
      },
      { deep: true }, // 启用深度监听
    )

    const keydownEnter = (e: KeyboardEvent) => {
      if (isEnter(e)) {
        e.stopPropagation()
        emit('keydown:enter')
      }
    }

    expose({
      childRef,
      getChild: () => childRef.value,
      getText: (v: any) => {
        if (multiple.value) {
          const { text } = renderRead(options, { modelValue: v })
          return text
        }
        const isBool = typeof v === 'boolean'
        return isBool ? (v ? '是' : '否') : v
      },
    })

    return () => {
      const { mode, emptyText, fieldProps } = props
      const checkAll = fieldProps.checkAll ?? false
      const checkAllText = fieldProps.checkAllText ?? '全部'
      const marginRight = fieldProps.gap ?? 18
      if (mode === 'read' && !readContinue.value) {
        if (multiple.value) {
          const { renderChildH, text } = renderRead(options, props)
          const renderH = renderChildH.length
            ? h(ProText, { ...props.textProps, ref: childRef, copyText: text }, () => renderChildH)
            : h(
                ProText,
                { ...props.textProps, ref: childRef, copyText: emptyText },
                () => emptyText,
              )
          return renderH
        }
        const realValue = String(props.modelValue)
        return props.modelValue
          ? h(ProText, { ...props.textProps, ref: childRef, copyText: realValue }, () => realValue)
          : h(ProText, { ...props.textProps, ref: childRef, copyText: emptyText }, () => emptyText)
      }
      const otherFieldProps = omit(fieldProps, [
        'multiple',
        'checkAll',
        'checkAllText',
        'gap',
        'readContinue',
      ])
      // 只读保持 checkbox 状态
      if (readContinue.value) {
        otherFieldProps.style = otherFieldProps.style || {}
        otherFieldProps.style.pointerEvents = 'none'
      }
      // console.log('=otherFieldProps=', otherFieldProps)
      if (!multiple.value) {
        otherFieldProps.onKeydown = keydownEnter
        return h(ProCheckbox, { ...(otherFieldProps as CheckboxProps), ref: childRef }, slots)
      }
      const multipleFieldProps = {
        ...otherFieldProps,
        modelValue: currentValue.value,
        'onUpdate:modelValue': (val: ProSchemaValueEnumValue[]) => {
          if (readContinue.value) {
            return
          }
          currentValue.value = val
        },
      }

      // 判断 slots 是否为空对象
      const hasSlots = Object.keys(slots || {}).length > 0
      let checkboxCont = h(
        ElCheckboxGroup,
        { ...(multipleFieldProps as unknown as CheckboxGroupProps), ref: childRef },
        hasSlots
          ? slots
          : () =>
              options.value.map((option: any) =>
                h(ElCheckbox, {
                  ...option,
                  style: { marginRight: `${marginRight}px` },
                  key: option.value, // 确保每个选项有唯一的 key
                }),
              ),
      )

      if (checkAll && !readContinue.value) {
        checkboxCont = h('div', { style: 'display: flex' }, [
          h(
            ElCheckbox,
            {
              style: { marginRight: `${marginRight}px` },
              indeterminate: isIndeterminate.value,
              modelValue: isAll.value,
              'onUpdate:modelValue': handleCheckAll,
            },
            () => checkAllText,
          ),
          checkboxCont,
        ])
      }

      return checkboxCont
    }
  },
})
