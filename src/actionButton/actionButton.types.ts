import type { ButtonProps, PopconfirmProps } from 'element-plus'
import type { FormDialogType, DialogSlotType, DialogRequestType } from '../proDialog/dialog.types'
import type { ProComponentObject } from '../common.types'

export type ActionInnerPopconfirmProps<T> = Partial<PopconfirmProps> & {
  onConfirm?: (data?: T) => void
  onCancel?: () => void
}
export type ActionsPopconfirmProps<T> =
  | ActionInnerPopconfirmProps<T>
  | ((data?: T) => ActionInnerPopconfirmProps<T>)

export type ActionInnerButtonType = Partial<ButtonProps> & {
  label?: string
  slot?: DialogSlotType
}
export type ActionInnerButtonProps<T> =
  | ActionInnerButtonType
  | ((data?: T) => ActionInnerButtonType)

export type ActionDialogProps<T extends ProComponentObject> = FormDialogType<T>
export type ActionButtonProps<T extends ProComponentObject = ProComponentObject> =
  DialogRequestType<T> & {
    buttonProps: ActionInnerButtonProps<T>
    dialogProps?: ActionDialogProps<T>
    popconfirmProps?: ActionsPopconfirmProps<T>
  }
