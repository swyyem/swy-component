import './index.less'
import ProForm, { ProFormField, ModalForm, UploadForm, DrawerForm } from './form'
import ProFormList from './proFormList'
import ProField, { ProText } from './proField'
import QueryFilter from './queryFilter'
export type * from './form'
export type * from './proField'
export * from './components'
import { registerFieldComponent } from './components/utils'
import FieldsComponent from './form/fieldsComponent.vue'
import ProTable, { ProColumn, ProInternalAddPrefix, ProTableCellProvide } from './proTable'
import ProSelect, { ProOption } from './proSelect'
import ProTransfer from './proTransfer'
import ProInputTag from './proInputTag'
import ProTool from './tool'
import ProDatePicker from './proDatePicker/index'
import ProDialog, { ProFormDialog } from './proDialog/index'
import ActionButton from './actionButton'
// 一些内置的包装组件，提供出去供业务组件使用
import ProInnerInput from './proField/components/input'
import ProInnerInputNumber from './proField/components/inputNumber'
import ProInnerCheckbox from './proField/components/checkbox'
import ProInnerSelect from './proField/components/select'
import ProInnerInputPrice from './proField/components/inputPrice'
import ProInnerDatePicker from './proField/components/datePickerV2'
import ProInnerSelectEnhance from './proField/components/selectEnhance'

export type * from './proTransfer'
export type * from './proInputTag'
export * from './proTable/variable'
export type * from './proTable'
export type * from './proSelect'
export type * from './tool'
export type * from './proDatePicker/index'
export type * from './proDialog'
export type * from './actionButton'

export { ProInnerInput }
export { ProInnerInputNumber }
export { ProInnerCheckbox }
export { ProInnerSelect }
export { ProInnerInputPrice }
export { ProInnerDatePicker }
export { ProInnerSelectEnhance }
export { ProText }
export { ProField }
export { ProFormField }
export { ProForm }
export { ProFormList }
export { ModalForm }
export { UploadForm }
export { DrawerForm }
export { QueryFilter }
export { FieldsComponent as ProFieldsComponent }
export { ProOption }
export { ProSelect }
export { ProTransfer }
export { ProInputTag }
export { ProTool }
export const HisColumn = ProColumn
export { ProColumn }
export { ProInternalAddPrefix }
export { ProTableCellProvide }
export { ProDatePicker }
export { ProDialog }
export { ProFormDialog }
export { ActionButton }
export default ProTable
/***
 * 注册原子组件
 * */
// export { registerComponent }
// 统一使用 registerFieldComponent
export const registerComponent = registerFieldComponent

// 导出 element-plus
export * from 'element-plus'
export type * from 'element-plus'
