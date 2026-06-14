import { memoize } from 'lodash-unified'

export const getEnv = memoize(() => {
  const electron = {
    dev: false,
    prod: false,
    test: false,
    stage: false,
    online: false,
  }
  return {
    electron,
  }
})
