import {
  computed,
  reactive,
  ref,
  shallowRef,
  toRaw,
  onMounted,
  watch,
  type Ref,
  type ComputedRef,
  nextTick,
} from 'vue'
import { isEqual, flatMapDeep } from 'lodash-unified'
import { createFetch } from '../utils/createFetch'
import {
  postDataPipeline,
  addInternalKey,
  removeInternalKey,
  clearArrayByEmpty,
  findDataByEmpty,
  flattenTree,
} from './utils'
import type { ProComponentObject } from '../common.types'
import type { DeferredExcutorType } from '../utils/defer'
import type {
  KeyType,
  ProBaseTableProps,
  ProTablePageParams,
  ProTableGetRowKey,
} from './table.types'
import type { ProUnifyTableProviderProps } from './proTable.types'

type useRequestOptions<T extends ProComponentObject> = {
  deferReadyExecutor: DeferredExcutorType
  showPage: boolean
  waterfall: boolean
  manualRequest?: boolean
  pagination?: ProBaseTableProps['pagination']
  internalIndex: ProUnifyTableProviderProps<T>['internalIndex']
  rowKey: ProBaseTableProps['rowKey']
  data: Ref<T[] | undefined>
  params: Ref<ProComponentObject | undefined>
  tableFirstRef: Ref<boolean>
  onFirst: () => void
  getEmptyColumnKeys: () => string[]
  getDefaultRow: () => boolean
  getRowKey: ComputedRef<ProTableGetRowKey<T>>
  isAutoPageSize: ComputedRef<boolean>
} & Pick<
  ProBaseTableProps<T>,
  | 'dataSource'
  | 'defaultData'
  | 'onLoad'
  | 'onRequestError'
  | 'postData'
  | 'defaultSearchForm'
  | 'onDataChange'
  | 'sliceRender'
>

type transPageResType = {
  size: number
  from: number
  scrollId?: string
}
// page 转换
const transPage = (pageValue: ProTablePageParams) => {
  // currentPage -> from, pageSize -> size
  const { currentPage = 1, pageSize = 10, scrollId } = pageValue
  const res: transPageResType = {
    size: pageSize,
    from: (currentPage - 1) * pageSize,
  }
  if (scrollId) {
    res.scrollId = scrollId
  }
  return res
}

// 只返回 children
const extractAllChildren = <T>(arr: T[]): T[] => {
  return flatMapDeep<T, T>(arr, (item) => {
    const realItem = item as T & { children?: T[] }
    // 若当前项有 children 且为数组，返回 [children元素, 递归处理children的结果]
    return realItem.children && Array.isArray(realItem.children)
      ? [...realItem.children, extractAllChildren(realItem.children)]
      : []
  })
}

