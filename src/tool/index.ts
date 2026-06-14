import { ElMessage } from 'element-plus'
import { getSystemInfo } from './system'
import { getEnv } from './env'
import cookieUtil from './cookie'
import { localStorage, sessionStorage } from './storage'
import color from './color'
import upload from './upload'
import type { ProSystemInfoType, ProEnvType, ProPrintCb } from './index.types'

export interface ProToolType {
  isElectron: boolean
  systemInfoAsync: () => Promise<ProSystemInfoType>
  envAsync: () => Promise<ProEnvType>
  print: ProPrintCb
}
abstract class BaseEnv {
  abstract isElectron: boolean
  abstract systemInfoAsync: ProToolType['systemInfoAsync']
  abstract envAsync: ProToolType['envAsync']
  abstract print: ProToolType['print']
  cookieUtil = cookieUtil
  localStorage = localStorage
  sessionStorage = sessionStorage
  color = color
  upload = upload
}

const hasElectron = typeof window.electronAPI !== 'undefined'
const browserInfo = getSystemInfo()
class ElectronEnv extends BaseEnv {
  isElectron = true
  cookieUtil = cookieUtil
  systemInfoAsync = () => {
    return window.electronAPI.getSystemInfo().then((v) => {
      v.version = browserInfo.version
      return v
    })
  }
  envAsync = window.electronAPI.getEnv
  print = window.electronAPI.print
}

class BrowserEnv extends BaseEnv {
  isElectron = false
  cookieUtil = cookieUtil
  systemInfoAsync = () => Promise.resolve(browserInfo)
  envAsync = () => Promise.resolve(getEnv())
  print = () => ElMessage.error('浏览器端不支持打印')
}
const ProTool = hasElectron ? new ElectronEnv() : new BrowserEnv()
export default ProTool
