import { ElMessage } from 'element-plus'

export const addressPrefix = '/api'
export const apiMap = {
  uploadFileWithBusiness: '/file/upload-file-with-business', //上传文件关联业务信息
  uploadFileWithoutBusiness: '/file/upload-file-without-business', //上传文件不关联业务信息
  listFileUrlByBusiness: '/file/list-file-url-by-business', //获取文件列表
  downloadFile: '/file/download-file', //获取单个文件base64,//没必要用太消耗性能了
  deleteFile: '/file/delete-file', //删除文件
  createFileMetadata: '/file/create-file-metadata', //创建文件元数据
  batchDeleteFile: '/file/batch-delete-file', //批量删除文件
  batchCreateFileMetadata: '/file/batch-create-file-metadata', //批量创建文件元数据
  batchSaveFileMetadata: '/file/batch-save-file-metadata', //批量创建删除
}

export type BusinessType = {
  businessId: string
  businessType: 'STAFF_AVATAR' | 'STAFF_SIGNATURE'
  fileId?: string
}

type StorageType = 'MINIO' | 'LOCAL' | 'ALIYUN_OSS' | 'AWS_S3'

type FileType = {
  id?: string | null
  businessId: string
  businessType: string
  createdAt?: string | number | Date | null
  encrypted?: boolean | null
  fileSize: number
  fileType: string
  // id: null
  name: string
  path: string
  storageType: StorageType
  // MinIO分布式对象存储 本地文件系统 阿里云对象存储服务  Amazon
  updatedAt?: string | number | Date | null
  uploadBy?: string | null
  [key: string]: unknown
}

export type ModelProps = {
  createFileMetadataList: FileType[]
  deleteFileMetadataList?: { id: string }[]
}

type ApiResponse<T = unknown> = {
  code: number
  message?: string
  data?: T
}

type BeforeUploadProps = {
  fieldProps?: {
    limitSize?: number
  }
}
export const handlePreview = async (fileBusinessList: BusinessType[]) => {
  try {
    const response = await fetch(addressPrefix + apiMap.listFileUrlByBusiness, {
      body: JSON.stringify(fileBusinessList),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'post',
    })

    const result = (await response.json()) as ApiResponse<FileType[]>
    const { data = [] } = result || {}

    // return data
    return { createFileMetadataList: data }
  } catch (error) {
    console.error('预览请求失败:', error)
  }
}

const executeFileOperations = async (uploadObject: ModelProps) => {
  const response = await fetch(addressPrefix + apiMap.batchSaveFileMetadata, {
    method: 'POST',
    body: JSON.stringify(uploadObject),
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  })
  const responseJson = (await response.json()) as ApiResponse
  if (!response.ok) {
    throw new Error(responseJson?.message ?? `文件  上传失败`)
  }

  return responseJson
}

// 将文件关联业务信息
export const relatedBusiness = async (uploadObject: ModelProps) => {
  try {
    // if (uploadObject.createFileMetadataList.length === 0) {
    //   throw new Error('文件列表不能为空')
    // }
    // 获取需要上传的文件列表
    const uploadList = uploadObject.createFileMetadataList.filter(
      (item: FileType) => item.id === null,
    )

    // if (uploadList.length === 0) {
    //   ElMessage.warning('当前文件列表已全部关联业务信息')
    //   return { uploadObject, result: {} }
    // }

    if (
      uploadList.some(
        (item: FileType) =>
          item.businessId === null || item.businessId === undefined,
      )
    ) {
      return ElMessage.warning('所有新建的文件都要绑定businessId')
    }
    if (
      uploadList.some(
        (item: FileType) =>
          item.businessType === null || item.businessType === undefined,
      )
    ) {
      return ElMessage.warning('所有新建的文件都要绑定businessType')
    }

    // const formData = new FormData()
    // formData.append(
    //   'createFileMetadataList',
    //   JSON.stringify(uploadObject.createFileMetadataList || []),
    // )
    // formData.append(
    //   'deleteFileMetadataList',
    //   JSON.stringify(uploadObject.deleteFileMetadataList || []),
    // )
    const result = await executeFileOperations(uploadObject)

    // 处理结果
    if (result.code === 200) {
      ElMessage.success(result.message || '文件处理成功')
      return { uploadObject, result }
    } else {
      ElMessage.error(result.message || '文件处理失败')
      return { uploadObject, result }
    }
  } catch (error: unknown) {
    console.error('文件处理错误:', error)
    let message = '文件处理失败'
    if (error instanceof Error) {
      message = error.message
    } else if (typeof error === 'string') {
      message = error
    }
    ElMessage.error(message)
    return { uploadObject, error }
  }
}

const allowedMimeTypes = [
  'application/msword',
  'application/vnd.ms-excel',
  'application/pdf',
  'image/jpeg',
  'image/png',
]
export const allowedExtensions = ['.doc', '.xls', '.pdf', '.jpg', '.png']
export const handleBeforeUpload = (file: File, props: BeforeUploadProps) => {
  const fileName = file.name
  if (!fileName) {
    ElMessage.error('文件名无效')
    return false
  }

  const fileExtension = '.' + fileName.split('.').pop()?.toLowerCase()
  const isValidType =
    allowedMimeTypes.includes(file.type) ||
    allowedExtensions.includes(fileExtension)

  if (!isValidType) {
    ElMessage.error(
      `文件格式不支持，请上传 ${allowedExtensions.join(', ')} 格式的文件`,
    )
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

const upload = {
  handlePreview,
  relatedBusiness,
}

export default upload
