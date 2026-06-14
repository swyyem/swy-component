<template>
  <div class="pro-transfer" :style="wrapStyle">
    <!-- @vue-generic {T} -->
    <ProTransferPanel
      :checked="leftChecked"
      :data="leftData"
      :valueKey="props.valueKey"
      :tableProps="props.tableProps"
      :checkedChange="handleLeftChecked"
    />
    <div class="pro-transfer--space">
      <div>
        <ElButton
          type="primary"
          :icon="LeftSvg"
          :disabled="leftChecked.length === 0"
          @click="moveToRight"
        />
        <ElButton
          type="primary"
          :icon="RightSvg"
          :disabled="rightChecked.length === 0"
          @click="moveToLeft"
        />
      </div>
    </div>
    <!-- @vue-generic {T} -->
    <ProTransferPanel
      :checked="rightChecked"
      :data="rightData"
      :valueKey="props.valueKey"
      :tableProps="props.tableProps"
      :checkedChange="handleRightChecked"
    />
  </div>
</template>
<script setup lang="ts" generic="T extends ProComponentObject">
/*
 * transfer 组件实现逻辑
 * 外部传入 data 数据为原始数据
 * leftData 过滤 modelValue
 * rightData 等于 modelValue
 * 点击左侧按钮，将左侧选中的数据添加到 modelValue 中
 * 点击右侧按钮，将右侧选中的数据从 props.data 中移除
 */
import { h, ref, computed, watch, type Ref } from 'vue'
import { ElButton } from 'element-plus'
import ProTransferPanel from './panel.vue'
import LeftIcon from './icons/left.vue'
import type { ProComponentObject } from '../common.types'
import type { KeyType } from '../proTable/table.types'
import type {
  ProTransferProps,
  ProTransferFilterType,
  ProTransferValueType,
  ProTransferDirection,
} from './transfer.types'

defineOptions({
  name: 'ProTransfer',
})

const props = withDefaults(defineProps<ProTransferProps<T>>(), {
  valueKey: 'value',
  contentHeight: 274,
})
const modelValue = computed(() => props.modelValue || [])
// 定义 emit 事件
const emit = defineEmits<{
  'update:modelValue': [value: ProTransferValueType]
  change: [
    value: ProTransferValueType,
    direction: ProTransferDirection,
    movedKeys: ProTransferValueType,
  ]
  'left-check-change': [value: ProTransferValueType]
  'right-check-change': [value: ProTransferValueType]
}>()
const wrapStyle = computed(() => {
  return {
    height: `${props.contentHeight}px`,
  }
})
const filterMethod: ProTransferFilterType<T> = (checkedArray, item) => {
  const matchIndex = checkedArray.findIndex((c) => c[props.valueKey] === item[props.valueKey])
  return matchIndex === -1
}
const moveToRight = () => {
  // const filterData = leftData.value.filter((item) => filterMethod(leftChecked.value, item))
  // leftData.value = filterData
  const newValue = modelValue.value.concat(leftChecked.value)
  emit('update:modelValue', newValue)
  emit('change', newValue, 'right', leftChecked.value)
  leftChecked.value = []
}
const moveToLeft = () => {
  const newValue = modelValue.value.filter((item) => filterMethod(rightChecked.value, item))
  emit('update:modelValue', newValue)
  emit('change', newValue, 'left', rightChecked.value)
  rightChecked.value = []
}
const LeftSvg = h(LeftIcon)
const RightSvg = h(LeftIcon, { style: { transform: 'rotate(180deg)' } })
const defaultValue = modelValue.value
// 左侧展示的数据
const defaultLeftData = props.data.filter((item) => filterMethod(defaultValue, item))
const leftData = ref(defaultLeftData) as Ref<T[]>
const leftChecked = ref(props.leftDefaultChecked || [])
const handleLeftChecked = (_keys: KeyType[], rows: T[]) => {
  leftChecked.value = rows
  emit('left-check-change', rows)
}
// 右侧展示的数据
const rightData = ref(defaultValue)
watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      rightData.value = val
      leftData.value = props.data.filter((item) => filterMethod(val, item))
    }
  },
  { immediate: true },
)
const rightChecked = ref(props.rightDefaultChecked || [])
const handleRightChecked = (_keys: KeyType[], rows: T[]) => {
  rightChecked.value = rows
  emit('right-check-change', rows)
}
</script>
<style lang="less">
.pro-transfer {
  display: flex;

  & &--panel {
    flex: 1;
  }

  & &--space {
    display: flex;
    align-items: center;
    width: 54px;
    margin: 0 16px;

    .el-button + .el-button {
      margin-left: 0;
      margin-top: 16px;
    }
  }
}
</style>
