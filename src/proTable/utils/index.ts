import {
  isEqual as lodashEqual,
  get,
  entries,
  groupBy,
  fromPairs,
  mapValues,
  flatMap,
} from 'lodash-unified'
import type { FormValidateFailure } from 'element-plus'
import { InternalKey, InternalPrefix, InternalAddPrefix } from '../variable'
import { getValue } from '../../utils/value'
import type {
  KeyType,
  ProTablePageParams,
  ProTableGetRowKey,
  ProColumns,
  ProColumn,
  ProBaseTableProps,
} from '../table.types'
import type { ProUnifyTableProviderProps } from '../proTable.types'
import type { ProComponentAny, ProComponentObject } from '../../common.types'
import { isNumber } from '../../utils'

export const getDelayRes = (cb: () => void) => {
  let delay = false
  const res = () => {
    delay = true
    return {
      resolve: () => {
        cb()
      },
    }
  }
  return {
    getDelay: () => delay,
    asyncEvent: res,
  }
}

export function arrDel<T>(list: T[], value: T) {
  if (!list) return []
  const clone = list.slice()
  const index = clone.indexOf(value)
  if (index >= 0) {
    clone.splice(index, 1)
  }
  return clone
}

export function arrAdd<T>(list: T[], value: T) {
  const clone = (list || []).slice()
  if (clone.indexOf(value) === -1) {
    clone.push(value)
  }
  return clone
}

export const extendsObject = <T extends ProComponentObject = ProComponentObject>(...list: T[]) => {
  const result: ProComponentObject = { ...list[0] }

  for (let i = 1; i < list.length; i++) {
    const obj = list[i]
    if (obj) {
      Object.keys(obj).forEach((key) => {
        const val = obj[key]
        if (val !== undefined) {
          result[key] = val
        }
      })
    }
  }

  return result
}

type PostDataType<T> = (data: T) => T

/**
 * 一个转化的 pipeline 列表
 *
 * @param data
 * @param pipeline
 */
export function postDataPipeline<T>(data: T, pipeline: PostDataType<T>[]) {
  if (pipeline.filter((item) => item).length < 1) {
    return data
  }
  return pipeline.reduce((pre, postData) => {
    return postData(pre)
  }, data)
}

type OmitUndefined<T> = {
  [P in keyof T]: NonNullable<T[P]>
}

export const omitUndefined = <T extends ProComponentObject>(obj: T): OmitUndefined<T> => {
  const newObj = {} as ProComponentObject as T
  Object.keys(obj || {}).forEach((key) => {
    if (obj[key] !== undefined) {
      ;(newObj as ProComponentAny)[key] = obj[key]
    }
  })
  if (Object.keys(newObj as ProComponentObject).length < 1) {
    return undefined as ProComponentAny
  }
  return newObj as OmitUndefined<T>
}

// 不引用 lodash，实现使用的几个方法
export const omit = <
  T extends ProComponentObject = ProComponentObject,
  K extends KeyType = KeyType,
>(
  obj: T,
  keys: K | K[],
): T => {
  const result = { ...obj }
  const transKeys = Array.isArray(keys) ? keys : [keys]
  transKeys.forEach((key) => {
    if (key in obj) {
      delete result[key as keyof T]
    }
  })
  return result
}

export const isEmpty = (value: ProComponentAny): boolean => {
  if (value === null || value === undefined) {
    return true
  }
  if (typeof value === 'boolean') {
    // 布尔值不是空
    return false
  }
  if (typeof value === 'number') {
    // 数字不是空
    return false
  }
  if (typeof value === 'string' || Array.isArray(value)) {
    return value.length === 0
  }
  if (typeof value === 'object') {
    return Object.keys(value).length === 0
  }
  if (value instanceof Map || value instanceof Set) {
    // 空 Map/Set
    return value.size === 0
  }
  return false
}

export const isEqual = lodashEqual

export const pick = <T extends ProComponentObject, K extends keyof T>(
  obj: T,
  keys: K[],
): Pick<T, K> => {
  const result = {} as Pick<T, K>
  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key]
    }
  })
  return result
}

// 给数据添加统一的内部 key -> _proKey
// 如果本来就直接返回
export const addInternalKey = <T>(
  data: T | T[],
  idx: ProUnifyTableProviderProps<T>['internalIndex'],
): T | T[] => {
  if (Array.isArray(data)) {
    const allHasKey = data.every((item) => Object.prototype.hasOwnProperty.call(item, InternalKey))
    if (allHasKey) {
      return data
    }
    return data.map((item) => {
      if ((item as ProComponentAny)[InternalKey]) {
        return item
      }
      idx.value += 1
      return {
        ...item,
        [InternalKey]: `${InternalPrefix}${idx.value}`,
      }
    })
  }
  if ((data as ProComponentAny)[InternalKey]) {
    return data
  }
  idx.value += 1
  return {
    ...data,
    [InternalKey]: `${InternalPrefix}${idx.value}`,
  }
}

