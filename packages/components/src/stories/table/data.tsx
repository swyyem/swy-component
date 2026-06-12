import { ref, nextTick, onMounted } from 'vue'
import type { StoryObj } from '@storybook/vue3'
import { ElButton } from 'element-plus'
import ProTable, { type ProTableInstance } from '../../index'
import { columns, generateData, type RowVO } from './common'

const customBase = () => {
  return (
    <>
      <ElButton type="primary" onClick={changeData}>
        追加数据
      </ElButton>
    </>
  )
}
const toolbarColumns = {
  title: '数据',
  buttonsCustom: customBase,
}
const list = generateData(5, 40)
const outerData = ref(list)
const changeData = () => {
  outerData.value = list.concat(generateData(5, 50))
}
const handleLoad = (v: RowVO[]) => {
  console.log('=list111=', v)
  // 同步
  outerData.value = v
}
export const Data: StoryObj<typeof ProTable<RowVO>> = {
  name: '数据',
  args: {
    rowKey: 'id',
    columns: columns,
    toolbar: toolbarColumns,
  },
  render: (args) => {
    return {
      setup() {
        const tableRef = ref<ProTableInstance<RowVO>>()
        onMounted(() => {
          nextTick(() => {})
        })
        return () => (
          <div style="height: 500px">
            <ProTable<RowVO>
              ref={tableRef}
              {...args}
              data={outerData.value}
              onDataChange={handleLoad}
            />
          </div>
        )
      },
    }
  },
}
