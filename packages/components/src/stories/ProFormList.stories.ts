import type { Meta, StoryObj } from '@storybook/vue3'
import { h, type ConcreteComponent } from 'vue'
import {
  ElInput,
  ElRow,
  ElCol,
  ElRadio,
  ElRadioGroup,
  ElContainer,
  ElHeader,
  ElMain,
} from 'element-plus'
import { ProFormList, ProForm, ProFormField, ProField } from '../index'

const meta = {
  title: 'Example/ProFormList',
  component: ProFormList as unknown as ConcreteComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '基于 ElementPlus 封装的 ProFormList',
      },
      type: {
        // 自动生成类型文档
        showType: true,
        // 展开嵌套类型
        expandType: true,
      },
    },
  },
} satisfies Meta<typeof ProFormList>

export default meta
type Story = StoryObj<typeof ProFormList>

type FormValueType = Record<string, unknown>
// 基础表单
export const Basic: Story = {
  render: () => ({
    components: {
      ProForm,
      ProFormField,
      ProField,
      ProFormList,
      ElInput,
      ElCol,
      ElRow,
      ElRadio,
      ElRadioGroup,
      ElContainer,
      ElHeader,
      ElMain,
    },
    setup() {
      const handleSubmit = (values: FormValueType) => {
        console.log('提交数据：', values)
      }

      const handleChange = (newValues: FormValueType, values: FormValueType) => {
        console.log('valueChange', newValues, values)
      }

      return {
        handleSubmit,
        handleChange,
        h,
      }
    },
    template: `
      <el-container>
        <el-header height="30px">
          表单中的多行数据
        </el-header>
        <el-main>
          <ProForm
            labelWidth="80px"
            @submit="handleSubmit"
            @valuesChange="handleChange"
          >
            <ProFormField
              required
              name="username"
              label="用户名"
            >
              <ProField valueType="text" placeholder="用户名" />
            </ProFormField>
            <ProFormList
              name="users"
              label="用户信息"
              :itemRender="({ listDom, action }, { record }) => h('div', {}, [listDom])"
            >
              <template #label>
                <div style="color: red">用户信息</div>
              </template>
              <ElRow :gutter="12" style="flex: 1">
                <ElCol :span="12">
                  <ProFormField
                    required
                    name="name"
                    label="姓名"
                  >
                    <ProField valueType="text" placeholder="姓名" />
                  </ProFormField>
                </ElCol>
                <ElCol :span="12">
                  <ProFormField
                    required
                    name="nickName"
                    label="昵称"
                  >
                    <ProField valueType="text" placeholder="昵称" />
                  </ProFormField>
                </ElCol>
              </ElRow>
              <ProFormList
                name="labels"
                label="用户信息内"
                :copyIconProps="{ tooltipText: '复制此项到末尾' }"
                :deleteIconProps="{ tooltipText: '不需要这行了' }"
              >
                <ElRow :gutter="12" style="flex: 1">
                  <ElCol :span="12">
                    <ProFormField
                      required
                      name="value"
                      label="值"
                    >
                      <ProField valueType="text" placeholder="值" />
                    </ProFormField>
                  </ElCol>
                  <ElCol :span="12">
                    <ProFormField
                      required
                      name="label"
                      label="显示名称"
                    >
                      <ProField valueType="text" placeholder="显示名称" />
                    </ProFormField>
                  </ElCol>
                </ElRow>
              </ProFormList>
            </ProFormList>
          </ProForm>
        </el-main>
      </el-container>
    `,
  }),
}
