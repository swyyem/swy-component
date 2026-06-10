/**
 * 常量定义
 * 包含事件名称、按键码等常用常量
 */

/** 模型值更新事件 */
export const UPDATE_MODEL_EVENT = 'update:modelValue'

/** 选项更新事件 */
export const UPDATE_OPTION = 'update:option'

/** 值变化事件 */
export const CHANGE_EVENT = 'change'

/** 输入事件 */
export const INPUT_EVENT = 'input'

/** 键盘按键码映射 */
export const EVENT_CODE = {
  tab: 'Tab',
  enter: 'Enter',
  space: 'Space',
  left: 'ArrowLeft', // 37
  up: 'ArrowUp', // 38
  right: 'ArrowRight', // 39
  down: 'ArrowDown', // 40
  esc: 'Escape',
  delete: 'Delete',
  backspace: 'Backspace',
  numpadEnter: 'NumpadEnter',
  pageUp: 'PageUp',
  pageDown: 'PageDown',
  home: 'Home',
  end: 'End',
}
