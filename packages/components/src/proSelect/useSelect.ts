import {
  type Component,
  computed,
  nextTick,
  onMounted,
  reactive,
  ref,
  watch,
  watchEffect,
  type Ref,
  type ComputedRef,
} from 'vue'
import { findLastIndex, get, isEqual, debounce as lodashDebounce } from 'lodash-unified'
import { useResizeObserver } from '@vueuse/core'
import { useFormItem, useFormItemInputId, useFormSize, useLocale } from 'element-plus'
import type { ScrollbarInstance, TooltipInstance } from 'element-plus'
import {
  ValidateComponentsMap,
  debugWarn,
  ensureArray,
  isArray,
  isClient,
  isFunction,
  isNumber,
  isObject,
  isPlainObject,
  isUndefined,
  scrollIntoView,
} from '../utils'
import { CHANGE_EVENT, EVENT_CODE, UPDATE_MODEL_EVENT, UPDATE_OPTION } from '../utils/constants'
import {
  useComposition,
  useEmptyValues,
  useFocusController,
  useId,
  useNamespace,
} from '../utils/hooks'
import type { AnyObject } from '../index'
import type { ProTableInstance } from '../proTable'
import type {
  ProSelectDefaultProps,
  ProSelectEnhanceProps,
  ProSelectEmits,
  ProOptionPublicInstance,
  ProOptionValue,
  ProSelectStates,
  ProSelectScrollParams,
} from './select.types'
import type { ProSchemaValueEnumType } from '../proField'

