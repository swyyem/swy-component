/**
 * 延迟执行器
 * 用于延迟执行回调函数，支持重置和批量执行
 */

type Callback = () => void

/** 延迟执行器类型 */
export type DeferredExcutorType = {
  reset: () => void // 重置状态
  add: (v: Callback) => void // 添加回调
  exec: () => void // 执行所有回调
}

/** 创建延迟执行器 */
export const createDeferredExecutor = () => {
  let ready = false // 是否已就绪
  const queue: Callback[] = [] // 回调队列

  return {
    /** 重置状态 */
    reset() {
      ready = false
    },

    /** 添加回调函数 */
    add(cb: Callback) {
      if (ready) {
        // 如果已就绪，直接执行
        cb()
      } else {
        // 否则加入队列
        queue.push(cb)
      }
    },

    /** 执行所有回调 */
    exec() {
      if (queue.length === 0) {
        return
      }
      ready = true
      queue.forEach((cb) => cb())
      queue.length = 0 // 清空队列
    },
  }
}
