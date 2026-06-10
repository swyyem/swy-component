/**
 * 键盘事件工具函数
 * 用于判断按键类型
 */

/** 按键码映射 */
const KEYCODE = {
  Space: ' ',
  Enter: 'Enter',
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight',
  ArrowDown: 'ArrowDown',
  ArrowUp: 'ArrowUp',
}

/** 判断是否为空格键 */
export const isSpace = (e: KeyboardEvent) => {
  return KEYCODE['Space'] === e.key
}

/** 判断是否为回车键 */
export const isEnter = (e: KeyboardEvent) => {
  return KEYCODE['Enter'] === e.key
}

/** 判断是否为向下箭头键 */
export const isArrowDown = (e: KeyboardEvent) => {
  return KEYCODE['ArrowDown'] === e.key
}

/** 判断是否为向上箭头键 */
export const isArrowUp = (e: KeyboardEvent) => {
  return KEYCODE['ArrowUp'] === e.key
}
