<template>
  <GridItem
    v-for="(item, index) in getFormFields(props.columns ?? [])"
    :key="index"
    v-bind="getResponsive(item)"
    :index="index"
  >
    <template v-if="item.valueType === 'formList'">
      <!-- @vue-generic {T} -->
      <ProFormList v-bind="item" :itemRender="item.fieldProps?.itemRender">
        <!-- @vue-generic {T} -->
        <FormFields :columns="item.columns"></FormFields>
      </ProFormList>
    </template>
    <template v-else-if="item.valueType === 'group'">
      <FormGroup :label="item?.label ?? ''">
        <!-- @vue-generic {T} -->
        <FormFields :columns="item.columns"></FormFields>
      </FormGroup>
    </template>
    <template v-else>
      <FieldsComponent v-bind="item"> </FieldsComponent>
    </template>
  </GridItem>
</template>

<script setup lang="ts" generic="T extends ProComponentObject">
import type { FiledForm, FormJsonType } from './form.types'
import type { ProComponentObject } from '../common.types'
import { computed, inject } from 'vue'
import FieldsComponent from './fieldsComponent.vue'
import FormFields from './formFields.vue'
import ProFormList from '../proFormList'
import FormGroup from './formGroup.vue'
import { GridItem } from '../grid/index.ts'
import type { searchFormConfigType } from '../queryFilter/queryFilter.types'

defineOptions({
  name: 'FormFields',
})
const props = defineProps<FormJsonType>()
const searchFormConfig = inject<searchFormConfigType>('searchFormConfig', {})

const getFormFields = computed(() => {
  return (columns: FiledForm[] | FiledForm) => {
    let arr: FiledForm[] | FiledForm = []
    if (searchFormConfig?.searchForm && Array.isArray(columns)) {
      arr = columns.filter(
        (v: FiledForm) => v.valueType && !['formList', 'group'].includes(v.valueType),
      )
    } else {
      arr = columns
    }
    if (Array.isArray(arr)) {
      return arr
    } else if (typeof arr === 'object') {
      return [arr]
    } else {
      return []
    }
  }
})

const getResponsive = (item: FiledForm) => {
  return {
    colStyle: item.colProps?.colStyle,
    isCol: item.colProps?.isCol ?? true,
    span: item.colProps?.span,
    offset: item.colProps?.offset ?? 0,
    xs: item.colProps?.xs,
    sm: item.colProps?.sm,
    md: item.colProps?.md,
    lg: item.colProps?.lg,
    xl: item.colProps?.xl,
  }
}
</script>
