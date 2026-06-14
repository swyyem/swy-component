import { ref, reactive, nextTick, onMounted } from 'vue'
import type { StoryObj } from '@storybook/vue3'
import { ElButton, ElPopconfirm } from 'element-plus'
import ProTable, {
  type ProTableInstance,
  type ProTableEditProps,
  type ProColumns,
} from '../../index'
import { columns, getTableData, type RowVO } from './common'

const toolbarColumns = {
  title: '编辑表格',
}

export const Editor: StoryObj<typeof ProTable<RowVO>> = {
  name: '编辑表格',
  args: {
    rowKey: 'id',
    toolbar: toolbarColumns,
  },
  render: (args) => {
    return {
      setup() {
        const editableConfig = reactive<ProTableEditProps<RowVO>>({
          type: 'cell',
          mode: 'edit',
          defaultRow: false, // 默认新增一行，默认开启
          // keyboard: true, // 开启键盘，默认开启
          // keyboardNextCell: 'campusId', // 回车进入到下一行，不传则默认从最后一列切换
          // keyboardFirstCell: 'chargeItemCount', // 指定定位一行的第一个 columnKey
          // keyboardColumns: ['nesting.chargeItemId', 'campusId', 'filmFeeType'], // 指定 enter 的columns顺序
        })
        const tableEditorRef = ref<ProTableInstance<RowVO>>()
        const handleMode = () => {
          editableConfig.mode = editableConfig.mode === 'read' ? 'edit' : 'read'
        }
        const handleValidate = () => {
          const res = tableEditorRef.value?.validate()
          res?.then((v) => console.log('=v=', v))
        }
        const handleData = () => {
          // form 全量数据
          console.log('=handleData=', tableEditorRef.value?.getFormData())
          // form 修改的数据 { add: [], edit: [], remove: []  }，未修改的行数据不返回
          console.log('=getRecordSet=', tableEditorRef.value?.getFormRecord())
          console.log('=getSelectionRows=', tableEditorRef.value?.getSelectionRows())
        }
        const editorColumns = (columns as ProColumns<RowVO>).concat([
          {
            label: '价格',
            valueType: 'price',
            width: '100',
            prop: 'price',
          },
          {
            label: '操作',
            width: '80',
            valueType: 'option',
            fixed: 'right',
            render(rowData) {
              return (
                <>
                  <ElPopconfirm
                    title="确定要删除吗"
                    onConfirm={() => tableEditorRef.value?.actions.delete(rowData)}
                  >
                    {{
                      reference: () => (
                        <ElButton link type="danger">
                          删除
                        </ElButton>
                      ),
                    }}
                  </ElPopconfirm>
                </>
              )
            },
          },
        ])
        onMounted(() => {
          nextTick(() => {})
        })
        return () => (
          <div>
            <div style="margin: 8px auto">
              <ElButton type="primary" onClick={handleMode}>
                切换{editableConfig.mode === 'read' ? '编辑' : '只读'}
              </ElButton>
              <ElButton type="primary" onClick={handleValidate}>
                表格验证
              </ElButton>
              <ElButton type="primary" onClick={handleData}>
                获取表格数据
              </ElButton>
            </div>
            <div style="height: 500px">
              <ProTable<RowVO>
                ref={tableEditorRef}
                {...args}
                columns={editorColumns}
                request={getTableData}
                editable={editableConfig}
              />
            </div>
          </div>
        )
      },
    }
  },
}
