/**
 * 创建防抖请求函数
 * 用于处理并发请求，只保留最后一次请求的结果
 * @param fn 请求函数
 * @param cb 请求完成后的回调
 * @returns 包装后的请求函数
 */
export function createFetch<P, R>(
  fn?: (params?: P) => Promise<R>,
  cb?: () => void,
): (params?: P) => Promise<R> {
  let reqId = 0 // 请求 ID 计数器
  const nullValue = null as unknown as R // 空值

  return function (params?: P): Promise<R> {
    const currentId = ++reqId // 当前请求 ID

    // 如果没有请求函数，直接返回 null
    if (!fn) {
      return Promise.resolve(nullValue).finally(() => cb?.()) as Promise<R>
    }

    return fn(params)
      .then((result) => {
        // 只返回最后一次请求的结果
        if (currentId === reqId) {
          return result
        } else {
          return nullValue
        }
      })
      .catch((err) => {
        // 只reject 最后一次请求的错误
        if (currentId === reqId) {
          return Promise.reject(err)
        } else {
          return nullValue
        }
      })
      .finally(() => {
        // 只执行最后一次请求的回调
        if (currentId === reqId && cb) {
          cb()
        }
      })
  }
}
