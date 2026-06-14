<template>
  <el-popover
    placement="top"
    :width="466"
    :show-arrow="false"
    trigger="click"
    @show="onShow"
    @hide="onSubmit"
  >
    <template #reference>
      <component :is="triggerDom" v-if="triggerDom" />
      <slot v-else name="trigger"></slot>
    </template>
    <div class="popover">
      <div class="popover-top">
        <template v-if="fileList?.length">
          <div class="img-content" v-for="item in fileList" :key="item.uid">
            <el-image
              w-full
              :src="item.fileUrl"
              :preview-src-list="srcList"
              fit="cover"
              show-progress
              class="img"
              ref="imageRefs"
              :initial-index="initialIndex"
            >
              <template #error>
                <div class="error-img">
                  <img w-full :src="FrameImage" alt="" />
                </div>
              </template>
              <template #toolbar="{ actions, reset }">
                <el-icon @click="actions('zoomOut')"><ZoomOut /></el-icon>
                <el-icon @click="actions('zoomIn', { enableTransition: false, zoomRate: 2 })">
                  <ZoomIn />
                </el-icon>
                <el-icon @click="actions('clockwise', { rotateDeg: 180, enableTransition: false })">
                  <RefreshRight />
                </el-icon>
                <el-icon @click="actions('anticlockwise')"><RefreshLeft /></el-icon>
                <el-icon @click="reset"><Refresh /></el-icon>
                <el-icon @click="download()"><Download /></el-icon>
              </template>
            </el-image>
            <div class="img-mask">
              <div class="img-mask-title">
                {{ item.name }}
              </div>
              <div class="img-mask-icon">
                <el-icon
                  v-show="isImageFileType(item.name)"
                  @click.stop="triggerPreview(item.uid)"
                  style="cursor: pointer"
                  ><View
                /></el-icon>
                <el-icon @click.stop="deleteFile(item)" style="cursor: pointer"><Delete /></el-icon>
                <el-icon @click.stop="download('all', item)" style="cursor: pointer"
                  ><Download
                /></el-icon>
              </div>
            </div>
          </div>
        </template>
        <slot v-else name="empty"></slot>
      </div>
      <div class="popover-bottom">
        <slot></slot>
      </div>
    </div>
  </el-popover>
</template>
<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import { ElPopover, ElIcon, ElImage } from 'element-plus'
import type { ModalFormProps } from './modalForm.types'
import FrameImage from '../assets/Frame.png'

import {
  View,
  Delete,
  Download,
  Refresh,
  RefreshLeft,
  RefreshRight,
  ZoomIn,
  ZoomOut,
} from '@element-plus/icons-vue'
// import { apiMap } from '../tool/upload'

const imageRefs = ref<InstanceType<typeof ElImage>[]>([])
const initialIndex = ref(0)
const triggerPreview = (uid: Event) => {
  // 通过事件对象找到对应的图片元素并触发点击
  const index =
    fileList.value
      ?.filter((item: any) => isImageFileType(item.name))
      .findIndex((item: any) => item.uid === uid) ?? -1
  initialIndex.value = index
  if (index !== -1 && imageRefs.value[index]) {
    // 调用 el-image 的预览方法
    const imageInstance = imageRefs.value[index]

    // 访问内部 viewer 实例并调用 show 方法
    // 注意：这需要访问组件内部方法，可能需要根据 Element Plus 版本调整
    imageInstance.showPreview()
  }
}

// 下载文件
const download = async (type?: string, item?: any) => {
  let file = item
  if (type !== 'all') {
    const imageFiles = fileList.value?.filter((item: any) => isImageFileType(item.name))
    file = imageFiles?.[initialIndex.value]
  }

  if (!file) {
    console.error('文件不存在')
    return
  }

  try {
    const fileUrl = file.fileUrl || file.url
    if (!fileUrl) {
      console.error('文件URL不存在')
      return
    }

    // 始终使用 fetch 方式获取文件
    const response = await fetch(fileUrl)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const blob = await response.blob()

    // 创建 Blob URL
    const blobUrl = URL.createObjectURL(blob)

    // 创建隐藏的下载链接
    const link = document.createElement('a')
    link.href = blobUrl
    link.download = file.name || 'download' // 使用文件名而不是从URL解析
    link.style.display = 'none'

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // 清理 Blob URL
    URL.revokeObjectURL(blobUrl)
  } catch (error) {
    console.error('下载失败:', error)
  }
}

