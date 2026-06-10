import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  watch,
  nextTick,
  type Ref,
  type ShallowRef,
  shallowRef,
} from 'vue'

export interface UseVirtualListOptions {
  /** 滚动容器的引用 */
  containerRef: Ref<HTMLElement | null>
  /** 列表项总数 */
  itemCount: Ref<number> | number
  /** 预估行高（动态行高时作为兜底值） */
  estimatedHeight?: number
  /** 固定行高（传入则为固定高度模式，性能更好） */
  fixedHeight?: number
  /** 上下缓冲区行数（防止快速滚动白屏） */
  overscan?: number
  /** 获取指定索引的行高（动态行高模式） */
  getItemHeight?: (index: number) => number | undefined
}

export interface VirtualListReturn {
  /** 可见区域的列表项 */
  visibleItems: Ref<Array<{ index: number; offset: number; size: number }>>
  /** 列表总高度（用于撑开滚动区域） */
  totalHeight: Ref<number>
  /** 可见区域起始偏移（用于 transform） */
  offsetTop: Ref<number>
  /** 起始索引 */
  startIndex: Ref<number>
  /** 结束索引 */
  endIndex: Ref<number>
  /** 滚动事件处理器 */
  onScroll: (e: Event) => void
  /** 滚动到指定索引 */
  scrollToIndex: (index: number) => void
  /** 更新指定索引的真实高度（由 ResizeObserver 调用） */
  updateItemHeight: (index: number, height: number) => void
  /** 重新计算（数据源变化后调用） */
  recalculate: () => void
  /** 用于列表项的 ResizeObserver 绑定辅助 */
  measureElement: (el: HTMLElement | null, index: number) => void
}

/**
 * 虚拟滚动 Hook
 *
 * 核心三层机制：
 * 1. 预估高度兜底 → 首次渲染不阻塞
 * 2. ResizeObserver 异步测量 → 写入高度缓存
 * 3. 高度缓存复用 → 后续滚动性能提升
 */
