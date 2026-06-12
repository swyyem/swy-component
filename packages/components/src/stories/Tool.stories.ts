import type { Meta } from '@storybook/vue3'
import { ref } from 'vue'
import { ElButton } from 'element-plus'
import { ProTool } from '../index'

const meta = {
  title: 'Example/ProTool',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '封装常用的方法，抹平 electron 和浏览器的差异',
      },
    },
  },
} satisfies Meta<typeof ProTool>

export default meta

export const Usage = () => ({
  setup() {
    const info = ref('')
    ProTool.systemInfoAsync().then((res) => {
      info.value = JSON.stringify(res, null, 2)
    })
    return { info }
  },
  template: `
    <div>
      <h3>引入 ProTool</h3>
      <code>
        import { ProTool } from '@df/toco-ui-vue'
      </code>
    </div>
    <div>
      <h3>ProTool.systemInfoAsync 方法返回的 promise 回调的数据：</h3>
      <pre>{{ info }}</pre>
    </div>
    <div>
      <h3>打印的方法</h3>
      <code>
        ProTool.print('pdf buffer', { onSuccess, onError })
      </code>
    </div>
  `,
})

export const Cookie = () => ({
  components: {
    ElButton,
  },
  setup() {
    const handleSet = () => {
      ProTool.cookieUtil.set('userId', 8781231)
    }
    const ckValue = ref('')
    const handleGet = () => {
      console.log('=get=', ProTool.cookieUtil.get('userId'))
      ckValue.value = ProTool.cookieUtil.get('userId') || ''
    }
    const handleRemove = () => {
      ProTool.cookieUtil.remove('userId')
    }
    return {
      handleSet,
      handleGet,
      handleRemove,
      ckValue,
    }
  },
  template: `
    <div>
      <h3>引入 ProTool</h3>
      <code>
        import { ProTool } from '@df/toco-ui-vue'
      </code>
    </div>
    <div>
      <h3>ProTool.cookieUtil 工具对象提供的方法</h3>
      <div>
        <pre>设置值 ProTool.cookieUtil.set('userId', 8781231)</pre>
        <ElButton @click="handleSet">设置</ElButton>
      </div>
      <div>
        <pre>取值 ProTool.cookieUtil.get('userId'), {{ ckValue }}</pre>
        <ElButton @click="handleGet">获取</ElButton>
      </div>
      <div>
        <pre>删除 ProTool.cookieUtil.remove('userId')</pre>
        <ElButton @click="handleRemove">删除</ElButton>
      </div>
    </div>
  `,
})

export const Storage = () => ({
  components: {
    ElButton,
  },
  setup() {
    const handleSet = () => {
      ProTool.localStorage.set('userId', 8781231)
    }
    const ckValue = ref('')
    const handleGet = () => {
      console.log('=get=', ProTool.localStorage.get('userId'))
      ckValue.value = ProTool.localStorage.get('userId') || ''
    }
    const handleRemove = () => {
      ProTool.localStorage.remove('userId')
    }
    const jnValue = ref()
    const handleJSONSet = () => {
      ProTool.localStorage.set('json', { aaa: 100, bbb: 200 })
    }
    const handleJSONGet = () => {
      console.log('=get json=', ProTool.localStorage.get('json'))
      jnValue.value = ProTool.localStorage.get('json') || ''
    }
    const handleJSONRemove = () => {
      ProTool.localStorage.remove('json')
    }
    return {
      handleSet,
      handleGet,
      handleRemove,
      handleJSONSet,
      handleJSONGet,
      handleJSONRemove,
      ckValue,
      jnValue,
    }
  },
  template: `
    <div>
      <h3>引入 ProTool</h3>
      <code>
        import { ProTool } from '@df/toco-ui-vue'
      </code>
    </div>
    <div>
      <h3>
        ProTool.cookieUtil 工具对象提供的 localStorage，支持 json 的读写。sessionStorage 同理
      </h3>
      <div>
        <pre>设置值 ProTool.localStorage.set('userId', 8781231)</pre>
        <ElButton @click="handleSet">设置</ElButton>
      </div>
      <div>
        <pre>取值 ProTool.localStorage.get('userId'), {{ ckValue }}</pre>
        <ElButton @click="handleGet">获取</ElButton>
      </div>
      <div>
        <pre>删除 ProTool.localStorage.remove('userId')</pre>
        <ElButton @click="handleRemove">删除</ElButton>
      </div>
      <h3>json 的读写</h3>
      <div>
        <pre>设置值 ProTool.localStorage.set('json', { aaa: 100, bbb: 200 })</pre>
        <ElButton @click="handleJSONSet">设置</ElButton>
      </div>
      <div>
        <pre>取值 ProTool.localStorage.get('json'), {{ jnValue }}</pre>
        <ElButton @click="handleJSONGet">获取</ElButton>
      </div>
      <div>
        <pre>删除 ProTool.localStorage.remove('json')</pre>
        <ElButton @click="handleJSONRemove">删除</ElButton>
      </div>
    </div>
  `,
})

export const Color = () => ({
  components: {
    ElButton,
  },
  setup() {
    const rgbValue = ref('')
    const handleToRgb = () => {
      const rgb = ProTool.color.hexToRgb('#000000')
      rgbValue.value = JSON.stringify(rgb)
    }
    const rgbaValue = ref('')
    const handleToRgba = () => {
      const rgba = ProTool.color.hexToRgba('#000000', 0.5)
      rgbaValue.value = JSON.stringify(rgba)
    }
    const hexValue = ref('')
    const handleToHex = () => {
      const hex = ProTool.color.rgbToHex(0, 0, 0)
      hexValue.value = hex
    }
    return {
      handleToRgb,
      rgbValue,
      handleToRgba,
      rgbaValue,
      handleToHex,
      hexValue,
    }
  },
  template: `
    <div>
      <h3>引入 ProTool</h3>
      <code>
        import { ProTool } from '@df/toco-ui-vue'
      </code>
    </div>
    <div>
      <h3>
        ProTool.cookieUtil 的 color 对象，提供了 5 个操作颜色的方法
      </h3>
      <div>
        <pre>hex 转换 rgb ProTool.color.hexToRgb('#000000')</pre>
        <ElButton @click="handleToRgb">转换</ElButton>
        {{ rgbValue }}
      </div>
      <div>
        <pre>hex 转换 rgba ProTool.color.hexToRgba('#000000', 0.5)</pre>
        <ElButton @click="handleToRgba">转换</ElButton>
        {{ rgbaValue }}
      </div>
      <div>
        <pre>rgb 转换 hex ProTool.color.rgbToHex(0, 0, 0)</pre>
        <ElButton @click="handleToHex">转换</ElButton>
        {{ hexValue }}
      </div>
    </div>
  `,
})

export const Upload = () => ({
  components: {
    ElButton,
  },
  setup() {
    const handleToRgb = () => {
      console.log(ProTool.upload)
    }
    const handleToRgba = () => {
      console.log(ProTool.upload)
    }
    return {
      handleToRgb,
      handleToRgba,
    }
  },
  template: `
    <div>
      <h3>引入 ProTool</h3>
      <code>
        import { ProTool } from '@df/toco-ui-vue'
      </code>
    </div>
    <div>
      <h3>
        ProTool.cookieUtil 的 upload 对象，提供了根据业务id和业务类型获取文件list与将文件关联id的方法
      </h3>
      <div>
        <ElButton @click="handleToRgb">获取文件列表 handlePreview</ElButton>
      </div>
      <div>
        <ElButton @click="handleToRgb">将upload组件选择业务ID relatedBusiness</ElButton>
      </div>
    </div>
  `,
})
