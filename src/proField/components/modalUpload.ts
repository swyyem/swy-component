import { ElUpload, ElImage, ElIcon } from 'element-plus'
import { defineComponent, h, ref, onUnmounted, computed } from 'vue'
import type { UploadProps, ButtonProps } from 'element-plus'
import type { PropType } from 'vue'
import { UploadForm } from '../../index'
import { Plus, CaretBottom } from '@element-plus/icons-vue'
import {
  addressPrefix,
  apiMap,
  allowedExtensions,
  handleBeforeUpload,
} from '../../tool/upload'
import type { ModelProps } from '../../tool/upload'

interface unloadProp extends UploadProps {
  'file-list'?: unknown[]
  limitSize?: number
  'onUpdate:modelValue'?: (value: ModelProps) => void
}

interface ButtonProp extends ButtonProps {
  title?: string
}

export default defineComponent({
  props: {
    title: {
      type: String as PropType<string>,
      default: () => {
        return '上传文件'
      },
    },
    fieldProps: {
      type: Object as PropType<unloadProp>,
      required: true,
    },
    mode: {
      type: String as PropType<string>,
      required: true,
    },
    buttonProps: {
      type: Object as PropType<ButtonProp>,
      default: () => {
        return {
          type: 'primary',
          text: true,
          title: '上传',
        }
      },
    },
    modelValue: {
      type: [Object] as PropType<ModelProps>,
      default: () => {
        return {
          createFileMetadataList: [],
          deleteFileMetadataList: [],
        }
      },
    },
    defaultBusinessType: {
      type: [String, Number] as PropType<string | number>,
      default: () => {
        return 'STAFF_AVATAR'
      },
    },
    childRef: {
      type: Object as PropType<typeof ref>,
      default: () => {
        return ref(null)
      },
    },
    onSave: {
      type: Function as PropType<(fileList: any[], success: boolean) => void>,
      default: () => {},
    },
  },
  setup(props, { emit }) {
    // 文件列表状态管理
    // 替换原来的第75行左右的代码
    const fileList = ref<any[]>(
      (props.modelValue?.createFileMetadataList || []).map((fileItem) => ({
        ...fileItem,
        url: fileItem.fileUrl,
        uid: fileItem.id,
      })),
    )
    const deleteList = ref<any[]>(
      props.modelValue?.deleteFileMetadataList || [],
    )

    /**
     * 清理文件预览 URL
     *
     * 遍历文件列表，对每个具有 previewUrl 属性的文件调用 URL.revokeObjectURL 方法，
     * 释放由 URL.createObjectURL 创建的预览链接，防止内存泄漏。
     */
    // const cleanupPreviewUrls = () => {
    //   fileList.value.forEach((file) => {
    //     if (file.previewUrl) {
    //       URL.revokeObjectURL(file.url)
    //       URL.revokeObjectURL(file.fileUrl)
    //       URL.revokeObjectURL(file.previewUrl)
    //     }
    //   })
    // }

    onUnmounted(() => {
      // cleanupPreviewUrls()
    })

    return () => {
      const { childRef, fieldProps: a } = props
      const fieldProps = { ...a, ref: childRef }
      // console.log('mode1', props.mode)

      const showContent = computed(() => {
        return h(
          'div',
          {
            style: {
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
              with: '100%',
              height: '32px',
            },
          },
          [
            h(
              'div',
              {
                style: {
                  position: 'absolute',
                  left: '4px',
                  top: '4px',
                  width: '24px',
                  height: '24px',
                  background: '#EFF0F1',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                },
              },
              [h(ElIcon, {}, () => h(Plus))],
            ),
            h(
              'div',
              {
                style: {
                  width: 'calc(100% - 64px)',
                  marginLeft: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  overflow: 'hidden', // 隐藏超出部分
                  whiteSpace: 'nowrap', // 防止换行
                },
                onClick: (e: Event) => e.stopPropagation(),
                onMousedown: (e: Event) => e.stopPropagation(),
                onMouseup: (e: Event) => e.stopPropagation(),
                onDblclick: (e: Event) => e.stopPropagation(),
                onContextmenu: (e: Event) => e.stopPropagation(),
                onTouchstart: (e: Event) => e.stopPropagation(),
                onTouchend: (e: Event) => e.stopPropagation(),
                onTouchmove: (e: Event) => e.stopPropagation(),
              },
              [
                ...fileList.value?.map((res) => {
                  return h(ElImage, {
                    wFull: true,
                    src: res.fileUrl,
                    fit: 'cover',
                    showProgress: true,
                    previewSrcList: fileList.value?.map(
                      (item: any) => item.fileUrl,
                    ),
                    previewTeleported: true,
                    class: 'img',
                    style: {
                      width: '24px',
                      height: '24px',
                      borderRadius: '4px',
                      flexShrink: 0,
                    },
                  })
                }),
              ],
            ),

            h(
              'div',
              {
                style: {
                  position: 'absolute',
                  right: '4px',
                  top: '4px',
                  width: '24px',
                  height: '24px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                },
              },
              [h(ElIcon, {}, () => h(CaretBottom))],
            ),
          ],
        )
      })

      /**
       * 自定义上传请求处理函数
       *
       * 该函数替代了 Element Plus Upload 组件的默认上传行为，实现自定义文件上传逻辑。
       * 主要功能包括：
       * 1. 构造文件对象并生成唯一标识符
       * 2. 为图片文件创建本地预览 URL
       * 3. 调用 uploadFile 方法执行实际的文件上传
       * 4. 更新文件列表状态
       * 5. 返回上传结果供组件处理
       *
       * @param options 上传选项，包含待上传的文件对象
       * @returns 返回上传操作的结果数据
       */
      const httpRequest = async (options: any) => {
        // 模拟 XMLHttpRequest 返回 Promise
        const { file } = options
        const fileItem: any = {
          raw: file,
          name: file.name,
          size: file.size,
          type: file.type,
          uid:
            file.uid ||
            `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          status: 'ready',
        }

        // 如果是图片文件，创建预览URL
        if (file.type.startsWith('image/')) {
          try {
            const previewUrl = URL.createObjectURL(file)
            fileItem.url = previewUrl
            fileItem.fileUrl = previewUrl
            fileItem.previewUrl = previewUrl
          } catch (error) {
            console.error('创建预览URL失败:', error)
          }
        }
        const data = await uploadFile(file)

        fileList.value.push({
          ...fileItem,
          ...data.data,
          businessType: props.defaultBusinessType,
        })

        emit('update:modelValue', {
          createFileMetadataList: fileList.value,
          deleteFileMetadataList: deleteList.value,
        })
        props?.fieldProps?.['onUpdate:modelValue']?.({
          createFileMetadataList: fileList.value,
          deleteFileMetadataList: deleteList.value,
        })
        return data
      }

      // 上传不关联业务信息
      const uploadFile = async (file: File) => {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch(
          addressPrefix + apiMap.uploadFileWithoutBusiness,
          {
            method: 'POST',
            body: formData,
          },
        )
        const responseJson = await response.json()
        if (!response.ok) {
          throw new Error(responseJson?.message)
        }

        return responseJson
      }

      // 上传弹窗
      const uploadForm = () => {
        if (props.mode === 'read') {
          return h(
            'div',
            {
              style: {
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                with: '100%',
                height: '32px',
              },
            },
            [
              h(
                'div',
                {
                  style: {
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    overflow: 'hidden', // 隐藏超出部分
                    whiteSpace: 'nowrap', // 防止换行
                    height: '32px',
                  },
                },
                [
                  ...fileList.value?.map((res) => {
                    return h(ElImage, {
                      wFull: true,
                      src: res.fileUrl,
                      fit: 'cover',
                      showProgress: true,
                      previewSrcList: fileList.value?.map(
                        (item: any) => item.fileUrl,
                      ),
                      previewTeleported: true,
                      class: 'img',
                      style: {
                        width: '24px',
                        height: '24px',
                        borderRadius: '4px',
                        flexShrink: 0,
                      },
                    })
                  }),
                ],
              ),
            ],
          )
        }
        return h(
          UploadForm,
          {
            title: props?.title || '',
            width: '670px',
            modalProps: {
              appendToBody: true,
            },
            fileList: fileList.value,
            addressPrefix: addressPrefix,
            onRefresh: () => {
              // handlePreview()
            },
            onClose: () => {
              // cleanupPreviewUrls()
            },
            onDeleteLocal: (file: any) => {
              console.log('file', file)

              const index = fileList.value.findIndex(
                (item) => item.uid === file.uid,
              )
              if (index !== -1) {
                fileList.value.splice(index, 1)
                // deleteList.value.push(file)
                if (file.status !== 'ready') {
                  deleteList.value.push({ id: file.id })
                }
                emit('update:modelValue', {
                  createFileMetadataList: fileList.value,
                  deleteFileMetadataList: deleteList.value,
                })
                props?.fieldProps?.['onUpdate:modelValue']?.({
                  createFileMetadataList: fileList.value,
                  deleteFileMetadataList: deleteList.value,
                })
              }
            },
            formProps: {
              labelWidth: 100,
            },
            trigger: showContent.value,
          },
          {
            empty: () => [
              h(
                ElUpload,
                {
                  ...fieldProps,
                  accept: allowedExtensions.join(','),
                  showFileList: false,
                  drag: true,
                  class: 'upload',
                  httpRequest: httpRequest,
                  beforeUpload: (file) => {
                    if (!handleBeforeUpload(file, props)) {
                      return false
                    }
                    return true
                  },
                },
                {
                  default: () => [h('span', null, '拖拽或点击上传本地文件'), ,],
                },
              ),
            ],
            default: () => [
              h(
                ElUpload,
                {
                  ...fieldProps,
                  accept: allowedExtensions.join(','),
                  showFileList: false,
                  class: 'upload',
                  disabled:
                    !props.fieldProps?.multiple && fileList.value.length > 0,
                  httpRequest: httpRequest,
                  beforeUpload: (file) => {
                    if (!handleBeforeUpload(file, props)) {
                      return false
                    }
                    return true
                  },
                },
                {
                  default: () => [
                    h(ElIcon, { class: 'el-icon--upload' }, () => h(Plus)),
                    h('span', null, '添加本地文件'),
                    ,
                  ],
                },
              ),
            ],
          },
        )
      }

      return uploadForm()
    }
  },
})
