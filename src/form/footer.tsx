import type { FunctionalComponent } from 'vue'
import type { SubmitterProps } from './form.types'
import type { RowProps } from 'element-plus'
import { ElButton, ElRow } from 'element-plus'

const FormFooter: FunctionalComponent<
  SubmitterProps & {
    inline?: boolean
  }
> = (props) => {
  if (props.render === false) {
    return null
  }
  const {
    onSubmit,
    onReset,
    render,
    searchConfig = {},
    submitButtonProps,
    resetButtonProps,
    align = 'right',
    inline = false,
  } = props

  const justifyMap = {
    left: 'start',
    right: 'end',
    center: 'center',
  }
  const submit = () => {
    onSubmit?.()
  }

  const reset = (e: MouseEvent) => {
    onReset?.(e)
  }

  // TODO: i18n
  const { submitText = '保存', resetText = '重置' } = searchConfig
  const dom = []
  if (submitButtonProps !== false) {
    dom.push(
      <ElButton
        type="primary"
        {...submitButtonProps}
        key="submit"
        onClick={() => {
          submit()
        }}
      >
        {submitText}
      </ElButton>,
    )
  }
  if (resetButtonProps !== false) {
    dom.push(
      <ElButton
        {...resetButtonProps}
        key="rest"
        onClick={(e) => {
          reset(e)
        }}
      >
        {resetText}
      </ElButton>,
    )
  }

  const renderDom = render ? (
    render({ ...props, submit, reset }, dom)
  ) : dom.length > 0 ? (
    <ElRow
      justify={justifyMap[align] as RowProps['justify']}
      style={inline ? {} : { marginTop: '16px' }}
    >
      <div>{dom}</div>
    </ElRow>
  ) : null
  return renderDom
}
FormFooter.displayName = 'FormFooter'
export default FormFooter
