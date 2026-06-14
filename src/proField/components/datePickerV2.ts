import { type DatePickerProps } from 'element-plus'
import { ref, defineComponent, h, type PropType } from 'vue'
import { formatModelValue } from '../utils'
import ProDatePicker from '../../proDatePicker'
import { typeFormatMap } from '../../proDatePicker/utils/dateHelper'
import { isEnter } from '../../utils/keyboard'

export const ProDatePickerProps = {
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
  },
}
export type ProDatePickerPropsType = {
  fieldProps: DatePickerProps
  mode: string
  emptyText?: string
  modelValue?: string | number | Date | string[] | number[] | Date[]
}
export default defineComponent<ProDatePickerPropsType>({
  props: ProDatePickerProps,
  setup(props, { slots, expose, emit }) {
    const childRef = ref(null)
    expose({
      childRef,
      getChild: () => childRef.value,
      getText: (v: any) => {
        return formatModelValue(v, props.emptyText, props.fieldProps.format)
      },
    })

    const keydownEnter = (e: KeyboardEvent) => {
      if (isEnter(e)) {
        e.stopPropagation()
        emit('keydown:enter')
      }
    }

    return () => {
      const { mode, modelValue, emptyText, fieldProps: a } = props
      const fieldProps = {
        ...a,
        clearable: a.clearable ?? true,
        ref: childRef,
        onKeydown: keydownEnter,
      }
      const date = formatModelValue(
        modelValue,
        emptyText,
        a.format || typeFormatMap[a.type || 'date'],
      )
      if (mode === 'read') {
        // 处理自定义只读渲染
        return h('div', { ref: childRef }, date)
      }

      return h(ProDatePicker, fieldProps, slots)
    }
  },
})
