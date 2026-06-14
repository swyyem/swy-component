import { ElDivider } from 'element-plus'
import { defineComponent, h, ref } from 'vue'
import type { DividerProps } from 'element-plus'
import type { PropType } from 'vue'

export default defineComponent({
  props: {
    fieldProps: {
      type: Object as PropType<DividerProps>,
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
      const { childRef, fieldProps: a } = props
      const fieldProps = { ...a, ref: childRef }

      return h(ElDivider, fieldProps, slots)
    }
  },
})
