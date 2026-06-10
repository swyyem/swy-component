/**
 * 空值处理 Hook
 * 统一管理组件的空值和清除值逻辑
 */
import { computed, getCurrentInstance, inject, ref } from 'vue'
import type { ExtractPropTypes, InjectionKey, Ref } from 'vue'
import { buildProps, debugWarn, isFunction } from './index'

type EmptyValuesContext = ExtractPropTypes<typeof useEmptyValuesProps>

/** 空值上下文 Key */
export const emptyValuesContextKey: InjectionKey<Ref<EmptyValuesContext>> =
  Symbol('emptyValuesContextKey')
export const SCOPE = 'use-empty-values'
/** 默认空值列表 */
export const DEFAULT_EMPTY_VALUES = ['', undefined, null]
/** 默认清除后的值 */
export const DEFAULT_VALUE_ON_CLEAR = undefined

/** 空值处理 Props */
export const useEmptyValuesProps = buildProps({
  /**
   * @description 组件支持的空值
   */
  emptyValues: Array,
  /**
   * @description 清除时的返回值，如果要设置 `undefined`，使用 `() => undefined`
   */
  valueOnClear: {
    type: [String, Number, Boolean, Function],
    default: undefined,
    validator: (val: any) => (isFunction(val) ? !val() : !val),
  },
} as const)

/**
 * 使用空值处理
 * @param props 组件 props
 * @param defaultValue 默认值
 */
export const useEmptyValues = (props: EmptyValuesContext, defaultValue?: null | undefined) => {
  // 获取配置（从 provide 或默认值）
  const config = getCurrentInstance()
    ? inject(emptyValuesContextKey, ref<EmptyValuesContext>({}))
    : ref<EmptyValuesContext>({})

  // 空值列表（优先级：props > config > 默认值）
  const emptyValues = computed(
    () => props.emptyValues || config.value.emptyValues || DEFAULT_EMPTY_VALUES,
  )

  // 清除时的值（优先级：props > config > defaultValue > 默认值）
  const valueOnClear = computed(() => {
    // function 用于设置 undefined（因为 undefined 不能作为 prop 值）
    if (isFunction(props.valueOnClear)) {
      return props.valueOnClear()
    } else if (props.valueOnClear !== undefined) {
      return props.valueOnClear
    } else if (isFunction(config.value.valueOnClear)) {
      return config.value.valueOnClear()
    } else if (config.value.valueOnClear !== undefined) {
      return config.value.valueOnClear
    }
    return defaultValue !== undefined ? defaultValue : DEFAULT_VALUE_ON_CLEAR
  })

  /** 判断是否为空值 */
  const isEmptyValue = (value: any) => {
    return emptyValues.value.includes(value)
  }

  // 警告：valueOnClear 应该在 emptyValues 中
  if (!emptyValues.value.includes(valueOnClear.value)) {
    debugWarn(SCOPE, 'value-on-clear should be a value of empty-values')
  }

  return {
    emptyValues,
    valueOnClear,
    isEmptyValue,
  }
}
