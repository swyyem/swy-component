import { ref, nextTick, onMounted } from 'vue'
import type { StoryObj } from '@storybook/vue3'
import { ElDivider, ElButton } from 'element-plus'
import {
  ProForm,
  type ProFormValueType,
  type ProFormInstance,
} from '../../index'
import { columns } from './common'

export const Value: StoryObj<typeof ProForm> = {
  name: '值操作',
  args: {
    labelWidth: 120,
  },
  render: (args) => {
    return {
      setup() {
        const formRef = ref<ProFormInstance>()
        const handleSubmit = (values: ProFormValueType) => {
          console.log('columns submit', values)
        }
        onMounted(() => {
          nextTick(() => {})
        })
        const formValue = ref<ProFormValueType>({})
        const setFormValue = (v: ProFormValueType) => {
          formValue.value = v
        }
        const handleSetName = () => {
          formValue.value.name = '张三'
        }
        // 实例方法
        const formInstanceValue = ref<ProFormValueType>({})
        const handleGetValue = () => {
          formInstanceValue.value = formRef.value?.getFormValues() || {}
        }
        const handleFormName = () => {
          const newValue = {
            ...formInstanceValue.value,
            name: '张三',
          }
          formRef.value?.setFormValues(newValue)
        }
        return () => (
          <div>
            <div class="exam--desc">使用 v-model 获取表单的值</div>
            <ElDivider />
            <div style="margin-bottom: 10px">
              <ElButton onClick={handleSetName}>设置姓名</ElButton>
            </div>
            <ProForm
              {...args}
              modelValue={formValue.value}
              onUpdate:modelValue={setFormValue}
              columns={columns}
              onSubmit={handleSubmit}
            />
            <div class="exam--desc">
              实时同步：{JSON.stringify(formValue.value)}
            </div>
            <ElDivider />
            <div class="exam--desc">使用实例的方法获取表单的值</div>
            <ElDivider />
            <div style="margin-bottom: 10px">
              <ElButton onClick={handleGetValue}>获取表单值</ElButton>
              <ElButton onClick={handleFormName}>设置姓名</ElButton>
            </div>
            <ProForm
              ref={formRef}
              {...args}
              columns={columns}
              onSubmit={handleSubmit}
            />
            <div class="exam--desc">
              点击获取后：{JSON.stringify(formInstanceValue.value)}
            </div>
          </div>
        )
      },
    }
  },
}
