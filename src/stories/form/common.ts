export const columns = [
  {
    label: '姓名',
    name: 'name',
    required: true,
  },
  {
    label: '年龄',
    valueType: 'inputNumber',
    name: 'age',
    required: true,
    fieldProps: {
      placeholder: '请输入',
    },
  },
  {
    label: '性别',
    valueType: 'radio',
    name: 'gender',
    required: true,
    valueEnum: [
      {
        key: 'male',
        value: 'male',
        label: '男',
      },
      {
        key: 'female',
        value: 'female',
        label: '女',
      },
    ],
  },
  {
    label: '出生日期',
    required: true,
    valueType: 'dateTimePicker',
    name: 'birth',
  },
  {
    label: '勾选',
    valueType: 'checkbox',
    name: 'selected',
    required: true,
    fieldProps: {
      multiple: false,
    },
  },
  {
    label: '籍贯',
    valueType: 'selectEnhance',
    name: 'region',
    required: true,
    valueEnum: [
      {
        key: '1',
        value: '1',
        label: '浙江',
      },
      {
        key: '2',
        value: '2',
        label: '江西',
      },
    ],
    colProps: {
      colStyle: {
        width: '280px',
      },
    },
  },
  {
    label: '时间区间',
    valueType: 'dateTimeRangePicker',
    name: 'datePicker',
    required: true,
    fieldProps: {
      clearable: true,
      placeholder: '请选择时间',
      startPlaceholder: '开始时间',
      endPlaceholder: '结算时间',
      onChange: (val: string[]) => {
        console.log(val, 'change')
      },
      onFocus: (e: Event) => {
        console.log(e, 'focus')
      },
      onBlur: (e: Event) => {
        console.log(e, 'blur')
      },
      onVisibleChange: () => {
        console.log(2324)
      },
    },
    colProps: {
      colStyle: {
        width: '450px',
      },
    },
  },
  {
    label: '价格',
    valueType: 'price',
    name: 'price',
    required: true,
  },
]