export const useSelect = (
  props: ProSelectDefaultProps,
  emit: ProSelectEmits,
  options: {
    loading: Ref<boolean>
    first: Ref<boolean>
    resetRequest: () => void
    onFetch: (v?: any) => void
    onScroll: (v: ProSelectScrollParams) => void
    labelKey: ProSelectEnhanceProps['labelKey']
    isTableMode: ComputedRef<boolean>
    handleCurrentChange: (rowData: any) => void
    handleMultipleChange: (keys: PropertyKey[], rows: AnyObject[]) => void
  },
) => {
  const { t } = useLocale()
  const contentId = useId()
  const nsSelect = useNamespace('select')
  const nsInput = useNamespace('input')
  const getLabelKey = computed(() => {
    if (isFunction(props.labelKey)) {
      return props.labelKey
    }
    const labelKey = props.labelKey || 'label'
    return (item: AnyObject) => item && item[labelKey]
  })

  const states = reactive<ProSelectStates>({
    inputValue: props.keyword || '',
    options: new Map(),
    cachedOptions: new Map(),
    optionValues: [], // sorted value of options
    selected: [],
    selectionWidth: 0,
    collapseItemWidth: 0,
    selectedLabel: '',
    hoveringIndex: -1,
    previousQuery: null,
    inputHovering: false,
    menuVisibleOnFocus: false,
    isBeforeHide: false,
  })

  // template refs
  const selectRef = ref<HTMLElement>()
  const selectionRef = ref<HTMLElement>()
  const tooltipRef = ref<TooltipInstance>()
  const tagTooltipRef = ref<TooltipInstance>()
  const inputRef = ref<HTMLInputElement>()
  const prefixRef = ref<HTMLElement>()
  const suffixRef = ref<HTMLElement>()
  const menuRef = ref<HTMLElement>()
  const tagMenuRef = ref<HTMLElement>()
  const collapseItemRef = ref<HTMLElement>()
  const scrollbarRef = ref<ScrollbarInstance>()
  const tableRef = ref<ProTableInstance<AnyObject>>()

  const { isComposing, handleCompositionStart, handleCompositionUpdate, handleCompositionEnd } =
    useComposition({
      afterComposition: (e) => onInput(e),
    })

  const { wrapperRef, isFocused, handleBlur } = useFocusController(inputRef, {
    beforeFocus() {
      return selectDisabled.value
    },
    afterFocus() {
      if (props.automaticDropdown && !expanded.value) {
        expanded.value = true
        states.menuVisibleOnFocus = true
      }
    },
    beforeBlur(event) {
      return (
        tooltipRef.value?.isFocusInsideContent(event) ||
        tagTooltipRef.value?.isFocusInsideContent(event)
      )
    },
    afterBlur() {
      expanded.value = false
      states.menuVisibleOnFocus = false
      if (props.validateEvent) {
        formItem?.validate?.('blur').catch((err) => debugWarn(err))
      }
    },
  })

  // the controller of the expanded popup
  const expanded = ref(false)
  const hoverOption = ref()

  const { form, formItem } = useFormItem()
  const { inputId } = useFormItemInputId(props, {
    formItemContext: formItem,
  })
  const { valueOnClear, isEmptyValue } = useEmptyValues(props)

  const selectDisabled = computed(() => props.disabled || form?.disabled)

  const hasModelValue = computed(() => {
    return isArray(props.modelValue) ? props.modelValue.length > 0 : !isEmptyValue(props.modelValue)
  })

  const needStatusIcon = computed(() => form?.statusIcon ?? false)

  const showClose = computed(() => {
    return props.clearable && !selectDisabled.value && states.inputHovering && hasModelValue.value
  })
  // 传入了 remoteMethod，则认为是远程请求
  const remote = computed(() => {
    if (options.isTableMode.value) {
      return isFunction(props.tableProps?.request)
    }
    return isFunction(props.remoteMethod)
  })
  const iconComponent = computed(() =>
    remote.value && props.filterable && !props.remoteShowSuffix ? '' : props.suffixIcon,
  )
  const iconReverse = computed(() =>
    nsSelect.is('reverse', !!(iconComponent.value && expanded.value)),
  )

  const validateState = computed(() => formItem?.validateState || '')
  const validateIcon = computed(
    () => validateState.value && (ValidateComponentsMap[validateState.value] as Component),
  )

  const debounce = computed(() => (remote.value ? 300 : 0))

  const isRemoteSearchEmpty = computed(() => {
    const res = props.keywordRequest && remote.value && !states.inputValue
    if (options.isTableMode.value) {
      return res && tableRef.value?.getTableDataSize() === 0
    }
    return res && states.options.size === 0
  })

  const emptyText = computed(() => {
    if (options.loading.value) {
      return props.loadingText || t('el.select.loading')
    } else {
      if (
        props.filterable &&
        states.inputValue &&
        states.options.size > 0 &&
        filteredOptionsCount.value === 0
      ) {
        return props.noMatchText || t('el.select.noMatch')
      }
      if (states.options.size === 0) {
        return props.noDataText || t('el.select.noData')
      }
    }
    return null
  })

  const filteredOptionsCount = computed(
    () => optionsArray.value.filter((option) => option.visible).length,
  )

  const optionsArray = computed(() => {
    const list = Array.from(states.options.values())
    const newList: ProOptionPublicInstance[] = []
    states.optionValues.forEach((item) => {
      const index = list.findIndex((i) => i.value === item)
      if (index > -1) {
        newList.push(list[index])
      }
    })
    return newList.length >= list.length ? newList : list
  })

  const cachedOptionsArray = computed(() => Array.from(states.cachedOptions.values()))

  const showNewOption = computed(() => {
    const hasExistingOption = optionsArray.value
      .filter((option) => {
        return !option.created
      })
      .some((option) => {
        return option.currentLabel === states.inputValue
      })
    return props.filterable && props.allowCreate && states.inputValue !== '' && !hasExistingOption
  })

  const updateOptions = () => {
    // 开启了筛选不处理
    if (props.filterable && isFunction(props.filterMethod)) {
      return
    }
    // 开启了远程请求，不处理
    if (props.filterable && remote.value && isFunction(props.remoteMethod)) {
      return
    }
    // 本地数据筛选处理逻辑
    optionsArray.value.forEach((option) => {
      option.updateOption?.(states.inputValue)
    })
  }

  const selectSize = useFormSize()

  const collapseTagSize = computed(() =>
    ['small'].includes(selectSize.value) ? 'small' : 'default',
  )

  const dropdownMenuVisible = computed({
    get() {
      return expanded.value && !isRemoteSearchEmpty.value
    },
    set(val: boolean) {
      expanded.value = val
    },
  })

  const shouldShowPlaceholder = computed(() => {
    if (props.multiple && !isUndefined(props.modelValue)) {
      return ensureArray(props.modelValue).length === 0 && !states.inputValue
    }
    const value = isArray(props.modelValue) ? props.modelValue[0] : props.modelValue
    return props.filterable || isUndefined(value) ? !states.inputValue : true
  })

  const currentPlaceholder = computed(() => {
    const _placeholder = props.placeholder ?? t('el.select.placeholder')
    const val = props.multiple || !hasModelValue.value ? _placeholder : states.selectedLabel
    return val
  })

  const mouseEnterEventName = computed(() => 'mouseenter')

  watch(
    () => props.modelValue,
    (val, oldVal) => {
      // console.log('=watch modelValue=', val, oldVal)
      if (props.multiple) {
        if (props.filterable && !props.reserveKeyword) {
          // states.inputValue = ''
          setInputValue('')
          handleQueryChange('')
        }
      }
      setSelected()
      if (!isEqual(val, oldVal) && props.validateEvent) {
        formItem?.validate('change').catch((err) => debugWarn(err))
      }
    },
    {
      flush: 'post',
      deep: true,
    },
  )

  watch(
    () => expanded.value,
    (val) => {
      if (val) {
        // 只能放在 val 内部
        if (!props.keywordRequest) {
          // 开启手动请求，第一次展开需要调用请求
          if (props.manualRequest) {
            if (options.isTableMode.value) {
              tableRef.value?.selectFetch(() => handleQueryChange(states.inputValue))
            } else if (options.first.value) {
              if (!options.loading.value) {
                options.onFetch(states.inputValue)
              }
            } else {
              handleQueryChange(states.inputValue)
            }
          }
        }
      } else {
        setInputValue('')
        // options.resetRequest()
        clearTableData()
        // states.inputValue = ''
        states.previousQuery = null
        states.isBeforeHide = true
      }
      emit('visible-change', val)
    },
  )

  watch(
    // fix `Array.prototype.push/splice/..` cannot trigger non-deep watcher
    // https://github.com/vuejs/vue-next/issues/2116
    () => states.options.entries(),
    () => {
      if (!isClient) return
      // tooltipRef.value?.updatePopper?.()
      setSelected()
      if (
        props.defaultFirstOption &&
        (props.filterable || remote.value) &&
        filteredOptionsCount.value
      ) {
        checkDefaultFirstOption()
      }
    },
    {
      flush: 'post',
    },
  )

  watch([() => states.hoveringIndex, optionsArray], ([val]) => {
    if (isNumber(val) && val > -1) {
      hoverOption.value = optionsArray.value[val] || {}
    } else {
      hoverOption.value = {}
    }
    optionsArray.value.forEach((option) => {
      option.hover = hoverOption.value === option
    })
  })

  watchEffect(() => {
    // Anything could cause options changed, then update options
    // If you want to control it by condition, write here
    if (states.isBeforeHide) return
    updateOptions()
  })

  watch(
    () => props.keyword,
    (val) => {
      const realVal = val || ''
      if (realVal !== states.inputValue) {
        setInputValue(realVal)
      }
    },
  )
  // 清空表格的数据
  const clearTableData = () => {
    if (props.keywordRequest && options.isTableMode.value) {
      tableRef.value?.setData([], true)
    }
  }

  // 设置 input 值
  const setInputValue = (val: string) => {
    if (val !== states.inputValue) {
      states.inputValue = val
      emit('update:keyword', val)
    }
  }

  const handleQueryChange = (val: string) => {
    if (states.previousQuery === val || isComposing.value) {
      return
    }
    states.previousQuery = val
    if (options.isTableMode.value) {
      if (props.filterable) {
        // 为空则不搜索
        if (props.keywordRequest && val === '') {
          clearTableData()
          return
        }
        tableRef.value?.onSearch({
          keyword: val,
        })
        return
      }
    }
    if (props.filterable && isFunction(props.filterMethod)) {
      props.filterMethod(val)
    } else if (props.filterable && isFunction(props.remoteMethod)) {
      // 如果是关键字搜索，瀑布流场景需要重置请求相关参数
      options.resetRequest()
      options.onFetch(val)
    }
    if (
      props.defaultFirstOption &&
      (props.filterable || remote.value) &&
      filteredOptionsCount.value
    ) {
      nextTick(checkDefaultFirstOption)
    } else {
      nextTick(updateHoveringIndex)
    }
  }

  /**
   * find and highlight first option as default selected
   * @remark
   * - if the first option in dropdown list is user-created,
   *   it would be at the end of the optionsArray
   *   so find it and set hover.
   *   (NOTE: there must be only one user-created option in dropdown list with query)
   * - if there's no user-created option in list, just find the first one as usual
   *   (NOTE: exclude options that are disabled or in disabled-group)
   */
  const checkDefaultFirstOption = () => {
    const optionsInDropdown = optionsArray.value.filter(
      (n) => n.visible && !n.disabled && !n.states.groupDisabled,
    )
    const userCreatedOption = optionsInDropdown.find((n) => n.created)
    const firstOriginOption = optionsInDropdown[0]
    const valueList = optionsArray.value.map((item) => item.value)
    states.hoveringIndex = getValueIndex(valueList, userCreatedOption || firstOriginOption)
  }

  const getOptionDataList = (values?: ProSelectDefaultProps['modelValue']) => {
    const arr: ProSchemaValueEnumType[] = []
    ensureArray(values || []).forEach((value) => {
      for (let i = states.cachedOptions.size - 1; i >= 0; i--) {
        const cachedOption = cachedOptionsArray.value[i]
        const isEqualValue = isPlainObject(value)
          ? get(cachedOption.value, props.valueKey) === get(value, props.valueKey)
          : cachedOption.value === value
        if (isEqualValue) {
          arr.push(cachedOption.optionData)
        }
      }
    })
    return arr
  }

  const setSelected = () => {
    if (!props.multiple) {
      const value = isArray(props.modelValue) ? props.modelValue[0] : props.modelValue
      const option = getOption(value)
      states.selectedLabel = option.currentLabel
      states.selected = [option]
      return
    } else {
      states.selectedLabel = ''
    }
    const result: ProSelectStates['selected'] = []
    if (!isUndefined(props.modelValue)) {
      ensureArray(props.modelValue).forEach((value, idx) => {
        result.push(getOption(value, idx))
      })
    }
    states.selected = result
  }

  const getOption = (value: ProOptionValue, index?: number) => {
    let option
    const isObjectValue = isPlainObject(value)

    if (options.isTableMode.value) {
      option = {
        value,
        currentLabel: isObjectValue && getLabelKey.value(value),
      }
    } else {
      for (let i = states.cachedOptions.size - 1; i >= 0; i--) {
        const cachedOption = cachedOptionsArray.value[i]
        const isEqualValue = isObjectValue
          ? get(cachedOption.value, props.valueKey) === get(value, props.valueKey)
          : cachedOption.value === value
        if (isEqualValue) {
          option = {
            value,
            currentLabel: cachedOption.currentLabel,
            get isDisabled() {
              return cachedOption.isDisabled
            },
          }
          break
        }
      }
    }
    if (option) return option
    let label
    if (isObjectValue) {
      label = getLabelKey.value(value)
    }
    if (!label && props.defaultLabel) {
      label = isArray(props.defaultLabel) ? props.defaultLabel[index || 0] : props.defaultLabel
    }
    if (!label) {
      label = value ?? ''
    }
    // const label = isObjectValue
    //   ? getLabelKey.value(value)
    //   : props.defaultLabel
    //     ? props.defaultLabel
    //     : (value ?? '')
    const newOption = {
      value,
      currentLabel: label,
    }
    return newOption
  }

  const updateHoveringIndex = () => {
    states.hoveringIndex = optionsArray.value.findIndex((item) =>
      states.selected.some((selected) => getValueKey(selected) === getValueKey(item)),
    )
  }

  const resetSelectionWidth = () => {
    states.selectionWidth = Number.parseFloat(window.getComputedStyle(selectionRef.value!).width)
  }

  const resetCollapseItemWidth = () => {
    states.collapseItemWidth = collapseItemRef.value!.getBoundingClientRect().width
  }

  const updateTooltip = () => {
    tooltipRef.value?.updatePopper?.()
  }

  const updateTagTooltip = () => {
    tagTooltipRef.value?.updatePopper?.()
  }

  const onInputChange = () => {
    if (states.inputValue.length > 0 && !expanded.value) {
      expanded.value = true
    }
    handleQueryChange(states.inputValue)
  }

  const onInput = (event: Event) => {
    setInputValue((event.target as HTMLInputElement).value)
    // states.inputValue = (event.target as HTMLInputElement).value
    if (remote.value) {
      debouncedOnInputChange()
    } else {
      return onInputChange()
    }
  }

  const debouncedOnInputChange = lodashDebounce(() => {
    onInputChange()
  }, debounce.value)

  const emitChange = (val: ProOptionValue | ProOptionValue[]) => {
    if (!isEqual(props.modelValue, val)) {
      emit(CHANGE_EVENT, val)
    }
  }
  const clearValueAndReset = () => {
    const value = props.multiple ? [] : valueOnClear.value
    if (props.multiple) {
      for (const item of states.selected) {
        if (item.isDisabled) value.push(item.value)
      }
    }
    emit(UPDATE_MODEL_EVENT, value)
    emit(UPDATE_OPTION, undefined)
    emitChange(value)
    states.hoveringIndex = -1
    expanded.value = false
  }
  // 根据 value 获取 option 实例
  const getOptionByValue = (value: any[]) => {
    const res = value
      .map((v: any) => {
        const option = states.cachedOptions.get(v)
        return option ? option.optionData : null
      })
      .filter((it) => !!it)
    return res
  }

  const getLastNotDisabledIndex = (value: ProOptionValue[]) =>
    findLastIndex(value, (it) => {
      const option = states.cachedOptions.get(it)
      return option && !option.disabled && !option.states.groupDisabled
    })

  const deletePrevTag = (e: KeyboardEvent) => {
    if (!props.multiple) return
    if (e.code === EVENT_CODE.delete) return
    if ((e.target as HTMLInputElement).value.length <= 0) {
      const value = ensureArray(props.modelValue).slice()
      const lastNotDisabledIndex = getLastNotDisabledIndex(value)
      if (lastNotDisabledIndex < 0) return
      const removeTagValue = value[lastNotDisabledIndex]
      value.splice(lastNotDisabledIndex, 1)
      emit(UPDATE_MODEL_EVENT, value)
      emit(UPDATE_OPTION, getOptionByValue(value))
      emitChange(value)
      emit('remove-tag', removeTagValue)
    }
  }

  const deleteTag = (
    event: MouseEvent,
    tag: ProOptionPublicInstance | ProSelectStates['selected'][0],
  ) => {
    const index = states.selected.indexOf(tag)
    if (index > -1 && !selectDisabled.value) {
      const value = ensureArray(props.modelValue).slice()
      value.splice(index, 1)
      emit(UPDATE_MODEL_EVENT, value)
      emit(UPDATE_OPTION, getOptionByValue(value))
      emitChange(value)
      emit('remove-tag', tag.value)
    }
    event.stopPropagation()
    focus()
  }

  const deleteSelected = (event: Event) => {
    event.stopPropagation()
    const value = props.multiple ? [] : valueOnClear.value
    if (props.multiple) {
      for (const item of states.selected) {
        if (item.isDisabled) value.push(item.value)
      }
    }
    emit(UPDATE_MODEL_EVENT, value)
    emit(UPDATE_OPTION, undefined)
    emitChange(value)
    states.hoveringIndex = -1
    expanded.value = false
    emit('clear')
    focus()
  }
  // 表格模式不会执行，点击 option 的处理
  const handleOptionSelect = (option: ProOptionPublicInstance) => {
    if (props.multiple) {
      const value = ensureArray(props.modelValue ?? []).slice()
      const optionDataList = getOptionDataList(value)
      const optionIndex = getValueIndex(value, option)
      if (optionIndex > -1) {
        value.splice(optionIndex, 1)
        optionDataList.splice(optionIndex, 1)
      } else if (props.multipleLimit <= 0 || value.length < props.multipleLimit) {
        value.push(option.value)
        optionDataList.push(option.optionData)
      }
      emit(UPDATE_MODEL_EVENT, value)
      emit(UPDATE_OPTION, optionDataList)
      emitChange(value)
      if (option.created) {
        handleQueryChange('')
      }
      if (props.filterable && !props.reserveKeyword) {
        setInputValue('')
        // states.inputValue = ''
      }
    } else {
      emit(UPDATE_MODEL_EVENT, option.value)
      emit(UPDATE_OPTION, option.optionData)
      emitChange(option.value)
      emit('keydown:enter')
      expanded.value = false
    }
    // focus()
    if (expanded.value) return
    nextTick(() => {
      scrollToOption(option)
    })
  }

  const getValueIndex = (arr: ProOptionValue[], option: ProOptionPublicInstance) => {
    if (isUndefined(option)) return -1
    if (!isObject(option.value)) return arr.indexOf(option.value)

    return arr.findIndex((item) => {
      return isEqual(get(item, props.valueKey), getValueKey(option))
    })
  }

  const scrollToOption = (
    option: ProOptionPublicInstance | ProOptionPublicInstance[] | ProSelectStates['selected'],
  ) => {
    const targetOption = isArray(option) ? option[0] : option
    let target = null

    if (targetOption?.value) {
      const options = optionsArray.value.filter((item) => item.value === targetOption.value)
      if (options.length > 0) {
        target = options[0].$el
      }
    }

    if (tooltipRef.value && target) {
      const menu = tooltipRef.value?.popperRef?.contentRef?.querySelector?.(
        `.${nsSelect.be('dropdown', 'wrap')}`,
      )
      if (menu) {
        scrollIntoView(menu as HTMLElement, target)
      }
    }
    scrollbarRef.value?.handleScroll()
  }
  // option实例时保存对应的实例
  const onOptionCreate = (vm: ProOptionPublicInstance) => {
    states.options.set(vm.value, vm)
    states.cachedOptions.set(vm.value, vm)
  }

  const onOptionDestroy = (key: ProOptionValue, vm: ProOptionPublicInstance) => {
    if (states.options.get(key) === vm) {
      states.options.delete(key)
    }
  }

  const popperRef = computed(() => {
    return tooltipRef.value?.popperRef?.contentRef
  })

  const handleMenuEnter = () => {
    states.isBeforeHide = false
    nextTick(() => {
      if (options.isTableMode.value) {
        tableRef.value?.updateRow()
        return
      }
      scrollbarRef.value?.update()
      scrollToOption(states.selected)
    })
  }

  const focus = () => {
    inputRef.value?.focus()
  }

  const blur = () => {
    if (expanded.value) {
      expanded.value = false
      nextTick(() => inputRef.value?.blur())
      return
    }
    inputRef.value?.blur()
  }

  const handleClearClick = (event: Event) => {
    deleteSelected(event)
  }

  const handleClickOutside = (event: Event) => {
    expanded.value = false

    if (isFocused.value) {
      const _event = new FocusEvent('focus', event)
      nextTick(() => handleBlur(_event))
    }
  }

  const handleEsc = () => {
    if (states.inputValue.length > 0) {
      // states.inputValue = ''
      setInputValue('')
    } else {
      expanded.value = false
    }
  }

  const toggleMenu = () => {
    if (selectDisabled.value) return

    // We only set the inputHovering state to true on mouseenter event on iOS devices
    // To keep the state updated we set it here to true
    // if (isIOS) states.inputHovering = true

    if (states.menuVisibleOnFocus) {
      // controlled by automaticDropdown
      states.menuVisibleOnFocus = false
    } else {
      expanded.value = !expanded.value
    }
  }

  // 获取选中的 value
  const getKeysByValue = (row: any) => {
    const valueKey = props.valueKey
    const values = ensureArray(row).slice()
    return values.map((i) =>
      valueKey && isPlainObject(i) ? (i as Record<string, any>)[valueKey] : i,
    )
  }
  // 回车键触发
  const selectOption = () => {
    if (!expanded.value) {
      toggleMenu()
    } else {
      if (!dropdownMenuVisible.value) {
        return
      }
      // 表格单独处理
      if (options.isTableMode.value) {
        const rowData = tableRef.value?.setNavigateRow()
        if (!rowData) {
          return
        }
        const values = ensureArray(props.modelValue).slice()
        if (props.multiple) {
          const keys = getKeysByValue(values)
          const curKey = getKeysByValue(rowData)[0]
          const exist = keys.includes(curKey)
          // console.log('=select option11=', rowData, curKey, keys)
          // 存在则取消
          if (exist) {
            keys.splice(keys.indexOf(curKey), 1)
            values.splice(keys.indexOf(curKey), 1)
          } else {
            keys.push(curKey)
            values.push(rowData)
          }
          // console.log('=select option22=', keys, values)
          options.handleMultipleChange(keys, values)
        } else {
          options.handleCurrentChange(rowData)
        }
        // focus()
        return
      }
      const option = optionsArray.value[states.hoveringIndex]
      if (option && !option.isDisabled) {
        handleOptionSelect(option)
        // 单选场景
        // if (!props.multiple) {
        //   emit('keydown:enter')
        // }
      }
    }
  }

  const getValueKey = (item: ProOptionPublicInstance | ProSelectStates['selected'][0]) => {
    return isObject(item.value) ? get(item.value, props.valueKey) : item.value
  }

  const optionsAllDisabled = computed(() =>
    optionsArray.value.filter((option) => option.visible).every((option) => option.isDisabled),
  )

  const showTagList = computed(() => {
    if (!props.multiple) {
      return []
    }
    return props.collapseTags ? states.selected.slice(0, props.maxCollapseTags) : states.selected
  })

  const collapseTagList = computed(() => {
    if (!props.multiple) {
      return []
    }
    return props.collapseTags ? states.selected.slice(props.maxCollapseTags) : []
  })

  // 键盘上下移动
  const navigateOptions = (direction: 'prev' | 'next') => {
    if (!expanded.value) {
      expanded.value = true
      return
    }

    if (
      (states.options.size === 0 || filteredOptionsCount.value === 0 || isComposing.value) &&
      !options.isTableMode.value
    ) {
      return
    }
    // 如果是表格
    if (options.isTableMode.value && tableRef.value) {
      tableRef.value.navigateRow(direction)
      return
    }

    if (!optionsAllDisabled.value) {
      if (direction === 'next') {
        states.hoveringIndex++
        if (states.hoveringIndex === states.options.size) {
          states.hoveringIndex = 0
        }
      } else if (direction === 'prev') {
        states.hoveringIndex--
        if (states.hoveringIndex < 0) {
          states.hoveringIndex = states.options.size - 1
        }
      }
      const option = optionsArray.value[states.hoveringIndex]
      if (option.isDisabled || !option.visible) {
        navigateOptions(direction)
      }
      nextTick(() => scrollToOption(hoverOption.value))
    }
  }

  const getGapWidth = () => {
    if (!selectionRef.value) return 0
    const style = window.getComputedStyle(selectionRef.value)
    return Number.parseFloat(style.gap || '6px')
  }

  // computed style
  const tagStyle = computed(() => {
    const gapWidth = getGapWidth()
    const maxWidth =
      collapseItemRef.value && props.maxCollapseTags === 1
        ? states.selectionWidth - states.collapseItemWidth - gapWidth
        : states.selectionWidth
    return { maxWidth: `${maxWidth}px` }
  })

  const collapseTagStyle = computed(() => {
    return { maxWidth: `${states.selectionWidth}px` }
  })

  const popupScroll = (data: { scrollLeft: number; scrollTop: number }) => {
    const { scrollLeft, scrollTop } = data
    let scrollHeight = 0
    let scrollWidth = 0
    let clientHeight = 0
    let clientWidth = 0
    if (scrollbarRef.value?.wrapRef) {
      scrollHeight = scrollbarRef.value.wrapRef.scrollHeight
      scrollWidth = scrollbarRef.value.wrapRef.scrollWidth
      clientHeight = scrollbarRef.value.wrapRef.clientHeight
      clientWidth = scrollbarRef.value.wrapRef.clientWidth
    }
    const params = {
      scrollLeft,
      scrollTop,
      scrollHeight,
      scrollWidth,
      clientHeight,
      clientWidth,
    }
    if (props.waterfall) {
      options.onScroll?.(params)
    }
    emit('popup-scroll', params)
  }

  useResizeObserver(selectionRef, resetSelectionWidth)
  useResizeObserver(menuRef, updateTooltip)
  useResizeObserver(wrapperRef, updateTooltip)
  useResizeObserver(tagMenuRef, updateTagTooltip)
  useResizeObserver(collapseItemRef, resetCollapseItemWidth)

  onMounted(() => {
    setSelected()
  })

  return {
    inputId,
    contentId,
    nsSelect,
    nsInput,
    states,
    isFocused,
    expanded,
    optionsArray,
    hoverOption,
    selectSize,
    filteredOptionsCount,
    getOptionDataList,
    updateTooltip,
    updateTagTooltip,
    debouncedOnInputChange,
    onInput,
    deletePrevTag,
    deleteTag,
    deleteSelected,
    handleOptionSelect,
    scrollToOption,
    hasModelValue,
    shouldShowPlaceholder,
    currentPlaceholder,
    mouseEnterEventName,
    needStatusIcon,
    showClose,
    iconComponent,
    iconReverse,
    validateState,
    validateIcon,
    showNewOption,
    updateOptions,
    collapseTagSize,
    setSelected,
    selectDisabled,
    emptyText,
    getOption,
    handleCompositionStart,
    handleCompositionUpdate,
    handleCompositionEnd,
    onOptionCreate,
    onOptionDestroy,
    handleMenuEnter,
    focus,
    blur,
    handleClearClick,
    handleClickOutside,
    handleEsc,
    toggleMenu,
    selectOption,
    getValueKey,
    navigateOptions,
    dropdownMenuVisible,
    showTagList,
    collapseTagList,
    popupScroll,
    clearValueAndReset,

    // computed style
    tagStyle,
    collapseTagStyle,

    // DOM ref
    popperRef,
    inputRef,
    tooltipRef,
    tagTooltipRef,
    prefixRef,
    suffixRef,
    selectRef,
    wrapperRef,
    selectionRef,
    scrollbarRef,
    menuRef,
    tagMenuRef,
    collapseItemRef,
    tableRef,
  }
}