// 所有的参数都应该在此维护
const useRequest = <T extends ProComponentObject>(
  request: ProBaseTableProps<T>['request'],
  options: useRequestOptions<T>,
) => {
  const manualRequest = request ? (options.manualRequest ?? false) : true
  const initRequest = !manualRequest
  const showPage = options.showPage
  const waterfall = options.waterfall
  const tableData = shallowRef<T[]>([])
  const initPage = options.pagination ? options.pagination : {}
  const loading = ref(initRequest)
  const error = ref('')
  const first = ref(true) // 区分第一次请求和后续的请求，表格的 loading 展示不一样
  // 页码数据
  const pageInfo = reactive<ProTablePageParams>({
    currentPage: initPage.currentPage ?? 1,
    pageSize: initPage.pageSize ?? 10,
    total: 0,
    hasMore: true,
  })

  const searchForm = reactive<ProComponentObject>(options.defaultSearchForm || {})

  const setLoading = (v: boolean) => {
    loading.value = v
  }
  const setTableData = (data: T[], isCover?: boolean) => {
    const dataWithKey = addInternalKey<T>(data, options.internalIndex)
    if (isCover) {
      // 清空
      if (data && data.length === 0) {
        options.deferReadyExecutor.reset()
      }
      tableData.value = dataWithKey as T[]
    } else {
      // 找出空的行
      const emptyDataList = findDataByEmpty(
        tableData.value,
        options.rowKey,
        options.getEmptyColumnKeys(),
      )
      const fullDataList = clearArrayByEmpty(
        tableData.value,
        options.rowKey,
        options.getEmptyColumnKeys(),
      )
      tableData.value = fullDataList.concat(dataWithKey, emptyDataList)
    }
    options.onDataChange?.(toRaw(tableData.value))
  }

  // 移除空行后的数据
  const getRealTableData = () => {
    const list = getRealTableDataHasKey()
    return removeInternalKey<T>(list)
  }

  const getRealTableDataHasKey = () => {
    const defaultRow = options.getDefaultRow()
    return defaultRow
      ? clearArrayByEmpty(toRaw(tableData.value), options.rowKey, options.getEmptyColumnKeys())
      : getTableDataHasKey()
  }

  const getTableData = () => {
    const dateNoKey = removeInternalKey<T>(tableData.value)
    return dateNoKey as T[]
  }

  const getRowDataByIndex = (index: number) => {
    return tableData.value[index]
  }

  const getTableDataHasKey = () => {
    return toRaw(tableData.value).slice()
  }

  const getTableDataSize = () => {
    return tableData.value.length
  }

  // 把 data 的 children 平铺出来
  const tableDataAndChildren = computed(() => {
    return flattenTree<T>(tableData.value)
  })
  const getTableDataAndChildren = () => {
    return tableDataAndChildren.value
  }

  const getTableDataAllChildren = (list?: T[]) => {
    return extractAllChildren<T>(list || tableData.value)
  }

  const getTableChildrenByRowValue = (keyValue: KeyType) => {
    const allData = getTableDataAndChildren()
    const matchedList = allData.filter((item) => options.getRowKey.value(item) === keyValue)
    if (matchedList) {
      return getTableDataAllChildren(matchedList)
    }
    return []
  }

  // 根据 rowValue 返回对应父级的 children
  const getParentByRowValue = (keyValue: KeyType) => {
    const allData = getTableDataAndChildren()
    const parent = allData.find((item) => {
      const children = item.children || []
      if (children.length > 0) {
        return children.findIndex((child: T) => options.getRowKey.value(child) === keyValue) > -1
      }
      return false
    })
    if (parent) {
      return parent
    }
    return undefined
  }

  const setSearchForm = (formValues: ProComponentObject) => {
    // 如果form 存在的覆盖 searchForm 中的值，不存在则保持 searchForm 中的值
    if (formValues) {
      if (typeof formValues !== 'object') {
        throw new Error('formValues 必须是一个 object')
      }
      Object.keys(formValues).forEach((key) => {
        if (formValues[key] !== undefined && formValues[key] !== null) {
          searchForm[key] = formValues[key]
        }
      })
    }
  }

  const clearSearchForm = () => {
    for (const key in searchForm) {
      Reflect.deleteProperty(searchForm, key)
    }
  }

  const resetPage = () => {
    pageInfo.currentPage = 1
    pageInfo.total = 0
    pageInfo.hasMore = true
    if (pageInfo.scrollId) {
      Reflect.deleteProperty(pageInfo, 'scrollId')
      // delete pageInfo.scrollId
    }
  }

  const resetRequest = () => {
    options.tableFirstRef.value = true
    resetPage()
    if (waterfall) {
      // 瀑布流模式还原
      setFirst(true)
      setTableData([], true)
    }
  }

  const setPage = (changedPage: ProTablePageParams) => {
    if (changedPage.currentPage) {
      pageInfo.currentPage = changedPage.currentPage
    }
    if (changedPage.pageSize) {
      pageInfo.pageSize = changedPage.pageSize
    }
  }

  const setFirst = (v: boolean) => {
    first.value = v
  }

  const enhanceFetch = createFetch(
    request
      ? (p?: ProComponentObject) => {
          const pageValue = toRaw(pageInfo)
          const realPage = showPage || waterfall ? transPage(pageValue) : {}
          // console.log('=realPage=', realPage, showPage)
          const searchFormValues = toRaw(searchForm)
          const extraParams = options.params.value ? toRaw(options.params.value) : {}
          const params = {
            ...realPage,
            ...searchFormValues,
            ...extraParams,
          }
          const data = p && p.isData ? tableData.value : undefined
          return request(params, data)
        }
      : undefined,
    () => {
      first.value = false
      loading.value = false
    },
  )
  const fetchSucc = (res: any) => {
    if (res) {
      const { data } = res
      if (showPage) {
        pageInfo.total = data.count
      }
      const responseData = postDataPipeline<T[]>(
        data.result || data || [],
        [options.postData].filter((item) => !!item),
      )
      // 有些接口 data 就是数组
      if (!waterfall) {
        setTableData(responseData, true)
      } else {
        setTableData(responseData)
        // tableData.value = tableData.value.concat(responseData)
        pageInfo.scrollId = data.scrollId
        pageInfo.hasMore = data.hasMore ?? false
      }
      options.onLoad?.(responseData)
    }
  }
  const fetch = (isData: boolean = false) => {
    // 瀑布流场景
    if (waterfall && !pageInfo.hasMore) {
      return Promise.resolve()
    }
    // 避免重复请求，瀑布流场景不考虑
    if (!first.value && !waterfall && loading.value) {
      return Promise.resolve()
    }
    loading.value = true
    return enhanceFetch({ isData })
      .then((res: any) => {
        fetchSucc(res)
        nextTick(() => {
          options.deferReadyExecutor.exec()
        })
      })
      .catch((e: Error) => {
        error.value = e.message
        options.onRequestError?.(e)
      })
  }
  // 导出场景循环调用
  const pureFetch = (pageInfo: ProTablePageParams) => {
    if (request) {
      const searchFormValues = toRaw(searchForm)
      const extraParams = options.params.value ? toRaw(options.params.value) : {}
      const params = {
        ...transPage(pageInfo),
        ...searchFormValues,
        ...extraParams,
      }
      return request(params).then((res: any) => {
        const { data } = res
        const responseData = postDataPipeline<T[]>(
          data.result || data || [],
          [options.postData].filter((item) => !!item),
        )
        return {
          data: responseData,
          scrollId: data.scrollId,
          hasMore: data.hasMore ?? false,
        }
      })
    }
    // 如果传入的 data，则认为没有翻页
    return Promise.resolve({
      data: tableData.value,
      hasMore: false,
    })
  }

  // 提供一个方法给下拉表格场景使用，需要做第一次和请求中的过滤，防止重复请求
  const selectFirst = ref(true)
  const selectFetch = (cb: () => void) => {
    // 只有调用一次
    if (!selectFirst.value) {
      cb()
      return
    }
    if (loading.value) {
      return
    }
    loading.value = true
    return enhanceFetch()
      .then((res: any) => {
        fetchSucc(res)
        nextTick(() => {
          options.deferReadyExecutor.exec()
        })
        selectFirst.value = false
      })
      .catch((e: Error) => {
        error.value = e.message
        options.onRequestError?.(e)
        selectFirst.value = false
      })
  }

  watch(options.data, (newVal) => {
    // console.log('=newVal=', newVal, tableData.value)
    if (newVal && toRaw(newVal) !== toRaw(tableData.value)) {
      if (!isEqual(toRaw(newVal), toRaw(tableData.value))) {
        setTableData(newVal, true)
      }
    }
  })

  watch(
    options.params,
    () => {
      // 改变了重新请求
      resetRequest()
      fetch()
    },
    { deep: true },
  )

  onMounted(() => {
    if (options.defaultData && options.defaultData.length > 0) {
      setTableData(options.defaultData, true)
    } else if (options.dataSource && options.dataSource.length > 0) {
      setTableData(options.dataSource, true)
    } else if (options.data.value && options.data.value.length > 0) {
      setTableData(options.data.value, true)
    }
    // 如果没有请求，数据是外部传入的
    if (!request) {
      options.onFirst()
    }
    if (initRequest && !options.isAutoPageSize.value) {
      fetch()
    }
  })

  return {
    fetchMethod: fetch,
    selectFetch,
    pureFetch,
    setPage,
    setSearchForm,
    clearSearchForm,
    setLoading,
    setTableData,
    getTableData,
    getRealTableData,
    getTableDataHasKey,
    getRealTableDataHasKey,
    getTableDataAndChildren,
    getTableDataAllChildren,
    getTableChildrenByRowValue,
    getParentByRowValue,
    resetRequest,
    setFirst,
    getTableDataSize,
    getRowDataByIndex,
    loading,
    error,
    tableData,
    pageInfo,
    searchForm,
    first,
  }
}
export default useRequest
