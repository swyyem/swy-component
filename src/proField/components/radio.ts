/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineComponent, ref, onMounted, h, watch } from 'vue'
import { omit } from 'lodash-unified'
import { ElRadioGroup, ElRadio } from 'element-plus'
import type { RadioInstance } from 'element-plus'
import type { PropType, Ref } from 'vue'
import { isUndefined } from '../../utils'
import { isEnter } from '../../utils/keyboard'
import { handleRequest, isEqual, renderRead } from '../utils'
import type { ProSchemaValueEnumType, ProFieldRequestData, ProRadioGroupProps } from '../index.type'
import ProText from './text/pro-text.vue'
import type { TextSpecifiledProps } from './text/type'

export default defineComponent({
  props: {
    fieldProps: {
      type: Object as PropType<ProRadioGroupProps>,
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
      type: [String, Number, Boolean] as PropType<string | number | boolean>,
      default: () => {
        return ''
      },
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
    const options = ref<any[]>([])
    const childRef = ref(null)
    const temporaryRef = ref<Record<string, any>>({})
    const radiosRef = ref<Ref<RadioInstance | null>[]>([])
    onMounted(async () => {
      options.value = await handleRequest(props)
      radiosRef.value = options.value.map(() => ref<RadioInstance | null>(null))
      if (childRef.value) {
        // 遍历子组件实例的方法
        const arr = Object.entries(childRef.value)
        // console.log('=radio arr=', arr)
        arr.forEach(([key, value]) => {
          temporaryRef.value[key] = value
        })
      }
      // 添加获得焦点的方法
      temporaryRef.value['focus'] = () => {
        const modelValue = props.fieldProps.modelValue
        // 获取当前选中的下标，默认 0
        let selectedIndex = 0
        if (options.value.length > 0 && isUndefined(modelValue)) {
          const idx = options.value.findIndex((item) => item.value === modelValue)
          if (idx > -1) {
            selectedIndex = idx
          }
        }
        radiosRef.value[selectedIndex].value?.$el.focus()
      }
    })

    const keydownEnter = (e: KeyboardEvent) => {
      if (isEnter(e)) {
        e.stopPropagation()
        emit('keydown:enter')
      }
    }

    // 监听 props 的变化
    watch(
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

    expose({
      temporaryRef,
      getChild: () => temporaryRef.value,
      getText: (v: any) => {
        const { text } = renderRead(options, { modelValue: v })
        return text
      },
    })

    return () => {
      const { mode, emptyText, fieldProps } = props
      if (mode === 'read') {
        const { renderChildH, text } = renderRead(options, props)

        const renderH = renderChildH.length
          ? h(ProText, { ...props.textProps, ref: childRef, copyText: text }, () => renderChildH)
          : h(ProText, { ...props.textProps, ref: childRef, copyText: emptyText }, () => emptyText)

        return renderH
      }
      const otherFieldProps = omit(fieldProps, ['ref'])
      otherFieldProps.onKeydown = keydownEnter
      // 判断 slots 是否为空对象
      const hasSlots = Object.keys(slots || {}).length > 0
      return h(
        ElRadioGroup,
        {
          ...otherFieldProps,
          ref: childRef,
        },
        hasSlots
          ? slots
          : () =>
              options.value.map((option: any, n) =>
                h(ElRadio, {
                  ...option,
                  ref: radiosRef.value[n],
                  key: option.value, // 确保每个选项有唯一的 key
                }),
              ),
      )
    }
  },
})
