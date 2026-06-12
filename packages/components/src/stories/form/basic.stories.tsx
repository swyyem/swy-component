import type { Meta } from '@storybook/vue3'
import type { ConcreteComponent } from 'vue'
import { formProps } from 'element-plus'
import { ProForm } from '../../index'
import { Basic } from './base'
import { Layout } from './layout'
import { Effect } from './effect'
import { Value } from './value'
import { Table } from './table'
import { Tag } from './jsx'
// 遍历 formProps
const ElementFormProps: Record<string, any> = {}
// 隐藏 formProps 的展示
Object.keys(formProps).forEach((k) => {
  ElementFormProps[k] = { table: { disable: true } }
})
const meta: Meta<typeof ProForm> = {
  title: 'Example/ProForm',
  component: ProForm as unknown as ConcreteComponent,
  argTypes: ElementFormProps,
}

export default meta

export { Basic }
export { Layout }
export { Effect }
export { Value }
export { Table }
export { Tag }
