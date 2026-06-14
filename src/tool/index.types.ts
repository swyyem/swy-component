export type ProSystemInfoType = {
  platform: string
  version: string
  ip: string
  mac: string
  hostname: string
  cpuCount: number
  memory: number
  serial: string
}

export type ProEnvType = {
  electron: {
    dev: boolean
    prod: boolean
    test: boolean
    stage: boolean
    online: boolean
  }
}

type PrintOptionsType = {
  onSuccess: () => void
  onError: (v: string) => void
}
export type ProPrintCb = (pdfBuffer: ArrayBuffer, options?: PrintOptionsType) => void

export type ProCookieAttributes = {
  expires?: number | Date // 过期时间（天数 或 Date 对象）
  path?: string
  domain?: string
  secure?: boolean
  sameSite?: 'Lax' | 'Strict' | 'None'
}
