/**
 * 防抖
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay = 300
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null
  return function (...args: Parameters<T>) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

/**
 * 节流
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  interval = 300
): (...args: Parameters<T>) => void {
  let last = 0
  return function (...args: Parameters<T>) {
    const now = Date.now()
    if (now - last >= interval) {
      last = now
      fn(...args)
    }
  }
}

/**
 * 判断是否为对象
 */
export function isObject(val: unknown): val is Record<string, any> {
  return val !== null && typeof val === 'object'
}

/**
 * 生成唯一 ID
 */
export function generateId(prefix = 'swy'): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`
}
