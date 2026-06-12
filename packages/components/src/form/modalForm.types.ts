import type { DialogProps, DrawerProps } from 'element-plus'
import type { ProFormProps, ProFormValueType } from './form.types'
import type { VNode } from 'vue'
export type ModalFormProps = {
  /** 用于触发 Modal 打开的 dom，同 template 中的 trigger */
  trigger?: VNode
  /** 弹框的标题 */
  title: string
  /** 是否打开 */
  open?: boolean
  /** open 改变时触发 */
  onOpenChange?: (open: boolean) => void
  /** 弹框的宽度 */
  width?: string | number
  /** ElDialog 的 props */
  modalProps?: Partial<DialogProps>
  /** ProForm 的 props */
  formProps?: Omit<ProFormProps, 'submitter'>
  /** 提交数据时触发，如果返回一个 true，会关闭弹窗 */
  onFinish?: (values: ProFormValueType) => Promise<boolean> | boolean
  /** 底部按钮配置 */
  submitter?: ProFormProps['submitter']
}

export type DrawerFormProps = {
  /** 用于触发 Modal 打开的 dom，同 template 中的 trigger */
  trigger?: VNode
  /** 弹框的标题 */
  title: string
  /** 是否打开 */
  open?: boolean
  /** open 改变时触发 */
  onOpenChange?: (open: boolean) => void
  /** 弹框的宽度 */
  width?: string | number
  /** ElDialog 的 props */
  drawerProps?: DrawerProps
  /** ProForm 的 props */
  formProps?: Omit<ProFormProps, 'submitter'>
  /** 提交数据时触发，如果返回一个 true，会关闭弹窗 */
  onFinish?: (values: ProFormValueType) => Promise<boolean> | boolean
  /** 底部按钮配置 */
  submitter?: ProFormProps['submitter']
}
