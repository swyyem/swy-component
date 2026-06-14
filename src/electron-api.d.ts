import type { ProSystemInfoType, ProEnvType, ProPrintCb } from './tool/index.types'

export interface ElectronAPI {
  navigateToUrl: (url: string) => Promise<void>
  reload: () => Promise<void>
  getUrl: () => Promise<string>
  closeWindow: () => void
  getSystemInfo: () => Promise<ProSystemInfoType>
  getEnv: () => Promise<ProEnvType>
  print: ProPrintCb
}

// 声明扩展 window 对象
declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
