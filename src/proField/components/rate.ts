import { ElRate } from 'element-plus'
import { defineComponent, h, ref } from 'vue'
import type { RateProps } from 'element-plus'
import type { PropType } from 'vue'
export default defineComponent({
  props: {
    fieldProps: {
      type: Object as PropType<RateProps>,
      required: true,
    },
    mode: {
      type: String as PropType<string>,
      required: true,
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
      const { childRef, mode, fieldProps: a } = props
      const fieldProps = { ...a, ref: childRef }

      if (mode === 'read') {
        // 处理自定义只读渲染
        return h(ElRate, { ...fieldProps, disabled: true }, slots)
      }

      return h(ElRate, fieldProps, slots)
    }
  },
})
