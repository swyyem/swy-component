<script lang="ts" setup>
/*
 * 自定义 select 组件
 * 1. 支持表格及分页
 * 2. 支持瀑布流加载
 * 3. 支持 vitrual
 *
 * table 的逻辑需要单独处理
 * modelValue 变化时，需要表格选中对应的行
 */
import { computed, reactive, provide, toRefs, watch, type Directive } from 'vue'
import {
  ElTag,
  ElTooltip,
  ElScrollbar,
  ElIcon,
  ClickOutside,
  ElCheckbox,
  type CheckboxValueType,
} from 'element-plus'
import { ArrowDown, CircleClose } from '@element-plus/icons-vue'
import { isArray, isUndefined } from '../utils'
import { useCalcInputWidth } from '../utils/hooks'
import ProTable, { type ProTableProps, type AnyObject } from '../proTable'
import { removeInternalKey } from '../proTable/utils'
import type {
  ProSelectEnhanceProps,
  ProSelectEmits,
  ProSelectContext,
  ProSelectDefaultProps,
  ProSelectScrollParams,
  ProSelectInstance,
} from './select.types'
import ProOption from './option.vue'
import ProOptions from './options'
import ProSelectDropdown from './selectDropdown.vue'
import { useSelect } from './useSelect'
import { useRequest } from './useRequest'
import { useCheck } from './useCheck'
import { UPDATE_MODEL_EVENT, CHANGE_EVENT } from '../utils/constants'
import { isEqual } from 'lodash-unified'

const vClickOutside: Directive = ClickOutside
defineOptions({
  name: 'ProSelect',
})

const props = withDefaults(defineProps<ProSelectEnhanceProps>(), {
  automaticDropdown: true,
  disabled: undefined,
  clearable: undefined,
  filterable: undefined,
  allowCreate: undefined,
  multiple: undefined,
  defaultFirstOption: undefined,
  collapseTagsTooltip: undefined,
  teleported: undefined,
  fitInputWidth: undefined,
  remoteShowSuffix: undefined,
  manualRequest: true,
  waterfall: false,
  showArrow: true,
  reserveKeyword: true,
  persistent: true,
  autocomplete: 'off',
  effect: 'light',
  popperClass: '',
  popperOptions: {},
  valueKey: 'value',
  multipleLimit: 0,
  maxCollapseTags: 1,
  clearIcon: CircleClose,
  suffixIcon: ArrowDown,
  tagType: 'info',
  tagEffect: 'light',
  validateEvent: true,
  offset: 12,
  placement: 'bottom-start',
  fallbackPlacements: () => ['bottom-start', 'top-start', 'right', 'left'],
  tabindex: 0,
  contentHeight: 274,
  keywordRequest: false,
  checkAll: false,
  checkAllText: '全部',
})
const emit = defineEmits<ProSelectEmits>()
const modelValue = computed(() => {
  const { modelValue: rawModelValue, multiple } = props
  const fallback = multiple ? [] : undefined
  if (isArray(rawModelValue)) {
    return multiple ? rawModelValue : fallback
  }
  return multiple ? fallback : rawModelValue
})
const computedHeight = computed(() => {
  const contentHeight = props.contentHeight
  return `${contentHeight}px`
})
const isTableMode = computed(() => !!props.tableProps)
const handleCurrentChange = (data: any) => {
  // 当键盘操作时会存在 undefined 场景
  if (isUndefined(data)) {
    return
  }
  // 多选不执行该逻辑
  if (props.multiple) {
    return
  }
  const rawData = data ? removeInternalKey(data) : data
  // const value = API.getValueKey({ value: rawData, currentLabel: '' })
  // const currentValue = API.getValueKey({ value: modelValue.value, currentLabel: '' })
  API.expanded.value = false
  // 初始化有值的场景下，会重复触发
  // if (value === currentValue) {
  //   return
  // }
  emit(UPDATE_MODEL_EVENT, rawData)
  // 触发 change 事件
  emit(CHANGE_EVENT, rawData)
  emit('keydown:enter')
}
const handleMultipleChange = (keys: PropertyKey[], rows: AnyObject[]) => {
  // 单选不执行
  if (!props.multiple) {
    return
  }
  if (isEqual(keys, selectKeys.value)) {
    return
  }
  const realRows = removeInternalKey(rows) || []
  emit(UPDATE_MODEL_EVENT, realRows)
  emit(CHANGE_EVENT, realRows)
}
// 获取选中的 rowData 中的 valueKey 对应的值，多选
const selectKeys = computed(() => {
  return API.states.selected.map(API.getValueKey)
})
// 获取 rowData，单选
const selectRowData = computed(() => {
  return props.modelValue
})
/*
 * 下拉框表格的逻辑
 * 多选使用 rowSelection 控制
 * 单选使用 currentSelectedRow 和 onCurrentChange 控制
 **/
