import { ref, defineComponent, h } from 'vue'
import ProFieldPicker, { ProDatePickerProps, type ProDatePickerPropsType } from './datePickerV2'

export default defineComponent<ProDatePickerPropsType>({
  props: ProDatePickerProps,
  setup(props, { slots, expose }) {
    const childRef = ref<any>(null)
    expose({
      get childRef() {
        // 透传
        return childRef.value.childRef
      },
      getChild: () => {
        // console.log('=childRef=', childRef.value)
        return childRef.value.getChild()
      },
      getText: (v: any) => {
        return childRef.value?.getText(v)
      },
    })

    return () => {
      const { fieldProps: a, ...reset } = props
      const fieldProps = {
        ...a,
        type: 'daterange' as const,
      }

      return h(ProFieldPicker, { ...reset, ref: childRef, fieldProps }, slots)
    }
  },
})
