import { ElInput } from 'element-plus'
import { defineComponent, h, ref } from 'vue'
import type { PropType } from 'vue'
import { omit } from 'lodash-unified'
import ProText from './text/pro-text.vue'
import type { TextSpecifiledProps } from './text/type'
import type { ProInputPriceProps } from '../index.type'
import { isNumber, isString } from '../../utils'
import { useComposition } from '../../utils/hooks'
import { isEnter } from '../../utils/keyboard'

/*
 * 原生方法就支持 数字格式化
 * new Intl.NumberFormat('zh-CN', {
 *   style: 'currency',
 *   currency: 'CNY',
 *   minimumFractionDigits: 2,
 *   maximumFractionDigits: 2,
 *   useGrouping: true
 * }).format(1234567.89)
 *  -> ￥1,234,567.89
 */
type NumberFormatOptionsType = {
  style: string
  minimumFractionDigits: number
  maximumFractionDigits: number
  useGrouping: boolean
  currency?: string
}
type PriceValueType = string | number
const convertTool = (props: Partial<ProInputPriceProps>) => {
  const {
    locale = 'zh-CN',
    typeStyle = 'decimal',
    currency,
    decimalPlaces = 4,
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
const limitNumber = (val?: PriceValueType) => {
  // 只允许数字和一个小数点，且小数点不能开头
  const filtered = String(val || '')
    .replace(/[^\d.-]/g, '') // 保留数字、小数点、负号
    .replace(/(?!^)-/g, '') // 仅保留第一个负号
    .replace(/^(-?\d*)\.(\d*)\./, '$1.$2') // 限制一个小数点
  return filtered
}
const getRealValue = (convertNumber: Intl.NumberFormat, modelValue?: PriceValueType) => {
  const realValue = modelValue && isString(modelValue) ? parseFloat(modelValue) : modelValue
  const text = isNumber(realValue) ? convertNumber.format(realValue) : ''
  return text
}
// const numberReg = /^-?\\d+(\\.\\d+)?$/g
export default defineComponent({
  props: {
    fieldProps: {
      type: Object as PropType<ProInputPriceProps>,
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
      type: [Number, String] as PropType<PriceValueType>,
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
  setup(props, { expose, slots, emit }) {
    const childRef = ref(null)
    const convertNumber = convertTool(props.fieldProps)
    const parseInput = (val: PriceValueType) => {
      const res = limitNumber(val)
      return res
    }
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

    expose({
      childRef,
      getChild: () => childRef.value,
      getText: (v: any) => {
        return getRealValue(convertNumber, v)
      },
    })

    return () => {
      const { mode, modelValue, fieldProps, textProps, emptyText } = props
      // const fieldProps = { ...a, inputStyle: 'text-align: right;', ref: childRef }
      const { textRight, ...restProps } = fieldProps
      const localFieldProps = {
        ...restProps,
        inputStyle: textRight ? 'text-align: right;' : undefined,
        ref: childRef,
        onCompositionstart: handleCompositionStart,
        onCompositionupdate: handleCompositionUpdate,
        onCompositionend: handleCompositionEnd,
        onKeydown: keydownEnter,
      }
      const otherFieldProps = omit(localFieldProps, [
        'locale',
        'decimalPlaces',
        'useGrouping',
        'typeStyle',
        'currency',
      ])
      if (mode === 'read') {
        const style = textRight
          ? {
              justifyContent: 'flex-end',
            }
          : {}
        // 处理自定义只读渲染
        const text = getRealValue(convertNumber, modelValue) || emptyText
        return h(ProText, { ...textProps, style, ref: childRef, copyText: text }, () => text)
      }
      // 防止 input 警告
      if (!otherFieldProps.onInput) {
        otherFieldProps.onInput = () => {}
      }
      return h(
        ElInput,
        {
          ...otherFieldProps,
          inputmode: 'decimal',
          parser: parseInput,
          formatter: (val: PriceValueType) => val,
        } as any,
        slots,
      )
    }
  },
})