const selectTableProps = computed(() => {
  return {
    pagination: false,
    waterfall: props.waterfall,
    rowKey: props.valueKey,
    highlightCurrentRow: !props.multiple,
    manualRequest: props.manualRequest,
    emptyText: props.keywordRequest ? '' : '暂无相关数据',
    params: paramsRef.value,
    ...(props.tableProps || {}),
    currentChangeRepeat: true,
    rowSelection: {
      type: props.multiple ? 'checkbox' : undefined,
      selectedRowKeys: selectKeys.value,
      reserveSelection: props.multiple,
      rowClick: true,
      onChange: handleMultipleChange,
    },
    currentSelectedRow: !props.multiple ? selectRowData.value : undefined,
    height: props.contentHeight,
    toolbar: false,
    onCurrentChange: handleCurrentChange,
  } as ProTableProps
})
const _props = reactive({
  ...toRefs(props),
  modelValue,
}) as ProSelectDefaultProps
const valueEnumRef = computed(() => props.valueEnum)
const paramsRef = computed(() => props.params || {})
const { onFetch, setPage, resetRequest, pageInfo, loading, first, valueEnum, getRealValue } =
  useRequest({
    valueKey: props.valueKey,
    manualRequest: props.manualRequest,
    request: props.remoteMethod,
    params: paramsRef,
    waterfall: props.waterfall,
    defaultValueEnum: props.defaultValueEnum,
    valueEnum: valueEnumRef,
    handleValueEnumChange: props.handleValueEnumChange,
  })

