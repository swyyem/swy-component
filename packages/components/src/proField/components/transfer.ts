import { ElTransfer } from 'element-plus'
import { defineComponent, h, ref } from 'vue'
import type { TransferProps } from 'element-plus'
import type { PropType } from 'vue'
import ProText from './text/pro-text.vue'
import type { TextSpecifiledProps } from './text/type'

export default defineComponent({
  props: {
    fieldProps: {
      type: Object as PropType<TransferProps>,
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
      type: [String, Number] as PropType<string | number>,
      default: () => {
        return ''
      },
    },
    emptyText: {
      type: String as PropType<string>,
    },
    childRef: {
      type: Object as PropType<typeof ref>,
      default: () => {
        return ref(null)
      },
    },
  },
  setup(props, { slots }) {
    return () => {
      const { childRef, mode, modelValue, fieldProps: a, textProps, emptyText } = props
      const fieldProps = { ...a, ref: childRef }

      if (mode === 'read') {
        // 处理自定义只读渲染
        const text = modelValue ? modelValue.toString() : emptyText
        return h(ProText, { ...textProps, ref: childRef, copyText: text }, () => text)
      }

      return h(ElTransfer, fieldProps, slots)
    }
  },
})
