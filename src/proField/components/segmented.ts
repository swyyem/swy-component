/* eslint-disable @typescript-eslint/no-explicit-any */
import { ElSegmented } from 'element-plus'
import { defineComponent, ref, onMounted, h, watch } from 'vue'
import type { SegmentedProps } from 'element-plus'
import type { PropType } from 'vue'
import { handleRequest, isEqual } from '../utils'
import type { ProSchemaValueEnumType, ProFieldRequestData } from '../index.type'

export default defineComponent({
  props: {
    fieldProps: {
      type: Object as PropType<SegmentedProps>,
      required: true,
    },
    mode: {
      type: String as PropType<string>,
      required: true,
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
    childRef: {
      type: Object as PropType<typeof ref>,
      default: () => {
        return ref(null)
      },
    },
  },
  setup(props, { slots }) {
    const options = ref<any[]>([])

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

    return () => {
      const { childRef, mode, fieldProps: a } = props
      const fieldProps = { ...a, ref: childRef }

      if (mode === 'read') {
        // 处理自定义只读渲染
        return h(ElSegmented, { ...fieldProps, options: options.value, disabled: true }, slots)
      }

      return h(ElSegmented, { ...fieldProps, options: options.value }, slots)
    }
  },
})
