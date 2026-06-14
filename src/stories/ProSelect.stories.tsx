import { ref } from 'vue'
import { ElButton } from 'element-plus'
import type { Meta, StoryObj } from '@storybook/vue3'
import { ProSelect } from '../index'

const meta = {
  title: 'Example/ProSelect',
  component: ProSelect,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '基于 ElementPlus 封装的表格组件',
      },
    },
  },
} satisfies Meta<typeof ProSelect>

export default meta
type Story = StoryObj<typeof ProSelect>

const generateData = (n: number, start?: number, str?: string) => {
  const end = start || 0
  const total = (n || 10) + end
  const res: any = []
  for (let i = end; i < total; i++) {
    res.push({
      label: `测试${i}${str || ''}`,
      value: i,
    })
  }
  return res
}
type RowVO = {
  id: number
  nesting: {
    chargeItemId: string
  }
  campusId: number
  chargeItemCount: number
  filmFeeType: number
  graphicFeeFlag: boolean
  digitalImagingFeeFlag: boolean
  useScopeList: string[]
  enableFlag: boolean
}
const generateTableData = (
  n: number = 10,
  start?: number,
  str = '',
): RowVO[] => {
  const res: RowVO[] = []
  const realStart = start || 0
  for (let i = 0; i < n; i++) {
    res.push({
      id: realStart + i,
      nesting: {
        chargeItemId: `45435${realStart + i}${str}`,
      },
      campusId: 1,
      chargeItemCount: 3,
      filmFeeType: 2,
      graphicFeeFlag: false,
      digitalImagingFeeFlag: true,
      useScopeList: ['INP'],
      enableFlag: i % 3 === 0 ? true : false,
    })
  }
  return res
}
type ListVO = {
  label: string
  value: {
    id: string
    name: string
  }
}
const generateValueData = (): Promise<{ data: ListVO[] }> => {
  return Promise.resolve({
    data: [
      {
        label: 'F院区',
        value: {
          id: '307',
          name: 'F院区',
        },
      },
      {
        label: 'M院区',
        value: {
          id: '6701',
          name: 'M院区',
        },
      },
      {
        label: 'B院区花生',
        value: {
          id: '303',
          name: 'B院区花生',
        },
      },
      {
        label: 'D院区',
        value: {
          id: '305',
          name: 'D院区',
        },
      },
    ],
  })
}
// 基础用法
export const Basic: Story = {
  render: () => ({
    setup() {
      const selectRef = ref()
      const select = ref()
      const saveSelect = (val: any) => {
        select.value = val
      }
      const valueEnum = generateData(10)
      const getFocus = () => {
        selectRef.value?.focus()
      }
      const handleEnter = () => {
        console.log('=enter=')
      }
      return () => (
        <div style="width: 200px; height: 100px">
          <h3>基本用法</h3>
          <div>
            <ElButton onClick={getFocus}>获得焦点</ElButton>
          </div>
          <ProSelect
            ref={selectRef}
            modelValue={select.value}
            onUpdate:modelValue={saveSelect}
            onKeydown:enter={handleEnter}
            filterable
            placeholder="请选择"
            contentWidth={300}
            defaultValueEnum={valueEnum}
          />
        </div>
      )
    },
  }),
}
// value 为 object
export const ValueObject: Story = {
  render: () => ({
    setup() {
      const selectRef = ref()
      const select = ref({
        id: '305',
        name: 'D院区',
      })
      const saveSelect = (val: any) => {
        select.value = val
      }
      return () => (
        <div style="width: 400px; height: 100px">
          <h3>value 为对象</h3>
          <div>选中的值：{JSON.stringify(select.value)}</div>
          <ProSelect
            ref={selectRef}
            modelValue={select.value}
            onUpdate:modelValue={saveSelect}
            remoteMethod={generateValueData}
            valueKey="id"
            labelKey="name"
            filterable
            contentWidth={300}
          />
        </div>
      )
    },
  }),
}

// 受控
export const Control: Story = {
  render: () => ({
    setup() {
      const select = ref()
      const saveSelect = (val: any) => {
        select.value = val
      }
      const valueEnum = ref(generateData(10))
      const setValueEnum = () => {
        valueEnum.value = generateData(20)
      }
      const resetValueEnum = () => {
        valueEnum.value = generateData(10)
      }
      const keyword = ref('')
      const saveKeyword = (val?: string) => {
        console.log('=keyword=', val)
        keyword.value = val || ''
      }
      const setKeyword = () => {
        keyword.value = '测试1'
      }
      return () => (
        <div style="width: 300px; height: 100px">
          <h3>受控用法</h3>
          <div style={{ marginBottom: '10px' }}>
            <ElButton onClick={setValueEnum}>修改</ElButton>
            <ElButton onClick={resetValueEnum}>还原</ElButton>
            <ElButton onClick={setKeyword}>设置keyword</ElButton>
          </div>
          <ProSelect
            modelValue={select.value}
            onUpdate:modelValue={saveSelect}
            keyword={keyword.value}
            onUpdate:keyword={saveKeyword}
            filterable={true}
            placeholder="请选择"
            contentWidth={300}
            valueEnum={valueEnum.value}
          />
        </div>
      )
    },
  }),
}

