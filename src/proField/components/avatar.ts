import { ElAvatar } from 'element-plus'
import { defineComponent, h, ref } from 'vue'
import type { AvatarProps } from 'element-plus'
import type { PropType } from 'vue'
export default defineComponent({
  props: {
    fieldProps: {
      type: Object as PropType<AvatarProps>,
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

      // 判断 slots 是否为空对象
      const hasSlots = Object.keys(slots || {}).length > 0
      // TODO: i18n
      return h(ElAvatar, fieldProps, hasSlots ? slots : () => '头像')
    }
  },
})