// 新增的行除了 InternalKey 外，还需要追加 rowKey 给 el-table 使用
export const addNewRecordKey = <T>(
  data: T,
  idx: ProUnifyTableProviderProps<T>['internalIndex'],
  rowKey: ProBaseTableProps['rowKey'],
): T => {
  if ((data as ProComponentAny)[InternalKey]) {
    return data
  }
  idx.value += 1
  const keyValue = `${InternalAddPrefix}${idx.value}`
  data[InternalKey as keyof T] = keyValue as unknown as T[keyof T]
  const tableKey = rowKey as keyof T
  // 不存在 rowKey，则赋值
  if (!data[tableKey]) {
    data[tableKey] = `${InternalAddPrefix}${idx.value}` as T[typeof tableKey]
  }
  return data
}

export function removeInternalKey<T>(data: T): T
export function removeInternalKey<T>(data: T[]): T[]
export function removeInternalKey<T extends ProComponentObject>(data: T | T[]): T | T[] {
  if (Array.isArray(data)) {
    return data.map((item): T => {
      return removeInternalKey<T>(item) as T
    })
  }
  // 为避免 rowKey 传递，使用如果data 中有值和属性 InternalKey 的值一样，也要移除
  const excludeKeys: (keyof T)[] = [InternalKey]
  Object.keys(data).forEach((dataKey) => {
    if (dataKey !== InternalKey && data[dataKey] === data[InternalKey]) {
      excludeKeys.push(dataKey)
    }
  })
  return omit(data, excludeKeys)
}

export const transScope = (scope: ProComponentAny) => {
  const { row, ...reset } = scope
  return {
    ...reset,
    row: removeInternalKey(row),
  }
}
// 把 column slot default 中的 scope 转换成统一的
export const transRowData = (scope: ProComponentAny) => {
  // console.log('=transRowData=', scope)
  const row = removeInternalKey(scope.row)
  return {
    row,
    rowData: row,
    rowIndex: scope.$index,
    column: scope.column,
    columnIndex: scope.cellIndex,
  }
}

// 根据row 的 rowKey 值返回在 tableData 中的序号
export const getDataIndexByRowKey = <T>(
  list: T[],
  keyValue: KeyType,
  getRowKey: ProTableGetRowKey<T>,
) => {
  const realList = list || []
  const index = realList.findIndex((item) => getRowKey(item) === keyValue)
  return index
}

// 生成序号
export const getOrder = (index: number, page: Required<ProTablePageParams>) => {
  return (page.currentPage - 1) * page.pageSize + index + 1
}

// 根据 tableData 的顺序，取 formData 的值，生成列表
export const getListFromForm = <T>(
  tableData: T[],
  formData: Record<KeyType, T>,
  getRowKey: ProTableGetRowKey<T>,
) => {
  const arr = []
  for (let i = 0; i < tableData.length; i++) {
    const item = tableData[i]
    const key = getRowKey(item)
    if (formData[key]) {
      arr.push(removeInternalKey(formData[key]))
    }
  }
  return arr
}

// 根据 keys 获取对应的对象
export const getDataFromKeys = <T>(
  keys: KeyType[],
  tableData: T[],
  getRowKey: ProTableGetRowKey<T>,
) => {
  const arr = []
  for (let i = 0; i < tableData.length; i++) {
    const item = tableData[i]
    const key = getRowKey(item)
    if (keys.includes(key)) {
      arr.push(item)
    }
  }
  return arr
}
// 根据 keys 获取对应的下标
export const getIndexFormKeys = <T>(
  keys: KeyType[],
  tableData: T[],
  getRowKey: ProTableGetRowKey<T>,
) => {
  const arr = []
  for (let i = 0; i < tableData.length; i++) {
    const item = tableData[i]
    const key = getRowKey(item)
    if (keys.includes(key)) {
      arr.push(i)
    }
  }
  return arr
}
// 根据 row 替换对应的数据
export const editTableDataByRow = <T>(
  rowData: T | T[],
  data: T[],
  getRowKey: ProTableGetRowKey<T>,
) => {
  const arr = Array.isArray(rowData) ? rowData : [rowData]
  const newData = data.slice(0)
  for (let i = 0; i < newData.length; i++) {
    const itemKey = getRowKey(newData[i])
    const index = arr.findIndex((item) => {
      return getRowKey(item) === itemKey
    })
    if (index !== -1) {
      newData[i] = arr[index]
    }
  }
  return newData
}
// 判断子集
export const isObjectSubset = <T>(subSet: T, fullSet: ProComponentObject): boolean => {
  for (const key in subSet) {
    if (!Object.prototype.hasOwnProperty.call(fullSet, key)) {
      return false
    }
    if (!isEqual(subSet[key], fullSet[key])) {
      return false
    }
  }
  return true
}

