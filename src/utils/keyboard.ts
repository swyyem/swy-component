const KEYCODE = {
  Space: ' ',
  Enter: 'Enter',
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight',
  ArrowDown: 'ArrowDown',
  ArrowUp: 'ArrowUp',
}
export const isSpace = (e: KeyboardEvent) => {
  return KEYCODE['Space'] === e.key
}

export const isEnter = (e: KeyboardEvent) => {
  return KEYCODE['Enter'] === e.key
}

export const isArrowDown = (e: KeyboardEvent) => {
  return KEYCODE['ArrowDown'] === e.key
}

export const isArrowUp = (e: KeyboardEvent) => {
  return KEYCODE['ArrowUp'] === e.key
}
