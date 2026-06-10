/**
 * ID 生成 Hook
 * 用于生成唯一的组件 ID，支持 SSR 水合
 */
import { getCurrentInstance, inject, unref } from 'vue'
import { type MaybeRef, computedEager } from '@vueuse/core'
import { debugWarn, isClient } from './index'
import { useGetDerivedNamespace } from './useNamespace'

import type { InjectionKey, Ref } from 'vue'

/** ID 注入上下文类型 */
export type ElIdInjectionContext = {
  prefix: number // 前缀
  current: number // 当前计数
}

/** 默认 ID 注入配置 */
const defaultIdInjection = {
  prefix: Math.floor(Math.random() * 10000),
  current: 0,
}

/** ID 注入 Key */
export const ID_INJECTION_KEY: InjectionKey<ElIdInjectionContext> = Symbol('elIdInjection')

/** 使用 ID 注入 */
export const useIdInjection = (): ElIdInjectionContext => {
  return getCurrentInstance() ? inject(ID_INJECTION_KEY, defaultIdInjection) : defaultIdInjection
}

/**
 * 使用 ID 生成
 * @param deterministicId 确定性 ID（可选）
 */
export const useId = (deterministicId?: MaybeRef<string>): Ref<string> => {
  const idInjection = useIdInjection()

  // SSR 警告：需要使用 provide 提供 ID 注入
  if (!isClient && idInjection === defaultIdInjection) {
    debugWarn(
      'IdInjection',
      `Looks like you are using server rendering, you must provide a id provider to ensure the hydration process to be succeed
usage: app.provide(ID_INJECTION_KEY, {
  prefix: number,
  current: number,
})`,
    )
  }

  const namespace = useGetDerivedNamespace()

  // NOTE: 使用 `computedEager` 立即计算 ID，避免 SSR 时 `computed` 懒执行导致 ID 不一致
  const idRef = computedEager(
    () =>
      unref(deterministicId) ||
      `${namespace.value}-id-${idInjection.prefix}-${idInjection.current++}`,
  )

  return idRef
}
