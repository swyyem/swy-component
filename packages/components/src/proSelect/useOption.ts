import { computed, getCurrentInstance, inject, toRaw, watch } from 'vue'
import { get, isEqual } from 'lodash-unified'
import { ensureArray, escapeStringRegexp, isObject, isFunction, throwError } from '../utils'
import type {
  ProOptionInternalInstance,
  ProOptionProps,
  ProOptionStates,
  ProSelectContext,
} from './select.types'
import type { AnyObject } from '../index'

export function useOption(props: ProOptionProps, states: ProOptionStates) {
  // inject
  const select = inject<ProSelectContext>('ProSelectData')
  if (!select) {
    throwError('ProOption', 'usage: <pro-select><pro-option /></pro-select/>')
  }
  const selectGroup = inject('ProSelectGroupData', { disabled: false })

  // computed
  const itemSelected = computed(() => {
    return contains(ensureArray(select.props.modelValue), props.value)
  })

  const limitReached = computed(() => {
    if (select.props.multiple) {
      const modelValue = ensureArray(select.props.modelValue ?? [])
      return (
        !itemSelected.value &&
        modelValue.length >= select.props.multipleLimit &&
        select.props.multipleLimit > 0
      )
    } else {
      return false
    }
  })

  const currentLabel = computed(() => {
    return props.label || (isObject(props.value) ? '' : props.value) || ''
  })

  const currentValue = computed(() => {
    return props.value || props.label || ''
  })

  const isDisabled = computed(() => {
    return props.disabled || states.groupDisabled || limitReached.value
  })

  const instance = getCurrentInstance()! as ProOptionInternalInstance
  const contains = <T>(arr: T[] = [], target: T) => {
    if (!isObject(props.value)) {
      return arr && arr.includes(target)
    } else {
      const valueKey = select.props.valueKey
      return (
        arr &&
        arr.some((item) => {
          return toRaw(get(item, valueKey)) === get(target, valueKey)
        })
      )
    }
  }

  const hoverItem = () => {
    if (!props.disabled && !selectGroup.disabled) {
      const idx = select.optionsArray.value.indexOf(instance.proxy)
      select.states.hoveringIndex = idx
    }
  }

  const updateOption = (query: string) => {
    const regexp = new RegExp(escapeStringRegexp(query), 'i')
    states.visible = regexp.test(String(currentLabel.value)) || props.created || false
  }

  watch(
    () => currentLabel.value,
    () => {
      const remote = isFunction(select.props.remoteMethod)
      if (!props.created && !remote) select.setSelected()
    },
  )

  watch(
    () => props.value,
    (val, oldVal) => {
      const { valueKey } = select.props
      const remote = isFunction(select.props.remoteMethod)
      const shouldUpdate = remote ? val !== oldVal : !isEqual(val, oldVal)
      if (shouldUpdate) {
        select.onOptionDestroy(oldVal, instance.proxy)
        select.onOptionCreate(instance.proxy)
      }

      if (!props.created && !remote) {
        if (valueKey && isObject(val) && isObject(oldVal)) {
          if ((val as AnyObject)[valueKey] === (oldVal as AnyObject)[valueKey]) {
            return
          }
        }
        select.setSelected()
      }
    },
  )

  watch(
    () => selectGroup.disabled,
    () => {
      states.groupDisabled = selectGroup.disabled
    },
    { immediate: true },
  )

  return {
    currentLabel,
    currentValue,
    itemSelected,
    isDisabled,
    hoverItem,
    updateOption,
  }
}
