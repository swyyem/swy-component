/**
 * @description hex颜色转rgb颜色
 * @param {String} str 颜色值字符串
 * @returns {String} 返回处理后的颜色值
 */

const hexReg = /^\#?[0-9A-Fa-f]{6}$/
export function hexToRgb(str: string): number[] {
  if (!hexReg.test(str)) {
    console.error('输入错误的 hex 颜色值')
    return []
  }
  str = str.replace('#', '')
  const hexArray = str.match(/../g)
  const res = []
  if (hexArray) {
    for (let i = 0; i < 3; i++) {
      res[i] = parseInt(hexArray[i], 16)
    }
  }
  return res
}

export function hexToRgba(str: string, opacity: number) {
  const rgb = hexToRgb(str)
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${opacity})`
}

/**
 * @description rgb颜色转Hex颜色
 * @param {*} r 代表红色
 * @param {*} g 代表绿色
 * @param {*} b 代表蓝色
 * @returns {String} 返回处理后的颜色值
 */
const rgbReg = /^\d{1,3}$/
export function rgbToHex(r: number, g: number, b: number) {
  if (!rgbReg.test(String(r)) || !rgbReg.test(String(g)) || !rgbReg.test(String(b))) {
    console.error('输入错误的rgb颜色值')
    return ''
  }
  const hexArray = [r.toString(16), g.toString(16), b.toString(16)]
  for (let i = 0; i < 3; i++) {
    if (hexArray[i].length == 1) {
      hexArray[i] = `0${hexArray[i]}`
    }
  }
  return `#${hexArray.join('')}`
}

/**
 * @description 加深颜色值
 * @param {String} color 颜色值字符串
 * @param {Number} level 加深的程度，限0-1之间
 * @returns {String} 返回处理后的颜色值
 */
export function getDarkColor(color: string, level: number) {
  const rgb = hexToRgb(color)
  for (let i = 0; i < 3; i++) {
    rgb[i] = Math.round(20.5 * level + rgb[i] * (1 - level))
  }
  return rgbToHex(rgb[0], rgb[1], rgb[2])
}

/**
 * @description 变浅颜色值
 * @param {String} color 颜色值字符串
 * @param {Number} level 加深的程度，限0-1之间
 * @returns {String} 返回处理后的颜色值
 */
export function getLightColor(color: string, level: number) {
  const rgb = hexToRgb(color)
  for (let i = 0; i < 3; i++) {
    rgb[i] = Math.round(255 * level + rgb[i] * (1 - level))
  }
  return rgbToHex(rgb[0], rgb[1], rgb[2])
}

const color = {
  hexToRgb,
  hexToRgba,
  rgbToHex,
  getDarkColor,
  getLightColor,
}
export default color
