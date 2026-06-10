import { ElTimePicker, type TimePickerDefaultProps } from 'element-plus'
import { ref, defineComponent, h, type PropType } from 'vue'
import ProText from './text/pro-text.vue'
import type { TextSpecifiledProps } from './text/type'
import { formatModelValue } from '../utils'

export default defineComponent({
  props: {
    fieldProps: {
      type: Object as PropType<TimePickerDefaultProps>,
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
      type: [String, Number, Date, Array<Date | string | number>] as PropType<
        string | number | Date | Array<Date | string | number>
      >,
      default: () => {
        return ''
      },
    },
    emptyText: {
      type: String as PropType<string>,
    },
  },
  setup(props, { slots, expose }) {
    const childRef = ref(null)

    expose({
      childRef,
      getChild: () => childRef.value,
      getText: (v: any) => {
        return formatModelValue(v, props.emptyText, props.fieldProps.format || 'HH:mm:ss')
      },
    })

    return () => {
      const { mode, modelValue, fieldProps: a, textProps, emptyText } = props
      const fieldProps = { ...a, ref: childRef }

      const date = formatModelValue(modelValue, emptyText, a.format || 'HH:mm:ss')

      if (mode === 'read') {
        // 处理自定义只读渲染
        return h(ProText, { ...textProps, ref: childRef, copyText: date }, () => date)
      }

      return h(ElTimePicker, fieldProps, slots)
    }
  },
})
