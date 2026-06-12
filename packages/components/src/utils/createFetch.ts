export function createFetch<P, R>(
  fn?: (params?: P) => Promise<R>,
  cb?: () => void,
): (params?: P) => Promise<R> {
  let reqId = 0
  const nullValue = null as unknown as R

  return function (params?: P): Promise<R> {
    const currentId = ++reqId
    if (!fn) {
      return Promise.resolve(nullValue).finally(() => cb?.()) as Promise<R>
    }
    return fn(params)
      .then((result) => {
        if (currentId === reqId) {
          return result
        } else {
          return nullValue
        }
      })
      .catch((err) => {
        if (currentId === reqId) {
          return Promise.reject(err)
        } else {
          return nullValue
        }
      })
      .finally(() => {
        if (currentId === reqId && cb) {
          cb()
        }
      })
  }
}
