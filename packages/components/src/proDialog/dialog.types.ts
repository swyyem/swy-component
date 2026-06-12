import { type DialogProps } from 'element-plus'
import { type VNode } from 'vue'
import { type ProFormProps } from '../form'
import type { ProComponentObject } from '../common.types'

export type DialogSlotType = Record<string, (props?: any) => VNode | VNode[]>

export type Type = 'tabDialog' | 'formDialog' | 'dialog'

export type DialogType = 'tableDialog' | 'tableFormDialog' | 'formDialog'

export type DoneFn = (cancel?: boolean) => void

export type hisDialogProps = Partial<DialogProps> & {
  type?: Type
  footer?: boolean
  hasPadding?: boolean
  hasEditStatus?: false | (() => boolean)
  minHeight?: number
  beforeClose?: (done: DoneFn) => void
  onSubmit?: () => void
  dialogType?: DialogType
  inTableRolling?: boolean
  okText?: string
  cancelText?: string
}

export type DialogRequestType<T extends ProComponentObject = ProComponentObject> = {
  /** 表格行数据 */
  rowData?: T
  /** 表单弹窗时需要异步获取数据的处理，没有则使用 rowData */
  dialogInitialData?: ((data?: T) => T) | ((data?: T) => Promise<T>)
  /** 表单弹窗提交前的数据处理 */
  beforeRequest?: ((data?: T) => T) | ((data?: T) => Promise<T>)
  /** 表单弹窗提交成功后的处理 */
  afterRequest?: (data?: any) => void
  /** 表单弹窗提交的请求 */
  request?: (data?: T) => Promise<any> | void
}

export type FormDialogType<T extends ProComponentObject = ProComponentObject> = hisDialogProps &
  DialogRequestType<T> & {
    onFormSubmit?: (data?: T) => void
    formProps?: ProFormProps<T>
    slot?: DialogSlotType
  }
