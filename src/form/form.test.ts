import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import ProForm from './form.vue'
import { nextTick } from 'vue'
import type { ProFormInstance } from './form.types'

type FormDataType = {
  name: string
}
describe('ProForm', () => {
  it('should render form title correctly', () => {
    const wrapper = mount(ProForm, {
      props: {
        formTitle: 'Test Form',
      },
      global: {
        stubs: {
          ElForm: {
            template: '<form><slot /></form>',
            methods: {
              validate: () => Promise.resolve(true),
              resetFields: () => {},
            },
          },
          ElRow: { template: '<div><slot /></div>' },
          FormFields: { template: '<div>Fields</div>' },
          FormFooter: { template: '<div>Footer</div>' },
        },
      },
    })
    expect(wrapper.text()).toContain('Test Form')
  })

  it('should render fields based on columns', () => {
    const columns = [
      {
        title: 'Name',
        name: 'name',
        valueType: 'text',
      },
    ]
    const wrapper = mount(ProForm, {
      props: {
        columns,
      },
      global: {
        components: {
          // Mock sub-components if needed deeper, but we just check FormFields passes props ideally
          // However, since we are stubbing FormFields above, we can just check if FormFields exists
          // Or we can mount without stubs if we want integration test.
          // Let's stick to shallow mounting logic by stubbing children for unit test.
        },
        stubs: {
          ElForm: { template: '<form><slot /></form>' },
          ElRow: { template: '<div><slot /></div>' },
          // Check if FormFields receives columns
          FormFields: {
            props: ['columns'],
            template: '<div class="form-fields">{{ columns.length }}</div>',
          },
          FormFooter: { template: '<div>Footer</div>' },
        },
      },
    })

    // With the stub above
    expect(wrapper.find('.form-fields').text()).toBe('1')
  })

  it('should initialize with initialValues', async () => {
    const wrapper = mount(ProForm, {
      props: {
        initialValues: { name: 'John' },
        columns: [{ title: 'Name', name: 'name', valueType: 'text' }],
      },
      global: {
        stubs: {
          ElForm: { template: '<form><slot /></form>' },
          ElRow: { template: '<div><slot /></div>' },
          FormFields: true,
          FormFooter: true,
        },
      },
    })

    // Access exposed instance to check values
    // Note: implementation specifics might require us to check via exposed methods
    const vm = wrapper.vm as unknown as ProFormInstance<FormDataType>
    expect(vm.getFormValues()).toEqual({ name: 'John' })
  })

  it('should emit submit event with values', async () => {
    // Mock validate
    const validateMock = vi.fn().mockResolvedValue(true)

    const wrapper = mount(ProForm, {
      props: {
        initialValues: { name: 'John' },
        columns: [{ title: 'Name', name: 'name', valueType: 'text' }],
      },
      global: {
        stubs: {
          ElForm: {
            template: '<form @submit.prevent><slot /></form>',
            methods: {
              validate: validateMock,
            },
          },
          ElRow: { template: '<div><slot /></div>' },
          FormFields: true,
          // We need a real-ish footer to click submit or trigger it manually
          FormFooter: {
            props: ['onSubmit'],
            template: '<button @click="onSubmit">Submit</button>',
          },
        },
      },
    })

    await wrapper.find('button').trigger('click')
    await nextTick() // wait for async validate
    expect(validateMock).toHaveBeenCalled()

    // Check emitted events
    expect(wrapper.emitted()).toHaveProperty('submit')
    expect(wrapper.emitted()).toHaveProperty('finish')
    expect(wrapper.emitted('finish')![0][0]).toEqual({ name: 'John' })
  })

  it('should expose setFormValues and resetFields', async () => {
    const resetFieldsMock = vi.fn()

    const wrapper = mount(ProForm, {
      props: {
        columns: [{ title: 'Name', name: 'name', valueType: 'text' }],
      },
      global: {
        stubs: {
          ElForm: {
            template: '<form><slot /></form>',
            methods: {
              resetFields: resetFieldsMock,
            },
          },
          ElRow: true,
          FormFields: true,
          FormFooter: true,
        },
      },
    })

    const vm = wrapper.vm as unknown as ProFormInstance<FormDataType>

    // Test setFormValues
    vm.setFormValues({ name: 'Alice' })
    expect(vm.getFormValues()).toEqual({ name: 'Alice' })

    // Test resetFields
    vm.resetFields()
    expect(resetFieldsMock).toHaveBeenCalled()
  })
})