// 远程请求
export const Waterfall: Story = {
  render: () => ({
    setup() {
      const getData = (params: any) => {
        console.log('=params=', params)
        return new Promise((resolve) => {
          setTimeout(() => {
            const total = (params.from || 0) + (params.size || 10)
            const list = generateData(
              params.size || 10,
              params.from || 0,
              params.keyword,
            )
            console.log('=list=', list)
            resolve({
              data: {
                count: 31,
                result: list,
                hasMore: total < 31 ? true : false,
              },
            })
          }, 2000)
        })
      }
      const select = ref([12, 13])
      const saveSelect = (val: any) => {
        select.value = val
        console.log('=select=', val)
      }
      const handleOption = (v: any) => {
        console.log('=option=', v)
      }
      const defaultValueEnum = [
        {
          label: `测试12`,
          value: 12,
        },
        {
          label: `测试13`,
          value: 13,
        },
      ]
      // const valueEnum = ref([
      //   {
      //     label: '外部1',
      //     value: -1,
      //   },
      // ])
      // 同步内部获取的数据
      const setValueEnum = (v: any) => {
        console.log('=changed=', v)
        // valueEnum.value = v
      }
      const startParams = ref<Record<string, any>>({
        aaa: 1,
      })
      const setParams = () => {
        startParams.value = {
          bbb: 2,
        }
      }
      return () => (
        <div style="width: 260px; height: 100px">
          <h3>请求数据</h3>
          <div style={{ marginBottom: '10px' }}>
            <ElButton onClick={setParams}>修改参数</ElButton>
          </div>
          <ProSelect
            modelValue={select.value}
            params={startParams.value}
            onUpdate:modelValue={saveSelect}
            onUpdate:option={handleOption}
            defaultValueEnum={defaultValueEnum}
            placeholder="请选择"
            contentWidth={300}
            remoteMethod={getData}
            checkAll
            waterfall
            multiple
            filterable
            defaultFirstOption
            remoteShowSuffix
            handleValueEnumChange={setValueEnum}
          />
        </div>
      )
    },
  }),
}

// 表格
export const Table: Story = {
  render: () => ({
    setup() {
      const getData = (params: any) => {
        console.log('=table fetch=', params)
        const list = generateTableData(params.size, params.from, params.keyword)
        return new Promise((resolve) => {
          setTimeout(() => {
            console.log('=list=', list)
            resolve({
              data: {
                count: 351,
                result: list,
                hasMore: true,
              },
            })
          }, 2000)
        })
      }
      const defaultValue = {
        campusId: 1,
        chargeItemCount: 3,
        digitalImagingFeeFlag: true,
        enableFlag: true,
        filmFeeType: 2,
        graphicFeeFlag: false,
        id: 8,
        nesting: { chargeItemId: '454358' },
        useScopeList: ['INP'],
      }
      const select = ref([defaultValue])
      const saveSelect = (val: any) => {
        console.log('=select=', val)
        select.value = val
      }
      const handleChange = (v: any) => {
        console.log('=change=', v)
      }
      const tableProps = {
        request: getData,
        columns: [
          {
            label: '序号',
            type: 'seq',
            width: '50',
          },
          {
            prop: 'nesting.chargeItemId',
            label: '收费项目ID',
            minWidth: 150,
          },
          {
            field: 'campusId',
            title: '使用院区',
            width: '150',
          },
          {
            field: 'chargeItemCount',
            title: '收费项目次数',
            width: '120',
            valueType: 'inputNumber',
          },
        ],
      }
      const startParams = ref<Record<string, any>>({
        aaa: 1,
      })
      const setParams = () => {
        startParams.value = {
          bbb: 2,
        }
      }
      return () => (
        <div style="width: 200px; height: 100px">
          <h3>下拉表格</h3>
          <div style={{ marginBottom: '10px' }}>
            <ElButton onClick={setParams}>修改参数</ElButton>
          </div>
          <ProSelect
            modelValue={select.value}
            valueKey="id"
            labelKey={(v: any) => v.nesting.chargeItemId}
            multiple
            waterfall
            filterable
            collapse-tags
            clearable
            params={startParams.value}
            onUpdate:modelValue={saveSelect}
            onChange={handleChange}
            tableProps={tableProps}
          />
        </div>
      )
    },
  }),
}
