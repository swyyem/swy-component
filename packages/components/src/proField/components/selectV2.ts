/* eslint-disable @typescript-eslint/no-explicit-any */
import { ElSelectV2, type SelectV2Props } from 'element-plus'
import { defineComponent, ref, onMounted, h, watch } from 'vue'
import type { PropType } from 'vue'
import { handleRequest, isEqual, renderRead } from '../utils'
import type { ProSchemaValueEnumType, ProFieldRequestData } from '../index.type'
import ProText from './text/pro-text.vue'
import type { TextSpecifiledProps } from './text/type'

export default defineComponent({
  props: {
    fieldProps: {
      type: Object as PropType<SelectV2Props>,
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
      type: [String, Number, Boolean, Array, Object] as PropType<
        string | number | boolean | object | Array<string | number | object>
      >,
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
  setup(props, { slots, expose }) {
    const options = ref<any[]>([])
    const childRef = ref(null)
    onMounted(async () => {
      options.value = await handleRequest(props)
    })

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
      const { mode, fieldProps: a, emptyText } = props
      const fieldProps = { ...a, ref: childRef }

      if (mode === 'read') {
        const { renderChildH, text } = renderRead(options, props)

        const renderH = renderChildH.length
          ? h(ProText, { ...props.textProps, ref: childRef, copyText: text }, () => renderChildH)
          : h(ProText, { ...props.textProps, ref: childRef, copyText: emptyText }, () => emptyText)

        return renderH
      }

      return h(ElSelectV2, { ...fieldProps, options: options.value }, slots)
    }
  },
})
