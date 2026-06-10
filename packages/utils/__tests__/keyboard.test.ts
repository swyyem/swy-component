/**
 * 键盘工具函数测试
 */
import { describe, it, expect } from 'vitest'
import { isSpace, isEnter, isArrowDown, isArrowUp } from '../src/keyboard'
import { EVENT_CODE } from '../src/constants'

describe('键盘工具函数', () => {
  describe('isSpace', () => {
    it('应该识别空格键', () => {
      const event = new KeyboardEvent('keydown', { key: ' ' })
      expect(isSpace(event)).toBe(true)
    })

    it('应该识别非空格键', () => {
      const event1 = new KeyboardEvent('keydown', { key: 'Enter' })
      const event2 = new KeyboardEvent('keydown', { key: 'a' })
      expect(isSpace(event1)).toBe(false)
      expect(isSpace(event2)).toBe(false)
    })
  })

  describe('isEnter', () => {
    it('应该识别回车键', () => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' })
      expect(isEnter(event)).toBe(true)
    })

    it('应该识别非回车键', () => {
      const event1 = new KeyboardEvent('keydown', { key: ' ' })
      const event2 = new KeyboardEvent('keydown', { key: 'Escape' })
      expect(isEnter(event1)).toBe(false)
      expect(isEnter(event2)).toBe(false)
    })
  })

  describe('isArrowDown', () => {
    it('应该识别向下箭头键', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' })
      expect(isArrowDown(event)).toBe(true)
    })

    it('应该识别非向下箭头键', () => {
      const event1 = new KeyboardEvent('keydown', { key: 'ArrowUp' })
      const event2 = new KeyboardEvent('keydown', { key: 'ArrowLeft' })
      expect(isArrowDown(event1)).toBe(false)
      expect(isArrowDown(event2)).toBe(false)
    })
  })

  describe('isArrowUp', () => {
    it('应该识别向上箭头键', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' })
      expect(isArrowUp(event)).toBe(true)
    })

    it('应该识别非向上箭头键', () => {
      const event1 = new KeyboardEvent('keydown', { key: 'ArrowDown' })
      const event2 = new KeyboardEvent('keydown', { key: 'ArrowRight' })
      expect(isArrowUp(event1)).toBe(false)
      expect(isArrowUp(event2)).toBe(false)
    })
  })

  describe('EVENT_CODE 常量', () => {
    it('应该包含所有按键码', () => {
      expect(EVENT_CODE.tab).toBe('Tab')
      expect(EVENT_CODE.enter).toBe('Enter')
      expect(EVENT_CODE.space).toBe('Space')
      expect(EVENT_CODE.left).toBe('ArrowLeft')
      expect(EVENT_CODE.up).toBe('ArrowUp')
      expect(EVENT_CODE.right).toBe('ArrowRight')
      expect(EVENT_CODE.down).toBe('ArrowDown')
      expect(EVENT_CODE.esc).toBe('Escape')
      expect(EVENT_CODE.delete).toBe('Delete')
      expect(EVENT_CODE.backspace).toBe('Backspace')
      expect(EVENT_CODE.numpadEnter).toBe('NumpadEnter')
      expect(EVENT_CODE.pageUp).toBe('PageUp')
      expect(EVENT_CODE.pageDown).toBe('PageDown')
      expect(EVENT_CODE.home).toBe('Home')
      expect(EVENT_CODE.end).toBe('End')
    })
  })
})
