import { ElSlider } from 'element-plus'
import { defineComponent, h, ref } from 'vue'
import type { SliderProps } from 'element-plus'
import type { PropType } from 'vue'

export default defineComponent({
  props: {
    fieldProps: {
      type: Object as PropType<SliderProps>,
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
        return h(ElSlider, { ...fieldProps, disabled: true }, slots)
      }

      return h(ElSlider, fieldProps, slots)
    }
  },
})