const handleScroll = (v: ProSelectScrollParams) => {
  const maxScroll = v.scrollHeight - v.clientHeight
  if (maxScroll > 32 && v.scrollTop > maxScroll - 32) {
    if (loading.value) {
      return
    }
    setPage({
      currentPage: (pageInfo.currentPage || 1) + 1,
    })
    // 加载下一页
    onFetch(API.states.inputValue)
  }
}
const API = useSelect(_props, emit, {
  onFetch,
  loading,
  first,
  resetRequest,
  onScroll: handleScroll,
  labelKey: props.labelKey,
  isTableMode: isTableMode,
  handleCurrentChange: handleCurrentChange,
  handleMultipleChange: handleMultipleChange,
})
// 监听 params
watch(paramsRef, () => {
  resetRequest()
  first.value = true
  // 清空值
  API.clearValueAndReset()
})
const CheckOption = useCheck(_props, emit, {
  valueEnum,
  getOptionDataList: API.getOptionDataList,
})
const handleCheckValue = (val: CheckboxValueType) => CheckOption.handleCheckAll(val)
const {
  popperRef,
  selectRef,
  tooltipRef,
  wrapperRef,
  selectionRef,
  tagTooltipRef,
  inputRef,
  collapseItemRef,
  prefixRef,
  tagMenuRef,
  suffixRef,
  menuRef,
  scrollbarRef,
  tableRef,
} = API
const poperSideRef = popperRef as any
const { calculatorRef, inputStyle } = useCalcInputWidth()
const context = {
  props: _props,
  states: API.states,
  selectRef: API.selectRef,
  optionsArray: API.optionsArray,
  setSelected: API.setSelected,
  handleOptionSelect: API.handleOptionSelect,
  onOptionCreate: API.onOptionCreate,
  onOptionDestroy: API.onOptionDestroy,
}
provide<ProSelectContext>('ProSelectData', context)
const selectedLabel = computed(() => {
  if (!props.multiple) {
    return API.states.selectedLabel
  }
  return API.states.selected.map((i) => i.currentLabel as string)
})
defineExpose<ProSelectInstance>({
  selectedLabel,
  getText: (v: any) => {
    return API.getOption(v).currentLabel
  },
  focus: API.focus,
  blur: API.blur,
})
</script>
<template>
  <div
    ref="selectRef"
    v-click-outside:[poperSideRef]="API.handleClickOutside"
    :class="[API.nsSelect.b(), API.nsSelect.m(API.selectSize.value)]"
    @mouseenter="API.states.inputHovering = true"
    @mouseleave="API.states.inputHovering = false"
  >
    <ElTooltip
      ref="tooltipRef"
      :visible="API.dropdownMenuVisible.value"
      :placement="props.placement"
      :teleported="props.teleported"
      :popper-class="[API.nsSelect.e('popper'), props.popperClass]"
      :popper-options="props.popperOptions"
      :fallback-placements="props.fallbackPlacements"
      :effect="props.effect"
      pure
      trigger="click"
      :transition="`${API.nsSelect.namespace.value}-zoom-in-top`"
      :stop-popper-mouse-event="false"
      :gpu-acceleration="false"
      :persistent="persistent"
      :append-to="appendTo"
      :show-arrow="showArrow"
      :offset="offset"
      @before-show="API.handleMenuEnter"
      @hide="API.states.isBeforeHide = false"
    >
      <template #default>
        <div
          ref="wrapperRef"
          :class="[
            API.nsSelect.e('wrapper'),
            API.nsSelect.is('focused', API.isFocused.value),
            API.nsSelect.is('hovering', API.states.inputHovering),
            API.nsSelect.is('filterable', props.filterable),
            API.nsSelect.is('disabled', API.selectDisabled.value),
          ]"
          @click.prevent="API.toggleMenu"
        >
          <div v-if="$slots.prefix" ref="prefixRef" :class="API.nsSelect.e('prefix')">
            <slot name="prefix" />
          </div>
          <div
            ref="selectionRef"
            :class="[
              API.nsSelect.e('selection'),
              API.nsSelect.is(
                'near',
                props.multiple && !$slots.prefix && !!API.states.selected.length,
              ),
            ]"
          >
            <slot v-if="props.multiple" name="tag">
              <div
                v-for="item in API.showTagList.value"
                :key="API.getValueKey(item)"
                :class="API.nsSelect.e('selected-item')"
              >
                <ElTag
                  :closable="!API.selectDisabled.value && !item.isDisabled"
                  :size="API.collapseTagSize.value"
                  :type="props.tagType"
                  :effect="props.tagEffect"
                  disable-transitions
                  :style="API.tagStyle.value"
                  @close="API.deleteTag($event, item)"
                >
                  <span :class="API.nsSelect.e('tags-text')">
                    <slot name="label" :label="item.currentLabel" :value="item.value">
                      {{ item.currentLabel }}
                    </slot>
                  </span>
                </ElTag>
              </div>

              <ElTooltip
                v-if="props.collapseTags && API.states.selected.length > maxCollapseTags"
                ref="tagTooltipRef"
                :disabled="API.dropdownMenuVisible.value || !props.collapseTagsTooltip"
                :fallback-placements="['bottom', 'top', 'right', 'left']"
                :effect="effect"
                placement="bottom"
                :teleported="teleported"
              >
                <template #default>
                  <div ref="collapseItemRef" :class="API.nsSelect.e('selected-item')">
                    <ElTag
                      :closable="false"
                      :size="API.collapseTagSize.value"
                      :type="props.tagType"
                      :effect="props.tagEffect"
                      disable-transitions
                      :style="API.collapseTagStyle.value"
                    >
                      <span :class="API.nsSelect.e('tags-text')">
                        + {{ API.states.selected.length - maxCollapseTags }}
                      </span>
                    </ElTag>
                  </div>
                </template>
                <template #content>
                  <div ref="tagMenuRef" :class="API.nsSelect.e('selection')">
                    <div
                      v-for="item in API.collapseTagList.value"
                      :key="API.getValueKey(item)"
                      :class="API.nsSelect.e('selected-item')"
                    >
                      <ElTag
                        class="in-tooltip"
                        :closable="!API.selectDisabled.value && !item.isDisabled"
                        :size="API.collapseTagSize.value"
                        :type="props.tagType"
                        :effect="props.tagEffect"
                        disable-transitions
                        @close="API.deleteTag($event, item)"
                      >
                        <span :class="API.nsSelect.e('tags-text')">
                          <slot name="label" :label="item.currentLabel" :value="item.value">
                            {{ item.currentLabel }}
                          </slot>
                        </span>
                      </ElTag>
                    </div>
                  </div>
                </template>
              </ElTooltip>
            </slot>
            <div
              :class="[
                API.nsSelect.e('selected-item'),
                API.nsSelect.e('input-wrapper'),
                API.nsSelect.is('hidden', !props.filterable),
              ]"
            >
              <input
                :id="API.inputId.value"
                ref="inputRef"
                v-model="API.states.inputValue"
                type="text"
                :name="name"
                :class="[API.nsSelect.e('input'), API.nsSelect.is(API.selectSize.value)]"
                :disabled="API.selectDisabled.value"
                :autocomplete="props.autocomplete"
                :style="inputStyle"
                :tabindex="tabindex"
                role="combobox"
                :readonly="!filterable"
                spellcheck="false"
                aria-autocomplete="none"
                aria-haspopup="listbox"
                @keydown.down.stop.prevent="API.navigateOptions('next')"
                @keydown.up.stop.prevent="API.navigateOptions('prev')"
                @keydown.esc.stop.prevent="API.handleEsc"
                @keydown.enter.stop.prevent="API.selectOption"
                @keydown.delete.stop="API.deletePrevTag"
                @compositionstart="API.handleCompositionStart"
                @compositionupdate="API.handleCompositionUpdate"
                @compositionend="API.handleCompositionEnd"
                @input="API.onInput"
                @click.stop="API.toggleMenu"
              />
              <span
                v-if="filterable"
                ref="calculatorRef"
                aria-hidden="true"
                :class="API.nsSelect.e('input-calculator')"
                v-text="API.states.inputValue"
              />
            </div>
            <div
              v-if="API.shouldShowPlaceholder.value"
              :class="[
                API.nsSelect.e('selected-item'),
                API.nsSelect.e('placeholder'),
                API.nsSelect.is(
                  'transparent',
                  !API.hasModelValue.value || (API.expanded.value && !API.states.inputValue),
                ),
              ]"
            >
              <slot
                v-if="API.hasModelValue.value"
                name="label"
                :label="API.currentPlaceholder.value"
                :value="modelValue"
              >
                <span>{{ API.currentPlaceholder }}</span>
              </slot>
              <span v-else>{{ API.currentPlaceholder }}</span>
            </div>
          </div>
          <div ref="suffixRef" :class="API.nsSelect.e('suffix')">
            <ElIcon
              v-if="API.iconComponent.value && !API.showClose.value"
              :class="[API.nsSelect.e('caret'), API.nsSelect.e('icon'), API.iconReverse.value]"
            >
              <component :is="API.iconComponent.value" />
            </ElIcon>
            <ElIcon
              v-if="API.showClose.value && props.clearIcon"
              :class="[API.nsSelect.e('caret'), API.nsSelect.e('icon'), API.nsSelect.e('clear')]"
              @click="API.handleClearClick"
            >
              <component :is="props.clearIcon" />
            </ElIcon>
            <ElIcon
              v-if="API.validateState.value && API.validateIcon.value && API.needStatusIcon.value"
              :class="[
                API.nsInput.e('icon'),
                API.nsInput.e('validateIcon'),
                API.nsInput.is('loading', API.validateState.value === 'validating'),
              ]"
            >
              <component :is="API.validateIcon.value" />
            </ElIcon>
          </div>
        </div>
      </template>
      <template #content>
        <ProSelectDropdown ref="menuRef">
          <template v-if="!isTableMode">
            <div
              v-if="$slots.header || CheckOption.checkStatus.value"
              :class="API.nsSelect.be('dropdown', 'header')"
              @click.stop
            >
              <template v-if="CheckOption.checkStatus.value">
                <el-checkbox
                  :label="props.checkAllText"
                  :modelValue="CheckOption.checkAll.value"
                  @update:modelValue="handleCheckValue"
                  :indeterminate="CheckOption.checkIndeterminate.value"
                />
              </template>
              <template v-else>
                <slot name="header" />
              </template>
            </div>
            <ElScrollbar
              v-show="API.states.options.size > 0"
              :id="API.contentId.value"
              ref="scrollbarRef"
              tag="ul"
              :wrap-class="API.nsSelect.be('dropdown', 'wrap')"
              :view-class="API.nsSelect.be('dropdown', 'list')"
              :class="[API.nsSelect.is('empty', API.filteredOptionsCount.value === 0)]"
              role="listbox"
              @scroll="API.popupScroll"
            >
              <ProOption
                v-if="API.showNewOption.value"
                :value="API.states.inputValue"
                :created="true"
              />
              <ProOptions>
                <ProOption
                  v-for="item in valueEnum"
                  :key="String(getRealValue(item))"
                  v-bind="item"
                  :optionData="item"
                />
              </ProOptions>
            </ElScrollbar>
            <div v-if="$slots.loading && loading" :class="API.nsSelect.be('dropdown', 'loading')">
              <slot name="loading" />
            </div>
            <div
              v-else-if="loading || API.filteredOptionsCount.value === 0"
              :class="API.nsSelect.be('dropdown', 'empty')"
            >
              <slot name="empty">
                <span>{{ API.emptyText }}</span>
              </slot>
            </div>
            <div v-if="$slots.footer" :class="API.nsSelect.be('dropdown', 'footer')" @click.stop>
              <slot name="footer" />
            </div>
          </template>
          <div v-else :style="{ height: computedHeight }">
            <ProTable ref="tableRef" v-bind="selectTableProps" />
          </div>
        </ProSelectDropdown>
      </template>
    </ElTooltip>
  </div>
</template>
