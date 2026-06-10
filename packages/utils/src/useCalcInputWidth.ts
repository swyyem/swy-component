/**
 * 计算输入框宽度 Hook
 * 根据内容动态调整输入框宽度
 */
import { computed, ref, shallowRef } from 'vue'
import { useResizeObserver } from '@vueuse/core'

/** 使用计算输入框宽度 */
export function useCalcInputWidth() {
  const calculatorRef = shallowRef<HTMLElement>() // 计算器元素引用
  const calculatorWidth = ref(0) // 计算器宽度
  const MINIMUM_INPUT_WIDTH = 11 // 最小输入框宽度

  // 输入框样式（动态最小宽度）
  const inputStyle = computed(() => ({
    minWidth: `${Math.max(calculatorWidth.value, MINIMUM_INPUT_WIDTH)}px`,
  }))

  /** 重置计算器宽度 */
  const resetCalculatorWidth = () => {
    calculatorWidth.value = calculatorRef.value?.getBoundingClientRect().width ?? 0
  }

  // 监听元素大小变化
  useResizeObserver(calculatorRef, resetCalculatorWidth)

  return {
    calculatorRef,
    calculatorWidth,
    inputStyle,
  }
}
