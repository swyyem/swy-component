import zhCN from 'element-plus/es/locale/lang/zh-cn'

export default {
  name: 'zh-cn',
  el: {
    ...zhCN.el,
    'pro-table': {
      operations: '操作',
      save: '保存',
      cancel: '取消',
      edit: '编辑',
      delete: '删除',
      add: '添加一行数据',
      onlyOneLineEditor: '只能同时编辑一行',
      onlyAddOneLine: '只能同时添加一行',
      deleteThisLine: '删除此项',
    },
  },
}
