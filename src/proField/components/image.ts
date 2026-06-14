import { ElImage } from 'element-plus'
import { defineComponent, h, ref } from 'vue'
import type { ImageProps } from 'element-plus'
import type { PropType } from 'vue'
export default defineComponent({
  props: {
    fieldProps: {
      type: Object as PropType<ImageProps>,
      required: true,
    },
    modelValue: {
      type: [String, Number] as PropType<string | number>,
      required: true,
      default: () => {
        return ''
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
    return () => {
      const { childRef, modelValue, fieldProps: a } = props
      const fieldProps = { ...a, ref: childRef }

      // 判断 slots 是否为空对象
      const hasSlots = Object.keys(slots || {}).length > 0

      return h(ElImage, fieldProps, hasSlots ? slots : () => modelValue)
    }
  },
})