// 根据当前的 rowKey，获取对应的下标
export const findRowIndex = <T>(list: T[], getRowKey: ProTableGetRowKey<T>, rowKey?: KeyType) => {
  const index = list.findIndex((item) => {
    return getRowKey(item) === rowKey
  })
  return index
}

// 根据当前的rowKey，输出下一行 rowData
export const getNextRowData = <T>(list: T[], matcher: (item: T) => boolean): T | undefined => {
  const index = list.findIndex(matcher)
  return index >= 0 ? get(list, index + 1) : undefined
}

// 查找最前面的
export const findFirstMatchedKV = <T>(
  source: ProComponentObject,
  list: T[],
  cb: (v: T) => string,
) => {
  const sourceKeys = Object.keys(source)
  // const match = find(list, (item) => sourceKeys.includes(cb(item)))
  const index = list.findIndex((item) => {
    const key = cb(item)
    // 数字做 key 被转换成了字符串
    const strKey = isNumber(key) ? String(key) : key
    return sourceKeys.includes(strKey)
  })
  const item = index !== -1 ? list[index] : undefined
  return { match: item, index }
}

// 判断 column 是否能 focus，是否能编辑
export const columnCanFocus = <T extends ProComponentObject>(column: ProColumn<T>): boolean => {
  // 选择
  if (column.key === 'selection') {
    return false
  }
  // 序号
  if (column.type === 'index' || column.type === 'seq') {
    return false
  }
  // 操作列
  if (column.valueType === 'option') {
    return false
  }
  // 只读
  if (column.mode === 'read') {
    return false
  }
  // 禁用列
  const disabled = column.proFieldProps?.fieldProps?.disabled
  if (disabled) {
    return false
  }
  return true
}
// 找出可编辑的 column
export const getEditColumns = <T extends ProComponentObject>(columns: ProColumns<T>) => {
  return columns.filter(columnCanFocus<T>)
}
// 输出可编辑的 column key
export const getEditColumnsKey = <T extends ProComponentObject>(columns: ProColumns<T>) => {
  return columns.filter(columnCanFocus).map((column) => column.dataKey!)
}
// 找出可编辑的 column key
export const getRequiredColumnKeys = <T extends ProComponentObject>(
  columns: ProColumns<T>,
): string[] => {
  return columns
    .filter(columnCanFocus)
    .filter((column) => !!column.required)
    .map((column) => column.dataKey!)
}
// 根据一组 columnKeys 返回对应的 columns
export const getColumnsByKeys = <T extends ProComponentObject>(
  columns: ProColumns<T>,
  keys: string[],
) => {
  return columns.filter((column) => (column.dataKey ? keys.includes(column.dataKey) : false))
}

// 判断对象中包含的 `emptyColumns` 中所列的 key 对应的值是否为空
export const isEmptyInData = <T extends ProComponentObject>(
  data: T,
  rowKey: KeyType,
  emptyColumns: string[],
) => {
  // const empty = isEmpty(omit(data, [rowKey, InternalKey]))
  const res = emptyColumns
    .map((key) => {
      const curValue = getValue(data, key)
      return isEmpty(curValue)
    })
    .filter((item) => item === false)
  // console.log('=emptyColumns=', emptyColumns, data, res)
  return res.length === 0
}
// 移除数组中的空对象
export const clearArrayByEmpty = <T extends ProComponentObject>(
  arr: T[],
  rowKey: KeyType,
  emptyColumns: string[],
) => {
  if (arr.length > 0) {
    return arr
      .map((item) => {
        const lastIsEmpty = isEmptyInData(item, rowKey, emptyColumns)
        if (lastIsEmpty) {
          return null
        }
        return item
      })
      .filter((item) => item !== null)
  }
  return arr
}
// 找出数组中的空对象，格式[{ key }]
export const findDataByEmpty = <T extends ProComponentObject>(
  arr: T[],
  rowKey: KeyType,
  emptyColumns: string[],
): T[] => {
  if (arr.length > 0) {
    return arr
      .map((item) => {
        const lastIsEmpty = isEmptyInData(item, rowKey, emptyColumns)
        if (lastIsEmpty) {
          return item
        }
        return null
      })
      .filter((item) => item !== null)
  }
  return []
}

