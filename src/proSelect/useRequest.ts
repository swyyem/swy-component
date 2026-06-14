import { reactive, shallowRef, ref, onMounted, toRaw, watch, type Ref } from 'vue'
import { uniqBy, isEqual } from 'lodash-unified'
import { isPlainObject } from '../utils'
import type { ProTablePageParams } from '../proTable/table.types'
import type { ProSchemaValueEnumType, ProSchemaValueEnumValue } from '../proField'
import type { ProSelectEnhanceProps } from './select.types'
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

export const useRequest = (options: {
  valueKey: string
  request?: ProSelectEnhanceProps['remoteMethod']
  params: Ref<ProSelectEnhanceProps['params']>
  waterfall?: ProSelectEnhanceProps['waterfall']
  manualRequest?: boolean
  defaultValueEnum?: ProSelectEnhanceProps['defaultValueEnum']
  valueEnum?: Ref<ProSelectEnhanceProps['valueEnum']>
  handleValueEnumChange?: ProSelectEnhanceProps['handleValueEnumChange']
}) => {
  const waterfall = options.waterfall
  const manualRequest = options.request ? (options.manualRequest ?? false) : true
  const loading = ref(!manualRequest)
  const first = ref(options.request ? true : false)
  const initPage: ProTablePageParams = {}
  // 初始值
  let initValueEnum: ProSchemaValueEnumType[] = []
  if (options.valueEnum && options.valueEnum.value) {
    initValueEnum = toRaw(options.valueEnum.value)
  } else if (options.defaultValueEnum) {
    initValueEnum = options.defaultValueEnum
  }
  const OptionsValue = shallowRef<ProSchemaValueEnumType[]>(initValueEnum)
  const getRealValue = (item: ProSchemaValueEnumType) => {
    if (isPlainObject(item.value)) {
      const value = (item.value as ProSchemaValueEnumValue)[options.valueKey]
      return value
    } else {
      return item.value
    }
  }
  const setData = (data: ProSchemaValueEnumType[], isCover?: boolean) => {
    if (isCover) {
      OptionsValue.value = uniqBy(data, getRealValue)
    } else {
      OptionsValue.value = uniqBy(OptionsValue.value.concat(data), getRealValue)
    }
    if (options.handleValueEnumChange) {
      options.handleValueEnumChange(toRaw(OptionsValue.value))
    }
    // console.log('=OptionsValue=', data, OptionsValue.value)
  }
  // 页码数据
  const pageInfo = reactive<ProTablePageParams>({
    currentPage: initPage.currentPage ?? 1,
    pageSize: initPage.pageSize ?? 10,
    total: 0,
    hasMore: true,
  })

  const resetPage = () => {
    pageInfo.currentPage = 1
    pageInfo.pageSize = initPage.pageSize ?? 10
    pageInfo.total = 0
    pageInfo.hasMore = true
    if (pageInfo.scrollId) {
      delete pageInfo.scrollId
    }
  }

  const resetRequest = () => {
    resetPage()
    setData(initValueEnum, true)
  }

  const setPage = (changedPage: ProTablePageParams) => {
    if (changedPage.currentPage) {
      pageInfo.currentPage = changedPage.currentPage
    }
    if (changedPage.pageSize) {
      pageInfo.pageSize = changedPage.pageSize
    }
  }

  let currentReqId = 0
  const fetch = (v?: any) => {
    if (options.request) {
      // 瀑布流场景才需要判断 hasMore
      if (waterfall && !pageInfo.hasMore) {
        return
      }
      // 避免重复请求
      // if (!first.value && loading.value) {
      //   return
      // }
      // 处理请求竟态问题
      currentReqId += 1
      const reqId = currentReqId
      loading.value = true
      // 如果不是瀑布流且不是第一次，则需要清除当前 valueEnum
      if (!first.value && !waterfall) {
        setData(initValueEnum, true)
      }
      const pageValue = toRaw(pageInfo)
      const realPage = transPage(pageValue)
      const params: any = waterfall
        ? {
            ...options.params.value,
            ...realPage,
          }
        : { ...options.params.value }
      if (v) {
        params.keyword = v
      }
      options
        .request(params)
        .then((res: any) => {
          if (reqId === currentReqId) {
            const { data } = res
            if (waterfall) {
              setData(data.result)
              pageInfo.scrollId = data.scrollId
              pageInfo.hasMore = data.hasMore ?? false
            } else {
              setData(data.result || data, true)
            }
          }
        })
        .catch((e: Error) => {
          console.error(e)
        })
        .finally(() => {
          if (reqId === currentReqId) {
            first.value = false
            loading.value = false
          }
        })
    }
  }

  watch(
    () => options.valueEnum?.value,
    (val) => {
      if (isEqual(val, OptionsValue.value)) {
        return
      }
      OptionsValue.value = toRaw(val) || []
    },
  )

  onMounted(() => {
    if (!manualRequest) {
      fetch()
    }
  })

  return {
    loading: loading,
    first: first,
    valueEnum: OptionsValue,
    pageInfo: pageInfo,
    onFetch: fetch,
    setPage: setPage,
    resetPage: resetPage,
    resetRequest: resetRequest,
    getRealValue,
  }
}
