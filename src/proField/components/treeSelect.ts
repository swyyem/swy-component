/* eslint-disable @typescript-eslint/no-explicit-any */
import { ElTreeSelect } from 'element-plus'
import { defineComponent, ref, onMounted, h, watch, computed, type PropType } from 'vue'
import { handleRequest, isEqual, buildValueLabelMap, getLabelFromValue } from '../utils'
import type { ProSchemaValueEnumType, ProFieldRequestData } from '../index.type'
import ProText from './text/pro-text.vue'
import type { TextSpecifiledProps } from './text/type'

export default defineComponent({
  props: {
    fieldProps: {
      type: Object,
      required: true,
    },
    textProps: {
      type: Object as PropType<Omit<TextSpecifiledProps, 'copyText'>>,
    },
    mode: {
      type: String as PropType<string>,
      required: true,
    },
    emptyText: {
      type: String as PropType<string>,
    },
    modelValue: {
      type: [String, Number, Boolean, Array, Object] as PropType<
        string | number | boolean | object | Array<string | number | object>
      >,
      default: () => {
        return ''
      },
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

    // 提前构建 Map
    const valueLabelMap = ref<Map<string | number, string>>(new Map())

    // 在 options 更新时重新构建 Map
    watch(
      options,
      (newOptions) => {
        valueLabelMap.value = buildValueLabelMap(newOptions)
      },
      { immediate: true },
    )

    // 计算只读模式下的 label
    const label = computed(() => {
      return getLabelFromValue(props.modelValue, valueLabelMap)
    })

    return () => {
      const { childRef, mode, fieldProps: a, textProps, emptyText } = props
      const fieldProps = { ...a, ref: childRef }

      if (mode === 'read') {
        // 处理自定义只读渲染
        const text = label.value ? label.value : emptyText
        return h(ProText, { ...textProps, ref: childRef, copyText: text }, () => text)
      }

      return h(ElTreeSelect, { ...fieldProps, data: options.value }, slots)
    }
  },
})
