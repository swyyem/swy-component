const regionOption = {
  fieldProps: {
    valueEnum: [
      {
        label: '浙江',
        value: '1',
      },
      {
        label: '江西',
        value: '2',
      },
      {
        label: '江苏',
        value: '3',
      },
    ],
  },
}
export const columns = [
  {
    label: '序号',
    type: 'index',
    width: '50',
  },
  {
    prop: 'name',
    label: '姓名',
  },
  {
    prop: 'age',
    label: '年龄',
    width: 100,
  },
  {
    prop: 'birth',
    label: '出生日期',
    width: 160,
  },
  {
    prop: 'selected',
    label: '勾选',
    valueType: 'checkbox',
    width: 80,
    proFieldProps: {
      fieldProps: {
        multiple: false, // 单个必须要配置
      },
    },
  },
  {
    prop: 'region',
    label: '籍贯',
    width: 100,
    valueType: 'selectEnhance',
    proFieldProps: regionOption,
  },
]
export const childColumns = columns.slice(1, 4)
export const multipleColumns = [
  {
    label: '序号',
    type: 'seq',
    width: '50',
  },
  {
    label: '多级信息',
    align: 'center' as const,
    children: [
      {
        label: '二级信息',
        align: 'center' as const,
        children: columns.slice(1, 3),
      },
      {
        label: '二级信息22',
        align: 'center' as const,
        children: columns.slice(3, 5),
      },
    ],
  },
]
export const expandColumns = columns.slice(1, 5)
export type RowVO = {
  id: number
  name: string
  age: number
  birth: string
  selected: boolean
  region: string
  enableFlag: boolean
  children?: RowVO[]
  hasChildren?: boolean
  price?: number
}
const getRandom = (n = 2) => {
  return Math.floor(Math.random() * Math.pow(10, n))
}
export const generateData = (n: number = 10, start?: number, from?: number): RowVO[] => {
  const res: RowVO[] = []
  const vForm = from || 0
  const realStart = start || getRandom(5)
  for (let i = 0; i < n; i++) {
    res.push({
      id: vForm + realStart + i,
      name: '张三',
      age: getRandom(),
      birth: '1999-01-02',
      region: i % 2 === 0 ? '1' : '2',
      selected: i % 3 === 0 ? true : false,
      enableFlag: i % 4 === 0 ? true : false,
    })
  }
  return res
}

export const getTableData = async (params: any, data?: RowVO[]) => {
  console.log('==', params, data)
  const list = generateData(params.size, 10, params.from)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          count: 52,
          result: list,
          hasMore: params.from > 50 ? false : true,
        },
      })
    }, 2000)
  })
}
