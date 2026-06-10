/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineComponent, ref, computed, h } from 'vue'
import type { PropType } from 'vue'
import ProSelect, {
  getSelectEnhanceText,
  type ProSelectDefaultProps,
  // type ProSelectInstance,
} from '../../proSelect'
import type { ProSchemaValueEnumType } from '../index.type'
import ProText from './text/pro-text.vue'
import type { TextSpecifiledProps } from './text/type'

type OptionDataType = {
  label: string
  value: any
}
// valueEnum 和 select 不一样，需要写在 fileProps 上
export default defineComponent({
  props: {
    fieldProps: {
      type: Object as PropType<ProSelectDefaultProps>,
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
    },
    optionData: {
      type: Object as PropType<OptionDataType>,
    },
    emptyText: {
      type: String as PropType<string>,
    },
    params: {
      type: Object as PropType<object>,
    },
    valueEnum: {
      type: Array as PropType<ProSchemaValueEnumType[]>,
    },
  },
  setup(props, { slots, expose }) {
    const mergeFieldProps = computed(() => {
      const p = {
        ...props.fieldProps,
        params: props.params,
      }
      // props 中的优先级比 fieldProps 中高
      if (props.valueEnum) {
        p.valueEnum = props.valueEnum
      }
      return p
    })
    // const selectRef = ref<ProSelectInstance>()
    const childRef = ref()
    // text 需要 option
    const optionTextParams = computed(() => {
      const v = {
        ...mergeFieldProps.value,
      }
      if (props.optionData) {
        v.defaultLabel = Array.isArray(props.optionData)
          ? props.optionData.map((item) => item.label)
          : props.optionData.label
      }
      return v
    })
    expose({
      childRef,
      getChild: () => childRef.value,
      getText: (v: any) => {
        return getSelectEnhanceText(v, optionTextParams.value)
      },
    })

    return () => {
      const { mode, emptyText } = props
      if (mode === 'read') {
        const texts = getSelectEnhanceText(props.modelValue, optionTextParams.value)
        const renderH = texts
          ? h(ProText, { ...props.textProps, ref: childRef, copyText: texts }, () => texts)
          : h(ProText, { ...props.textProps, ref: childRef, copyText: emptyText }, () => emptyText)

        return renderH
      }
      return h(ProSelect, { ...mergeFieldProps.value, ref: childRef }, slots)
    }
  },
})
