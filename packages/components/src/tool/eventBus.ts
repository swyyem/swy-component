type EventCallback = (data?: Record<string, any>) => boolean | void

type EventType = Record<string, EventCallback[]>
class ChainEventBus {
  private events: EventType = {}
  // 监听事件
  on(type: string, callback: EventCallback): this {
    if (typeof callback !== 'function') {
      console.error(`事件 ${type} 的回调必须是函数`)
      return this
    }
    if (!this.events[type]) {
      this.events[type] = []
    }
    if (!this.events[type].includes(callback)) {
      this.events[type].push(callback)
    }
    return this
  }

  // 发送事件：返回 this 支持链式
  async emit(type: string, data?: Record<string, any>): Promise<boolean> {
    if (this.events[type]) {
      // 拷贝一份回调数组，避免遍历中删除回调导致的异常
      const callbacks = [...this.events[type]]
      let needPrevent = true
      for (let i = 0; i < callbacks.length; i += 1) {
        try {
          const res = await callbacks[i]?.(data)
          if (res === false) {
            needPrevent = res
            break
          }
        } catch (err) {
          console.error(`事件 ${type} 的回调执行失败：`, err)
        }
      }
      return needPrevent
    }
    return true
  }

  // 卸载事件：支持两种用法
  // 1. off(type) - 删除 type 下所有回调
  // 2. off(type, callback) - 删除 type 下指定的 callback
  off(type: string, callback: EventCallback): this {
    if (!this.events[type]) {
      return this
    }
    if (typeof callback === 'undefined') {
      delete this.events[type]
    } else if (typeof callback === 'function') {
      this.events[type] = this.events[type].filter((cb) => cb !== callback)
      if (this.events[type].length === 0) {
        delete this.events[type]
      }
    } else {
      console.error(`事件 ${type} 的卸载回调必须是函数`)
    }
    return this
  }

  offAll() {
    this.events = {}
    return this
  }
}
export default ChainEventBus
export type ChainEventBusInstance = InstanceType<typeof ChainEventBus>
