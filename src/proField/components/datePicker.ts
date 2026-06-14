import { ElDatePicker, type DatePickerProps } from 'element-plus'
import { ref, defineComponent, h, type PropType } from 'vue'
import { formatModelValue } from '../utils'

export default defineComponent({
  props: {
    fieldProps: {
      type: Object as PropType<DatePickerProps>,
      required: true,
    },
    mode: {
      type: String as PropType<string>,
      required: true,
    },
    emptyText: {
      type: String as PropType<string>,
    },
    modelValue: {
      type: [String, Number, Date, Array<Date | string | number>] as PropType<
        string | number | Date | Array<Date | string | number>
      >,
      default: () => {
        return ''
      },
    },
  },
  setup(props, { slots, expose }) {
    const childRef = ref(null)

    expose({
      childRef,
      getChild: () => childRef.value,
      getText: (v: any) => {
        return formatModelValue(v, props.emptyText, props.fieldProps.format)
      },
    })

    return () => {
      const { mode, modelValue, emptyText, fieldProps: a } = props
      const fieldProps = { ...a, ref: childRef }

      const date = formatModelValue(modelValue, emptyText, a.format)

      if (mode === 'read') {
        // 处理自定义只读渲染
        return h('div', { ref: childRef }, date)
      }

      return h(ElDatePicker, fieldProps, slots)
    }
  },
})
