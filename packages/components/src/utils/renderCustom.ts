import { defineComponent } from 'vue'
import type { VNode, PropType } from 'vue'

export const RenderCustom = defineComponent({
  name: 'RenderCustom',
  props: {
    content: {
      type: Function as PropType<() => VNode | VNode[] | null>,
      required: true,
    },
  },
  setup(props) {
    return () => props.content()
  },
})
