import { memoize } from 'lodash-unified'
import type { ProSystemInfoType } from './index.types'

const windowsReg = /windows nt/
const windowsVersionReg = /windows nt ([\d.]+)/
const macReg = /mac os x/
const macVersionReg = /mac os x ([\d_]+)/
const linuxReg = /\((X11; )?Linux(?!.*Android)/
export const getSystemInfo = memoize<(ua?: string) => ProSystemInfoType>((userAgent?: string) => {
  const ua = userAgent || window.navigator.userAgent
  const lowerUA = ua.toLowerCase()

  let name = 'Unknown'
  let version = ''

  // OS detection
  if (windowsReg.test(lowerUA)) {
    name = 'windows'
    const match = lowerUA.match(windowsVersionReg)
    version = match ? match[1] || match[1] : ''
  } else if (macReg.test(lowerUA)) {
    name = 'mac'
    const match = lowerUA.match(macVersionReg)
    version = match ? match[1].replace(/_/g, '.') : ''
  } else if (linuxReg.test(lowerUA)) {
    name = 'linux'
  } else {
    name = 'other'
  }

  // 浏览器的 ua 只能获取到系统名和版本号
  return {
    platform: name,
    version: version,
    ip: '',
    mac: '',
    hostname: '',
    cpuCount: 0,
    memory: 0,
    serial: '',
  }
})
