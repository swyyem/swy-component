/**
 * 输入法组合输入 Hook
 * 处理中文等需要组合输入的语言
 */
import { nextTick, ref } from 'vue'
import { isKorean } from './index'

/** 使用组合输入的选项 */
interface UseCompositionOptions {
  afterComposition: (event: CompositionEvent) => void // 组合结束后的回调
  emit?: ((event: 'compositionstart', evt: CompositionEvent) => void) &
    ((event: 'compositionupdate', evt: CompositionEvent) => void) &
    ((event: 'compositionend', evt: CompositionEvent) => void)
}

/** 使用组合输入 */
export function useComposition({ afterComposition, emit }: UseCompositionOptions) {
  const isComposing = ref(false) // 是否正在组合输入

  /** 处理组合输入开始 */
  const handleCompositionStart = (event: CompositionEvent) => {
    emit?.('compositionstart', event)
    isComposing.value = true
  }

  /** 处理组合输入更新 */
  const handleCompositionUpdate = (event: CompositionEvent) => {
    emit?.('compositionupdate', event)
    const text = (event.target as HTMLInputElement)?.value
    const lastCharacter = text[text.length - 1] || ''
    // 韩文不需要保持组合状态
    isComposing.value = !isKorean(lastCharacter)
  }

  /** 处理组合输入结束 */
  const handleCompositionEnd = (event: CompositionEvent) => {
    emit?.('compositionend', event)
    if (isComposing.value) {
      isComposing.value = false
      nextTick(() => afterComposition(event)) // 下一个 tick 执行回调
    }
  }

  /** 统一处理组合输入事件 */
  const handleComposition = (event: CompositionEvent) => {
    if (event.type === 'compositionend') {
      handleCompositionEnd(event)
    } else {
      handleCompositionUpdate(event)
    }
  }

  return {
    isComposing,
    handleComposition,
    handleCompositionStart,
    handleCompositionUpdate,
    handleCompositionEnd,
  }
}