// 找出数组中的空对象，格式[key, key]
export const findKeysByEmpty = <T extends ProComponentObject>(
  arr: T[],
  rowKey: KeyType,
  getRowKey: ProTableGetRowKey<T>,
  emptyColumns: string[],
): string[] => {
  if (arr.length > 0) {
    return arr
      .map((item) => {
        const lastIsEmpty = isEmptyInData(item, rowKey, emptyColumns)
        if (lastIsEmpty) {
          return getRowKey(item) as string
        }
        return null
      })
      .filter((item) => item !== null)
  }
  return []
}

type ClearInvalidParams<T> = {
  invalidFields?: FormValidateFailure['fields']
  list: T[]
  rowKey: KeyType
  getRowKey: ProTableGetRowKey<T>
  includeEmpty?: boolean
  emptyColumns?: string[]
}
// 根据传入的校验未通过数据，移除空对象的校验再返回
export const clearInvalidField = <T extends ProComponentObject>(params: ClearInvalidParams<T>) => {
  // 按 key 分组
  const grouped = groupBy(entries(params.invalidFields || {}), ([key]) => key.split('.')[0])
  // 格式: res = { key: { columnKey: [], columnKey1: [], }, key1: { ... }, ... }
  const res = mapValues(grouped, (pairs) => {
    return fromPairs(
      pairs.map(([key, val]) => {
        // 移除 key 的第一位
        const keys = key.split('.')
        keys.shift()
        return [keys.join('.'), val]
      }),
    )
  })
  const includeEmpty = params.includeEmpty ?? false
  if (includeEmpty) {
    return {
      invalidFields: res,
      realData: params.list,
    }
  }
  const emptyColumns = params.emptyColumns as string[]
  const emptyKeys = findKeysByEmpty(params.list, params.rowKey, params.getRowKey, emptyColumns)
  emptyKeys.forEach((key) => {
    if (res[key]) {
      delete res[key]
    }
  })
  // console.log('=res=', res, emptyKeys)
  return {
    invalidFields: res,
    realData: clearArrayByEmpty(params.list, params.rowKey, emptyColumns),
  }
}
// 根据 columnKey 找出当前 column 的下标
export const findColumnIndex = <T extends ProComponentObject>(
  columns: ProColumns<T>,
  columnKey?: string,
) => {
  const columnIndex = columns.findIndex((item) => item.dataKey && item.dataKey === columnKey)
  return columnIndex
}
// 根据 columnKey 找出 column
export const findColumnByKey = <T extends ProComponentObject>(
  columns: ProColumns<T>,
  columnKey: string,
) => {
  const column = columns.find((item) => item.dataKey && item.dataKey === columnKey)
  return column
}
// 判断 column 是否 fixed
export const isColumnFixed = (td: HTMLTableCellElement) => {
  const cl = td.classList
  return cl.contains('el-table-fixed-column--left') || cl.contains('el-table-fixed-column--right')
}
// 根据当前的 column 元素，获取当前行左侧和右侧的 fixed column 宽度
export const getFixedColumnsWidth = (td: HTMLTableCellElement) => {
  let leftOffset = 0
  let rightOffset = 0
  const parent = td.parentNode as HTMLTableRowElement
  const fixedLeftEls = parent.querySelectorAll('.el-table-fixed-column--left')
  const fixedRightEls = parent.querySelectorAll('.el-table-fixed-column--right')
  fixedLeftEls.forEach((el) => {
    leftOffset += (el as HTMLTableCellElement).offsetWidth
  })

  fixedRightEls.forEach((el) => {
    rightOffset += (el as HTMLTableCellElement).offsetWidth
  })
  return {
    left: leftOffset,
    right: rightOffset,
  }
}
// 递归 children
export const flattenTree = <T = ProComponentObject>(list: T[]): T[] => {
  return flatMap(list, (item: ProComponentObject) => {
    const children = item.children || []
    return [item, ...flattenTree(children)]
  }) as T[]
}

// 找出 columns 的深度
export const getColumnsDepth = <T extends ProComponentObject>(columns?: ProColumns<T>) => {
  let maxDepth = 1
  if (!columns || columns.length === 0) {
    return maxDepth
  }
  for (let i = 0; i < columns.length; i += 1) {
    const currentDepth = columns[i].children ? getColumnsDepth(columns[i].children) + 1 : 1
    // 更新最大深度
    if (currentDepth > maxDepth) {
      maxDepth = currentDepth
    }
  }
  return maxDepth
}
