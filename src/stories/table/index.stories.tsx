import type { Meta } from '@storybook/vue3'
import type { ConcreteComponent } from 'vue'
import ProTable from '../../index'
import { Basic } from './base'
import { Data } from './data'
import { Event } from './event'
import { Layout } from './layout'
import { Side } from './side'
import { Multiple } from './multiple'
import { Expand } from './expand'
import { Tree } from './tree'
import { Selection } from './selection'
import { Editor } from './edit'
import '../table.css'

// 遍历 tableProps
const ElementTableProps: Record<string, any> = {}
// 隐藏 tableProps 的展示
Object.keys({}).forEach((k) => {
  ElementTableProps[k] = { table: { disable: true } }
})
const meta: Meta = {
  title: 'Example/ProTable',
  component: ProTable as unknown as ConcreteComponent,
  argTypes: ElementTableProps,
}

export default meta
export { Basic }
export { Data }
export { Event }
export { Layout }
export { Side }
export { Multiple }
export { Selection }
export { Expand }
export { Tree }
export { Editor }
