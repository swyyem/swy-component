import { ElInput, ElIcon } from 'element-plus'
import { defineComponent, h, ref } from 'vue'
import type { InputProps } from 'element-plus'
import type { PropType } from 'vue'
import ProText from './text/pro-text.vue'
import type { TextSpecifiledProps } from './text/type'
import { View, Hide } from '@element-plus/icons-vue'
import { isEmpty } from '../utils'
import { useComposition } from '../../utils/hooks'
import { isEnter } from '../../utils/keyboard'
export default defineComponent({
  props: {
    fieldProps: {
      type: Object as PropType<InputProps>,
      required: true,
    },
    textProps: {
      type: Object as PropType<Omit<TextSpecifiledProps, 'copyText'>>,
    },
    mode: {
      type: String as PropType<string>,
      required: true,
    },
    emptyText: {
      type: String as PropType<string>,
    },
    modelValue: {
      type: [String, Number] as PropType<string | number>,
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
  setup(props, { slots, emit }) {
    const flag = ref(true)
    const {
      isComposing,
      handleCompositionStart,
      handleCompositionUpdate,
      handleCompositionEnd,
    } = useComposition({
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
      const {
        childRef,
        mode,
        modelValue,
        fieldProps: a,
        textProps,
        emptyText,
      } = props
      const fieldProps = {
        ...a,
        clearable: a.clearable ?? true,
        ref: childRef,
        onCompositionstart: handleCompositionStart,
        onCompositionupdate: handleCompositionUpdate,
        onCompositionend: handleCompositionEnd,
        onKeydown: keydownEnter,
      }
      if (mode === 'read') {
        const { type } = fieldProps
        if (type === 'password') {
          const Password = h(
            ElIcon,
            {
              style: {
                marginLeft: '10px',
              },
              onClick: () => {
                flag.value = !flag.value
              },
            },
            () =>
              h(flag.value ? Hide : View, {
                style: { color: '#1677ff', cursor: 'pointer' },
              }),
          )
          return h(
            'div',
            { ref: childRef },
            modelValue
              ? [
                  flag.value ? '******' : modelValue,
                  h(ElIcon, { style: { marginLeft: '10px' } }, () => Password),
                ]
              : emptyText,
          )
        }
        // 处理自定义只读渲染
        const text = !(isEmpty(modelValue) || modelValue === '')
          ? modelValue.toString()
          : emptyText
        return h(
          ProText,
          { ...textProps, ref: childRef, copyText: text },
          () => text,
        )
      }

      return h(ElInput, fieldProps as any, slots)
    }
  },
})
