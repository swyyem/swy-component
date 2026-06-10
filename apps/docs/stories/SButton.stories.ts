import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { SButton } from '@swy/components'

const meta: Meta<typeof SButton> = {
  title: 'Components/SButton',
  component: SButton,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['primary', 'success', 'warning', 'danger', 'default'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof SButton>

export const Primary: Story = {
  args: { type: 'primary' },
  render: (args) => ({
    components: { SButton },
    setup: () => ({ args }),
    template: '<SButton v-bind="args">主要按钮</SButton>',
  }),
}

export const AllTypes: Story = {
  render: () => ({
    components: { SButton },
    template: `
      <div style="display: flex; gap: 12px;">
        <SButton type="primary">Primary</SButton>
        <SButton type="success">Success</SButton>
        <SButton type="warning">Warning</SButton>
        <SButton type="danger">Danger</SButton>
        <SButton type="default">Default</SButton>
      </div>
    `,
  }),
}

export const Sizes: Story = {
  render: () => ({
    components: { SButton },
    template: `
      <div style="display: flex; gap: 12px; align-items: center;">
        <SButton type="primary" size="small">Small</SButton>
        <SButton type="primary" size="medium">Medium</SButton>
        <SButton type="primary" size="large">Large</SButton>
      </div>
    `,
  }),
}

export const Disabled: Story = {
  args: { type: 'primary', disabled: true },
  render: (args) => ({
    components: { SButton },
    setup: () => ({ args }),
    template: '<SButton v-bind="args">禁用按钮</SButton>',
  }),
}

export const Loading: Story = {
  args: { type: 'primary', loading: true },
  render: (args) => ({
    components: { SButton },
    setup: () => ({ args }),
    template: '<SButton v-bind="args">加载中</SButton>',
  }),
}
