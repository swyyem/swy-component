import type { SelectProps, InputProps } from 'element-plus'
type TagValue = any

export type ProInputTagProps = Partial<
  Pick<InputProps, 'placeholder' | 'clearable' | 'disabled'>
> & {
  /** 组件的值 */
  modelValue?: TagValue[]
  /** 下拉面板宽度 */
  contentWidth?: number
  /** 下拉面板的高度 */
  contentHeight?: number
  /** 下拉框的宽度是否与输入框相同	 */
  fitInputWidth?: boolean
  /** input 尺寸 */
  size?: SelectProps['size']
  /** theme 配置 */
  effect?: SelectProps['effect']
  /** 选择器下拉菜单的自定义类名 */
  popperClass?: string
}
export type ProInputTagDropdownProps = Pick<
  ProInputTagProps,
  'contentWidth' | 'popperClass' | 'fitInputWidth'
> & {
  tagRef?: HTMLElement
}

export type ProInputTagEmits = {
  (e: 'update:modelValue', val: TagValue[]): void
  (e: 'remove-tag', val: TagValue): void
}

export type ProInputTagInstance = {
  focus: () => void
  blur: () => void
}
