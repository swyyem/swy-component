type Callback = () => void
export type DeferredExcutorType = {
  reset: () => void
  add: (v: Callback) => void
  exec: () => void
}
export const createDeferredExecutor = () => {
  let ready = false
  const queue: Callback[] = []

  return {
    reset() {
      ready = false
    },
    add(cb: Callback) {
      if (ready) {
        cb()
      } else {
        queue.push(cb)
      }
    },
    exec() {
      if (queue.length === 0) {
        return
      }
      ready = true
      queue.forEach((cb) => cb())
      queue.length = 0
    },
  }
}
