<template>
  <li
    v-show="visible"
    :id="id"
    :class="containerKls"
    role="option"
    :aria-disabled="isDisabled || undefined"
    :aria-selected="itemSelected"
    @mousemove="hoverItem"
    @click.stop="selectOptionClick"
  >
    <slot>
      <span>{{ currentLabel }}</span>
    </slot>
  </li>
</template>

<script lang="ts">
// getCurrentInstance 获取不了 defineExpose 输出的对象
import {
  computed,
  defineComponent,
  getCurrentInstance,
  nextTick,
  onBeforeUnmount,
  reactive,
  toRefs,
  unref,
  inject,
  type VNodeChild,
  type PropType,
} from 'vue'
import { useId, useNamespace } from '../utils/hooks'
import { useOption } from './useOption'
import type {
  ProOptionExposed,
  ProOptionInternalInstance,
  ProOptionStates,
  ProSelectContext,
} from './select.types'

export default defineComponent({
  name: 'ProOption',
  componentName: 'ProOption',
  props: {
    value: {
      type: [String, Number, Boolean, Object],
      required: true,
    },
    label: {
      type: [String, Number, Function] as PropType<VNodeChild>,
    },
    created: Boolean,
    disabled: Boolean,
    optionData: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const ns = useNamespace('select')
    const id = useId()
    const containerKls = computed(() => [
      ns.be('dropdown', 'item'),
      ns.is('disabled', unref(isDisabled)),
      ns.is('selected', unref(itemSelected)),
      ns.is('hovering', unref(hover)),
    ])
    const states = reactive<ProOptionStates>({
      index: -1,
      groupDisabled: false,
      visible: true,
      hover: false,
    })

    const { currentLabel, itemSelected, isDisabled, hoverItem, updateOption } = useOption(
      props,
      states,
    )
    const select = inject<ProSelectContext>('ProSelectData')!
    const { visible, hover } = toRefs(states)
    const vm = (getCurrentInstance()! as ProOptionInternalInstance).proxy

    select.onOptionCreate(vm)

    onBeforeUnmount(() => {
      const key = vm.value
      const { selected: selectedOptions } = select.states
      const doesSelected = selectedOptions.some((item) => {
        return item.value === vm.value
      })
      // if option is not selected, remove it from cache
      nextTick(() => {
        if (select.states.cachedOptions.get(key) === vm && !doesSelected) {
          select.states.cachedOptions.delete(key)
        }
      })
      select.onOptionDestroy(key, vm)
    })

    function selectOptionClick() {
      if (!isDisabled.value) {
        select.handleOptionSelect(vm)
      }
    }
    return {
      ns,
      id,
      containerKls,
      currentLabel,
      itemSelected,
      isDisabled,
      select,
      visible,
      hover,
      states,
      hoverItem,
      updateOption,
      selectOptionClick,
      optionData: props.optionData,
    } as ProOptionExposed
  },
})
</script>
