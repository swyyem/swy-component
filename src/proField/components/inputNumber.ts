import { ElInputNumber } from 'element-plus'
import { defineComponent, h, ref } from 'vue'
import type { PropType } from 'vue'
import { omit } from 'lodash-unified'
import ProText from './text/pro-text.vue'
import type { TextSpecifiledProps } from './text/type'
import type { ProInputNumberProps } from '../index.type'
import { isNumber, isString } from '../../utils'
import { useComposition } from '../../utils/hooks'
import { isEnter } from '../../utils/keyboard'

type NumberFormatOptionsType = {
  style: string
  minimumFractionDigits: number
  maximumFractionDigits: number
  useGrouping: boolean
  currency?: string
}
const convertTool = (props: Partial<ProInputNumberProps>) => {
  const {
    locale = 'zh-CN',
    typeStyle = 'decimal',
    currency,
    decimalPlaces = 2,
    useGrouping = true,
  } = props
  const options: NumberFormatOptionsType = {
    style: typeStyle,
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
    useGrouping: useGrouping,
  }
  if (typeStyle === 'currency') {
    options.currency = currency
  }
  return new Intl.NumberFormat(locale, options as any)
}
export default defineComponent({
  props: {
    fieldProps: {
      type: Object as PropType<
        ProInputNumberProps & {
          class?: string
        }
      >,
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
      type: [String, Number] as PropType<number | string>,
    },
    emptyText: {
      type: String as PropType<string>,
    },
    childRef: {
      type: Object as PropType<typeof ref>,
      default: () => {
        return ref(null)
      },
    },
  },
  setup(props, { slots, emit }) {
    const convertNumber = convertTool(props.fieldProps)
    const { isComposing, handleCompositionStart, handleCompositionUpdate, handleCompositionEnd } =
      useComposition({
        afterComposition: () => {},
      })
    const keydownEnter = (e: KeyboardEvent) => {
      if (isEnter(e)) {
        e.stopPropagation()
        // e.preventDefault()
        // 中文输入法
        if (isComposing.value) {
          return
        }
        emit('keydown:enter')
      }
    }
    return () => {
      const { childRef, mode, modelValue, fieldProps: a, textProps, emptyText } = props
      // const fieldProps = { ...a, ref: childRef }
      const fieldProps = {
        ...a,
        ref: childRef,
        onCompositionstart: handleCompositionStart,
        onCompositionupdate: handleCompositionUpdate,
        onCompositionend: handleCompositionEnd,
        onKeydown: keydownEnter,
      }
      const otherFieldProps = omit(fieldProps, [
        'locale',
        'decimalPlaces',
        'useGrouping',
        'typeStyle',
        'currency',
      ]) as any
      if (mode === 'read') {
        const style = {
          justifyContent: 'flex-end',
        }
        // 处理自定义只读渲染
        // const text = !isEmpty(modelValue) ? modelValue?.toString() : emptyText
        const realValue = modelValue && isString(modelValue) ? parseFloat(modelValue) : modelValue
        const text = isNumber(realValue) ? convertNumber.format(realValue) : emptyText
        return h(ProText, { ...textProps, style, ref: childRef, copyText: text }, () => text)
      }
      if (otherFieldProps.controls === false) {
        otherFieldProps.class = `${otherFieldProps.class || ''} pro-input-number__right`
      }

      return h(ElInputNumber, otherFieldProps, slots)
    }
  },
})
