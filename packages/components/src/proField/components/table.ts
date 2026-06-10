import { defineComponent, h, ref } from 'vue'
import type { PropType } from 'vue'
import ProTable from '../../proTable/index'
import type { ProTableProps } from '../../proTable/proTable.types'
import type { TableRequest, AnyObject } from '../../proTable/table.types'

export default defineComponent({
  props: {
    fieldProps: {
      type: Object as PropType<ProTableProps>,
      required: true,
    },
    mode: {
      type: String as PropType<string>,
      required: true,
    },
    emptyText: {
      type: String as PropType<string>,
    },
    modelValue: {
      type: Array as PropType<any[]>,
    },
    request: {
      type: Function as PropType<TableRequest<AnyObject>>,
    },
    childRef: {
      type: Object as PropType<typeof ref>,
      default: () => {
        return ref(null)
      },
    },
  },
  setup(props, {}) {
    return () => {
      const { childRef, mode, fieldProps: a, request } = props
      // console.log(props.modelValue, 'modelValuemodelValue')
      const fieldProps = {
        ...a,
        request,
        ref: childRef,
        editable: mode === 'edit' ? a.editable : false,
      }

      return h(ProTable, fieldProps as ProTableProps, '')
    }
  },
})
