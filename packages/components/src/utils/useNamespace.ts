/**
 * 命名空间 Hook
 * 用于生成 BEM 规范的 CSS 类名
 */
import { computed } from 'vue'

import type { InjectionKey, Ref } from 'vue'

/** 默认命名空间 */
export const defaultNamespace = 'el'
/** 状态前缀 */
const statePrefix = 'is-'

/**
 * 生成 BEM 类名
 * @param namespace 命名空间
 * @param block 块
 * @param blockSuffix 块后缀
 * @param element 元素
 * @param modifier 修饰符
 */
const _bem = (
  namespace: string,
  block: string,
  blockSuffix: string,
  element: string,
  modifier: string,
) => {
  let cls = `${namespace}-${block}`
  if (blockSuffix) {
    cls += `-${blockSuffix}`
  }
  if (element) {
    cls += `__${element}`
  }
  if (modifier) {
    cls += `--${modifier}`
  }
  return cls
}

/** 命名空间上下文 Key */
export const namespaceContextKey: InjectionKey<Ref<string | undefined>> =
  Symbol('namespaceContextKey')

/** 使用派生命名空间 */
export const useGetDerivedNamespace = () => {
  const namespace = computed(() => {
    return defaultNamespace
  })
  return namespace
}

/**
 * 使用命名空间
 * @param block 块名
 */
export const useNamespace = (block: string) => {
  const namespace = useGetDerivedNamespace()

  // BEM 方法
  const b = (blockSuffix = '') => _bem(namespace.value, block, blockSuffix, '', '')
  const e = (element?: string) => (element ? _bem(namespace.value, block, '', element, '') : '')
  const m = (modifier?: string) => (modifier ? _bem(namespace.value, block, '', '', modifier) : '')
  const be = (blockSuffix?: string, element?: string) =>
    blockSuffix && element ? _bem(namespace.value, block, blockSuffix, element, '') : ''
  const em = (element?: string, modifier?: string) =>
    element && modifier ? _bem(namespace.value, block, '', element, modifier) : ''
  const bm = (blockSuffix?: string, modifier?: string) =>
    blockSuffix && modifier ? _bem(namespace.value, block, blockSuffix, '', modifier) : ''
  const bem = (blockSuffix?: string, element?: string, modifier?: string) =>
    blockSuffix && element && modifier
      ? _bem(namespace.value, block, blockSuffix, element, modifier)
      : ''

  /** 生成状态类名 */
  const is: {
    (name: string, state: boolean | undefined): string
    (name: string): string
  } = (name: string, ...args: [boolean | undefined] | []) => {
    const state = args.length >= 1 ? args[0]! : true
    return name && state ? `${statePrefix}${name}` : ''
  }

  // CSS 变量相关方法
  // --el-xxx: value;

  /** 生成 CSS 变量 */
  const cssVar = (object: Record<string, string>) => {
    const styles: Record<string, string> = {}
    for (const key in object) {
      if (object[key]) {
        styles[`--${namespace.value}-${key}`] = object[key]
      }
    }
    return styles
  }

  /** 生成带 block 的 CSS 变量 */
  const cssVarBlock = (object: Record<string, string>) => {
    const styles: Record<string, string> = {}
    for (const key in object) {
      if (object[key]) {
        styles[`--${namespace.value}-${block}-${key}`] = object[key]
      }
    }
    return styles
  }

  /** 生成 CSS 变量名 */
  const cssVarName = (name: string) => `--${namespace.value}-${name}`

  /** 生成带 block 的 CSS 变量名 */
  const cssVarBlockName = (name: string) => `--${namespace.value}-${block}-${name}`

  return {
    namespace,
    b,
    e,
    m,
    be,
    em,
    bm,
    bem,
    is,
    // css
    cssVar,
    cssVarName,
    cssVarBlock,
    cssVarBlockName,
  }
}

export type UseNamespaceReturn = ReturnType<typeof useNamespace>
