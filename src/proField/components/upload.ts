import { ElUpload, ElButton, ElMessage } from 'element-plus'
import { defineComponent, h, ref, onUnmounted } from 'vue'
import type { UploadProps, ButtonProps } from 'element-plus'
import type { PropType } from 'vue'
import { addressPrefix, apiMap } from '../../tool/upload'

interface UploadProp extends UploadProps {
  'file-list'?: unknown[]
  limitSize?: number
  'onUpdate:modelValue'?: (value: any) => void
}
interface ButtonProp extends ButtonProps {
  label?: string
}

export default defineComponent({
  name: 'ProUpload',
  props: {
    fieldProps: {
      type: Object as PropType<UploadProp>,
      required: true,
    },
    uploadButtonProps: {
      type: Object as PropType<ButtonProp>,
      default: () => ({
        label: '上传',
        plain: true,
        type: 'primary',
      }),
    },
    mode: {
      type: String as PropType<'read' | 'edit' | 'update'>,
      required: true,
    },
    modelValue: {
      type: [Object, Array] as PropType<object | Array<any>>,
      default: () => ({}),
    },
    childRef: {
      type: Object as PropType<any>,
      default: null,
    },
  },
  setup(props, { emit, slots }) {
    const allowedMimeTypes = [
      'application/msword',
      'application/vnd.ms-excel',
      'application/pdf',
      'image/jpeg',
      'image/png',
    ]
    const allowedExtensions = ['.doc', '.xls', '.pdf', '.jpg', '.png']

    const handleBeforeUpload = (file: File) => {
      const fileName = file.name
      if (!fileName) {
        ElMessage.error('文件名无效')
        return false
      }

      const fileExtension = '.' + fileName.split('.').pop()?.toLowerCase()
      const isValidType =
        allowedMimeTypes.includes(file.type) || allowedExtensions.includes(fileExtension)

      if (!isValidType) {
        ElMessage.error(`文件格式不支持，请上传 ${allowedExtensions.join(', ')} 格式的文件`)
        return false
      }

      // 检查文件大小限制（可选）
      const maxSize = props.fieldProps?.limitSize || 100 // 默认100MB
      if (file.size > maxSize * 1024 * 1024) {
        ElMessage.error(`文件大小不能超过 ${maxSize}MB`)
        return false
      }

      return true
    }

    // 文件列表状态管理
    const fileObject = ref<any>({})

    /**
     * 清理文件预览 URL
     *
     * 遍历文件列表，对每个具有 previewUrl 属性的文件调用 URL.revokeObjectURL 方法，
     * 释放由 URL.createObjectURL 创建的预览链接，防止内存泄漏。
     */
    const cleanupPreviewUrls = () => {
      if (fileObject.value.previewUrl) {
        const { url, fileUrl, previewUrl } = fileObject.value
        URL.revokeObjectURL(url)
        URL.revokeObjectURL(fileUrl)
        URL.revokeObjectURL(previewUrl)
      }
    }

    onUnmounted(() => {
      cleanupPreviewUrls()
    })

    const handleSuccess = (response: any, file: any, fileList: File[]) => {
      const fileItem: any = {
        ...file,
        name: file.name,
        size: file.size,
        type: file.type,
        uid: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        status: 'ready',
      }

      // 如果是图片文件，创建预览URL
      if (file.raw?.type.startsWith('image/')) {
        try {
          const previewUrl = URL.createObjectURL(file.raw)
          fileItem.url = previewUrl
          fileItem.fileUrl = previewUrl
          fileItem.previewUrl = previewUrl
        } catch (error) {
          console.error('创建预览URL失败:', error)
        }
      }

      emit('success', response, fileObject.value, fileList)
      const { data } = response
      fileObject.value = { ...fileItem, ...data }
      emit('update:modelValue', fileObject.value)
      props.fieldProps['onUpdate:modelValue']?.(fileObject.value)
    }

    const handleError = (error: any, file: File, fileList: File[]) => {
      ElMessage.error('文件上传失败')
      emit('error', error, file, fileList)
    }

    const handleChange = (file: File, fileList: File[]) => {
      emit('change', file, fileList)
    }

    return () => {
      // 在只读模式下不渲染上传组件
      if (props.mode === 'read') {
        return h('div', { class: 'pro-upload-read' }, '查看附件')
      }

      const uploadProps = {
        ...props.fieldProps,
        // ref: childRef,
        accept: allowedExtensions.join(','),
        showFileList: false,
        action: addressPrefix + apiMap.uploadFileWithoutBusiness,
        beforeUpload: handleBeforeUpload,
        onSuccess: handleSuccess,
        onError: handleError,
        onChange: handleChange,
      }
      // 判断 slots 是否为空对象
      const hasSlots = Object.keys(slots || {}).length > 0

      return h(
        ElUpload,
        uploadProps as any,
        hasSlots
          ? slots
          : {
              default: () =>
                h(
                  ElButton,
                  { ...props.uploadButtonProps, disabled: props.mode === 'read' },
                  () => props.uploadButtonProps.label,
                ),
            },
      )
    }
  },
})