export function useVirtualList(options: UseVirtualListOptions): VirtualListReturn {
  const {
    containerRef,
    estimatedHeight = 40,
    fixedHeight,
    overscan = 5,
    getItemHeight,
  } = options

  // ==================== 状态 ====================
  const scrollTop = ref(0)
  const containerHeight = ref(0)

  // 高度缓存：Map<index, measuredHeight>
  const heightCache = new Map<number, number>()

  // ResizeObserver 实例管理
  let resizeObserver: ResizeObserver | null = null
  const observedElements = new Map<HTMLElement, number>()

  // ==================== 计算属性 ====================

  const itemCount = computed(() => {
    const count = options.itemCount
    return typeof count === 'number' ? count : count.value
  })

  /** 获取某行的高度（优先缓存 → 自定义 → 预估） */
  function getHeight(index: number): number {
    if (fixedHeight) return fixedHeight
    if (heightCache.has(index)) return heightCache.get(index)!
    if (getItemHeight) {
      const h = getItemHeight(index)
      if (h !== undefined) return h
    }
    return estimatedHeight
  }

  /** 获取某行的偏移量（累加前面所有行的高度） */
  function getOffset(index: number): number {
    let offset = 0
    for (let i = 0; i < index; i++) {
      offset += getHeight(i)
    }
    return offset
  }

  /** 二分查找：根据 scrollTop 找到起始索引 */
  function findStartIndex(scrollOffset: number): number {
    // 固定高度：直接计算
    if (fixedHeight) {
      return Math.floor(scrollOffset / fixedHeight)
    }

    // 动态高度：二分查找
    let low = 0
    let high = itemCount.value - 1
    let offset = 0

    while (low <= high) {
      const mid = Math.floor((low + high) / 2)
      offset = getOffset(mid)

      if (offset === scrollOffset) {
        return mid
      } else if (offset < scrollOffset) {
        low = mid + 1
      } else {
        high = mid - 1
      }
    }
    return Math.max(0, low - 1)
  }

  // 可见区域计算
  const startIndex = computed(() => {
    const start = findStartIndex(scrollTop.value)
    return Math.max(0, start - overscan)
  })

  const endIndex = computed(() => {
    const viewportEnd = scrollTop.value + containerHeight.value
    let end = startIndex.value + overscan // 从 start 开始

    // 向下累加直到超过可视区域底部
    let offset = getOffset(startIndex.value)
    for (let i = startIndex.value; i < itemCount.value; i++) {
      offset += getHeight(i)
      end = i
      if (offset >= viewportEnd) break
    }

    return Math.min(itemCount.value - 1, end + overscan)
  })

  // 总高度
  const totalHeight = computed(() => {
    if (fixedHeight) return itemCount.value * fixedHeight

    let total = 0
    for (let i = 0; i < itemCount.value; i++) {
      total += getHeight(i)
    }
    return total
  })

  // 偏移量
  const offsetTop = computed(() => {
    return getOffset(startIndex.value)
  })

  // 可见列表项
  const visibleItems = computed(() => {
    const items: Array<{ index: number; offset: number; size: number }> = []
    let offset = getOffset(startIndex.value)

    for (let i = startIndex.value; i <= endIndex.value && i < itemCount.value; i++) {
      const size = getHeight(i)
      items.push({ index: i, offset, size })
      offset += size
    }
    return items
  })

  // ==================== 方法 ====================

  /** 滚动事件处理 */
  function onScroll(e: Event) {
    const target = e.target as HTMLElement
    scrollTop.value = target.scrollTop
  }

  /** 滚动到指定索引 */
  function scrollToIndex(index: number) {
    const container = containerRef.value
    if (!container) return

    const offset = getOffset(index)
    container.scrollTop = offset
    scrollTop.value = offset
  }

  /** 更新指定索引的真实高度 */
  function updateItemHeight(index: number, height: number) {
    const oldHeight = heightCache.get(index)
    if (oldHeight !== height) {
      heightCache.set(index, height)
    }
  }

  /** 重新计算（清空缓存） */
  function recalculate() {
    heightCache.clear()
    scrollTop.value = containerRef.value?.scrollTop ?? 0
  }

  /**
   * 测量元素高度（绑定到列表项 DOM 上）
   * 用法：<div :ref="(el) => measureElement(el, index)">
   */
  function measureElement(el: HTMLElement | null, index: number) {
    if (!el) return

    // 已经在观察了就跳过
    if (observedElements.has(el) && observedElements.get(el) === index) return

    // 取消旧观察
    if (observedElements.has(el)) {
      resizeObserver?.unobserve(el)
    }

    // 存储 index 到元素上
    ;(el as any).__virtualIndex = index
    observedElements.set(el, index)

    // 立即测量一次
    const height = el.getBoundingClientRect().height
    if (height > 0) {
      updateItemHeight(index, height)
    }

    // 观察后续尺寸变化
    resizeObserver?.observe(el)
  }

  // ==================== 生命周期 ====================

  onMounted(() => {
    const container = containerRef.value
    if (container) {
      containerHeight.value = container.clientHeight

      // 监听容器尺寸变化
      const containerObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          containerHeight.value = entry.contentRect.height
        }
      })
      containerObserver.observe(container)
    }

    // 创建列表项 ResizeObserver
    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const el = entry.target as HTMLElement
        const index = (el as any).__virtualIndex
        if (index !== undefined) {
          const height = entry.contentRect.height
          if (height > 0) {
            updateItemHeight(index, height)
          }
        }
      }
    })
  })

  onBeforeUnmount(() => {
    resizeObserver?.disconnect()
    resizeObserver = null
    observedElements.clear()
    heightCache.clear()
  })

  return {
    visibleItems,
    totalHeight,
    offsetTop,
    startIndex,
    endIndex,
    onScroll,
    scrollToIndex,
    updateItemHeight,
    recalculate,
    measureElement,
  }
}
