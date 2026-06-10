import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SButton from '../src/button/SButton.vue'

describe('SButton', () => {
  it('should render slot content', () => {
    const wrapper = mount(SButton, {
      slots: { default: '点击我' },
    })
    expect(wrapper.text()).toContain('点击我')
  })

  it('should apply type class', () => {
    const wrapper = mount(SButton, {
      props: { type: 'primary' },
      slots: { default: 'btn' },
    })
    expect(wrapper.classes()).toContain('s-button--primary')
  })

  it('should apply size class', () => {
    const wrapper = mount(SButton, {
      props: { size: 'large' },
      slots: { default: 'btn' },
    })
    expect(wrapper.classes()).toContain('s-button--large')
  })

  it('should be disabled', () => {
    const wrapper = mount(SButton, {
      props: { disabled: true },
      slots: { default: 'btn' },
    })
    expect(wrapper.attributes('disabled')).toBeDefined()
    expect(wrapper.classes()).toContain('is-disabled')
  })

  it('should show loading indicator', () => {
    const wrapper = mount(SButton, {
      props: { loading: true },
      slots: { default: 'btn' },
    })
    expect(wrapper.find('.s-button__loading').exists()).toBe(true)
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('should emit click event', async () => {
    const wrapper = mount(SButton, {
      slots: { default: 'btn' },
    })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('should not emit click when disabled', async () => {
    const wrapper = mount(SButton, {
      props: { disabled: true },
      slots: { default: 'btn' },
    })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
  })
})
