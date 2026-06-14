import enUS from 'element-plus/es/locale/lang/en'

export default {
  name: 'en-us',
  el: {
    ...enUS.el,
    'pro-table': {
      operations: 'Operations',
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      add: 'Add a row of data',
      onlyOneLineEditor: 'Only one line can be edited',
      onlyAddOneLine: 'Only one line can be added',
      deleteThisLine: 'Delete this line',
    },
  },
}
