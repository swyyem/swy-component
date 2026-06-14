// 判断是不是 json 字符串，只判断第一层
export const isJSONString = (str: string): boolean => {
  if (typeof str !== 'string') {
    return false
  }
  const s = str.trim()
  // 必须以 { } 或 [ ] 包裹
  if (!((s.startsWith('{') && s.endsWith('}')) || (s.startsWith('[') && s.endsWith(']')))) {
    return false
  }
  return true
}
