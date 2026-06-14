export type ElTextProps = {
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  /** @default 'default' */
  size?: 'large' | 'default' | 'small'
  lineClamp?: string | number
  /** @default 'span' */
  tag?: string
}

export type TextSpecifiledProps = {
  /** @name 是否缩略 */
  ellipsis?: boolean | { showTitle?: boolean }
  /** @name 是否拷贝 */
  copyable?: boolean
  /** @name 拷贝的文本 */
  copyText?: string
  /** @name 标题旁边的 tooltip */
  tooltip?: string
}

export type TextProps = ElTextProps & TextSpecifiledProps
