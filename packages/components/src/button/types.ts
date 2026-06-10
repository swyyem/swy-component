export interface SButtonProps {
  /** 按钮类型 */
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'default'
  /** 按钮尺寸 */
  size?: 'small' | 'medium' | 'large'
  /** 是否禁用 */
  disabled?: boolean
  /** 是否加载中 */
  loading?: boolean
}