// 删除文件
const deleteFile = async (item: any) => {
  try {
    emit('deleteLocal', item)
    // if (item.status === 'ready') {
    //   emit('deleteLocal', item)
    //   return
    // }

    // const response = await fetch(props.addressPrefix + apiMap.deleteFile, {
    //   body: JSON.stringify({
    //     fileBusiness: {
    //       fileId: item.id,
    //       ...item,
    //     },
    //   }),
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   method: 'post',
    // })

    // const result = await response.json()
    // if (result.code === 200) {
    //   // ElMessage.success('删除成功')
    //   emit('deleteLocal', item)
    // }
  } catch (error) {
    console.error('删除请求失败:', error)
  }
}

interface Props extends ModalFormProps {
  fileList?: any[]
  trigger?: any
  open?: boolean
  onOpenChange?: (val: boolean) => void
  addressPrefix?: string
}

// 记录：如果不设置 undefined，则默认为 false
const props = withDefaults(defineProps<Props>(), {
  open: undefined,
})

const onShow = () => {}

const fileList = computed(() => {
  return props.fileList
})

const imgType = ['jpg', 'png']

const isImageFileType = (fileName: string): boolean => {
  const extension = fileName?.split('.').pop()?.toLowerCase()
  return extension ? imgType.includes(extension) : false
}

const srcList = computed(() => {
  return props.fileList
    ?.filter((item: any) => isImageFileType(item.name))
    .map((item: any) => item.fileUrl)
})

const triggerDom = computed(() => {
  return props.trigger || null
})
// submitterButton
const submitButtonProps = reactive({
  loading: false,
})

// props 存在 open
const hasOpen = typeof props.open === 'boolean'
const emit = defineEmits<{
  'update:open': [value: boolean]
  refresh: [value: any]
  close: [value: any]
  deleteLocal: [value: any]
}>()
// 内部状态控制
const internalVisible = ref(false)
const dialogVisible = computed({
  get() {
    return hasOpen ? props.open : internalVisible.value
  },
  set(val) {
    if (hasOpen) {
      emit('update:open', val)
      // 兼容 antpro
      if (props.onOpenChange) {
        props.onOpenChange(val)
      }
    } else {
      internalVisible.value = val
    }
  },
})
const formRef = ref()
const onSubmit = () => {
  submitButtonProps.loading = true
  Promise.resolve({}).then((val) => {
    submitButtonProps.loading = false
    if (val) {
      dialogVisible.value = false
      emit('close', val)
    }
  })
}

defineExpose({
  formRef: formRef,
})

defineOptions({
  name: 'UploadForm',
})
</script>

<style scoped lang="less">
.popover {
  width: 100%;
  height: 295px;
  display: flex;
  flex-direction: column;

  .popover-top {
    flex: 1;
    width: 100%;
    overflow: auto;

    // 隐藏滚动条但保留滚动功能
    &::-webkit-scrollbar {
      display: none; // Chrome Safari
    }

    -ms-overflow-style: none; // IE 10+
    scrollbar-width: none; // Firefox
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
    .img-content:hover .img-mask {
      opacity: 1;
    }
    .img-content {
      width: 142px;
      height: 142px;
      border-radius: 6px;
      position: relative;
      .img {
        width: 100%;
        height: 100%;
        border-radius: 6px;
        .error-img {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          background: #e8e8e8;
        }
      }

      .img-mask {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        gap: 35px;
        align-items: center;
        color: white;
        padding: 10px;
        border-radius: 6px;
        opacity: 0;
        transition: opacity 0.3s ease;

        .img-mask-title {
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: center;
          font-size: 12px;
        }

        .img-mask-icon {
          display: flex;
          gap: 20px;
          font-size: 16px;
          // pointer-events: none;
        }
      }
    }
  }

  .popover-bottom {
    height: 50px;
    width: 100%;
  }
}
</style>
<style>
.upload {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 30px;
  font-size: 16px;
}
.upload:hover {
  color: var(--pro-tip-color);
}
</style>
