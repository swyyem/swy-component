/**
 * 自定义渲染组件
 * 用于动态渲染传入的 VNode 内容
 */
import { defineComponent } from 'vue'
import type { VNode, PropType } from 'vue'

/** 渲染自定义内容的组件 */
export const RenderCustom = defineComponent({
  name: 'RenderCustom',
  props: {
    /** 渲染内容函数 */
    content: {
      type: Function as PropType<() => VNode | VNode[] | null>,
      required: true,
    },
  },
  setup(props) {
    // 执行内容函数并返回 VNode
    return () => props.content()
  },
})
