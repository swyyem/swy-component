/**
 * 焦点控制 Hook
 * 管理组件的焦点状态和行为
 */
import { getCurrentInstance, onMounted, ref, shallowRef, watch } from 'vue'
import { useEventListener } from '@vueuse/core'
import { isElement, isFunction } from './index'
import { useProp } from './useProp'
import type { ShallowRef } from 'vue'

/** 使用焦点控制的选项 */
interface UseFocusControllerOptions {
  /** 聚焦前钩子，返回 true 取消聚焦 */
  beforeFocus?: (event: FocusEvent) => boolean | undefined
  /** 聚焦后钩子 */
  afterFocus?: () => void
  /** 失焦前钩子，返回 true 取消失焦 */
  beforeBlur?: (event: FocusEvent) => boolean | undefined
  /** 失焦后钩子 */
  afterBlur?: () => void
}

/**
 * 使用焦点控制
 * @param target 目标元素引用
 * @param options 选项
 */
export function useFocusController<T extends { focus: () => void }>(
  target: ShallowRef<T | undefined>,
  { beforeFocus, afterFocus, beforeBlur, afterBlur }: UseFocusControllerOptions = {},
) {
  const instance = getCurrentInstance()!
  const { emit } = instance
  const wrapperRef = shallowRef<HTMLElement>() // 容器引用
  const disabled = useProp<boolean>('disabled') // 禁用状态
  const isFocused = ref(false) // 是否聚焦

  /** 处理聚焦 */
  const handleFocus = (event: FocusEvent) => {
    const cancelFocus = isFunction(beforeFocus) ? beforeFocus(event) : false
    if (cancelFocus || isFocused.value) return
    isFocused.value = true
    emit('focus', event)
    afterFocus?.()
  }

  /** 处理失焦 */
  const handleBlur = (event: FocusEvent) => {
    const cancelBlur = isFunction(beforeBlur) ? beforeBlur(event) : false
    // 如果取消失焦或焦点仍在容器内，则不失焦
    if (
      cancelBlur ||
      (event.relatedTarget && wrapperRef.value?.contains(event.relatedTarget as Node))
    )
      return

    isFocused.value = false
    emit('blur', event)
    afterBlur?.()
  }

  /** 处理点击 */
  const handleClick = () => {
    // 如果焦点已在容器内或禁用，则不处理
    if (
      (wrapperRef.value?.contains(document.activeElement) &&
        wrapperRef.value !== document.activeElement) ||
      disabled.value
    )
      return

    target.value?.focus()
  }

  // 监听容器和禁用状态变化
  watch([wrapperRef, disabled], ([el, disabled]) => {
    if (!el) return
    if (disabled) {
      el.removeAttribute('tabindex') // 禁用时移除 tabindex
    } else {
      el.setAttribute('tabindex', '-1') // 启用时设置 tabindex
    }
  })

  // 绑定事件
  useEventListener(wrapperRef, 'focus', handleFocus, true)
  useEventListener(wrapperRef, 'blur', handleBlur, true)
  useEventListener(wrapperRef, 'click', handleClick, true)

  // 仅用于测试
  if (process.env.NODE_ENV === 'test') {
    onMounted(() => {
      const targetEl = isElement(target.value)
        ? target.value
        : document.querySelector('input,textarea')

      if (targetEl) {
        useEventListener(targetEl, 'focus', handleFocus, true)
        useEventListener(targetEl, 'blur', handleBlur, true)
      }
    })
  }

  return {
    isFocused,
    /** 避免 wrapperRef 和 handleFocus/handleBlur 一起使用 */
    wrapperRef,
    handleFocus,
    handleBlur,
  }
}
