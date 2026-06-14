import { defineComponent, inject } from 'vue'
import { isEqual } from 'lodash-unified'
import type { Component, VNode, VNodeNormalizedChildren } from 'vue'
import { isArray, isFunction, isString } from '../utils'
import type { ProSelectContext, ProOptionValue } from './select.types'

export default defineComponent({
  name: 'ProOptions',
  setup(_, { slots }) {
    const select = inject<ProSelectContext>('ProSelectData')!
    let cachedValueList: ProOptionValue[] = []

    return () => {
      const children = slots.default?.() || []
      const valueList: ProOptionValue[] = []

      function filterOptions(children?: VNodeNormalizedChildren) {
        if (!isArray(children)) return
        ;(children as VNode[]).forEach((item) => {
          const name = ((item?.type || {}) as Component)?.name

          if (name === 'ProOptionGroup') {
            filterOptions(
              !isString(item.children) &&
                !isArray(item.children) &&
                isFunction(item.children?.default)
                ? item.children?.default()
                : item.children,
            )
          } else if (name === 'ProOption') {
            valueList.push(item.props?.value)
          } else if (isArray(item.children)) {
            filterOptions(item.children)
          }
        })
      }

      if (children.length) {
        filterOptions(children[0]?.children)
      }

      if (!isEqual(valueList, cachedValueList)) {
        cachedValueList = valueList
        if (select) {
          select.states.optionValues = valueList
        }
      }

      return children
    }
  },
})
