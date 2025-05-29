<script setup lang="ts">
import type { PageData, ComicOrderPage } from '@/api/comic'
import { getComicPages } from '@/api/comic'
import { Setting, QuestionFilled } from '@element-plus/icons-vue'
import { getImageUrl } from '@/utils/string'
import { pictureQuality } from '@/constants/options'
import debounce from 'lodash-es/debounce'
import { proxy } from '@/services/config'
import { omit } from 'lodash-es'

// 类型定义
type ChapterInfo = ComicOrderPage['ep']

interface ComicImage {
  id: string
  path: string
}

// 常量定义
const SCROLL_DEBOUNCE_DELAY = 50
const PRELOAD_THRESHOLD_MULTIPLIER = 2

const props = defineProps<{
  /** 漫画ID */
  id: string
  /** 当前章节号 */
  chapter: string
  /** 最大章节数 */
  maxChapter: string
}>()

const settingStore = useSettingStoreHook()
const scrollbarRef = useTemplateRef('scrollbarRef')

// 窗口尺寸常量
const windowInnerWidth = window.innerWidth
const windowInnerHeight = window.innerHeight

// 响应式状态
const currentChapter = ref(Number(props.chapter))
const maxChapterNum = Number(props.maxChapter)

// 响应式状态
const chapterInfo = reactive<Partial<ChapterInfo>>({})
const pageInfo = reactive<PageData>({
  page: 1,
  pages: 1,
  total: 1,
  limit: 40,
})

const drawer = ref(false)

/** 漫画图片列表 */
const comicImages = reactive<ComicImage[]>([])

/** 加载状态管理 */
const loadingState = reactive({
  isLoadingNextPage: false,
  hasError: false,
  errorMessage: '',
})

/**
 * 获取章节页面数据
 * @param page 指定页码，不传则获取下一页
 * @param forceRefresh 是否强制刷新，忽略缓存
 */
async function getChapterPages(page?: number, forceRefresh = false) {
  // 防止重复请求
  if (loadingState.isLoadingNextPage) return

  try {
    loadingState.isLoadingNextPage = true
    loadingState.hasError = false

    const targetPage = page || pageInfo.page + 1
    const res = await getComicPages(props.id, currentChapter.value, targetPage, forceRefresh)

    // 更新章节信息
    Object.assign(chapterInfo, res.ep)

    // 更新分页信息（排除docs字段）
    Object.assign(pageInfo, omit(res.pages, 'docs'))

    // 格式化图片数据
    const formatData: ComicImage[] = res.pages.docs.map(item => ({
      id: item.id,
      path: getImageUrl(item.media.path),
    }))

    // 添加到图片列表
    comicImages.push(...formatData)

  } catch (error) {
    console.error('章节数据加载失败:', error)
    loadingState.hasError = true
    loadingState.errorMessage = '章节数据加载失败，请稍后重试'
    ElMessage.error(loadingState.errorMessage)
  } finally {
    loadingState.isLoadingNextPage = false
  }
}

/**
 * 滚动事件处理函数
 * 使用防抖优化性能，支持无限滚动加载
 */
const handleScroll = debounce((e: { scrollTop: number; scrollLeft: number }) => {
  const scrollElement = scrollbarRef.value?.wrapRef
  if (!scrollElement) return

  const { scrollTop } = e
  const { scrollHeight, clientHeight } = scrollElement
  const distanceFromBottom = scrollHeight - scrollTop - clientHeight

  // 预加载阈值：当距离底部小于2个屏幕高度时开始加载下一页
  const preloadThreshold = windowInnerHeight * PRELOAD_THRESHOLD_MULTIPLIER

  // 检查是否需要加载下一页
  const shouldLoadNextPage =
    distanceFromBottom <= preloadThreshold &&
    pageInfo.page < pageInfo.pages &&
    !loadingState.isLoadingNextPage

  if (shouldLoadNextPage) {
    getChapterPages()
  }
}, SCROLL_DEBOUNCE_DELAY)

/**
 * 清空当前数据状态
 */
function clearCurrentData() {
  // 清空图片列表
  comicImages.length = 0

  // 清空章节信息
  Object.keys(chapterInfo).forEach(key => {
    delete chapterInfo[key as keyof ChapterInfo]
  })

  // 重置分页信息
  Object.assign(pageInfo, {
    page: 1,
    pages: 1,
    total: 1,
    limit: 40,
  })

  // 清空错误状态
  loadingState.hasError = false
  loadingState.errorMessage = ''
  loadingState.isLoadingNextPage = false
}

/**
 * 上一章
 */
function prevChapter() {
  if (!canGoPrevChapter.value) return

  // 清空当前数据
  clearCurrentData()

  // 修改当前章节号
  currentChapter.value = currentChapter.value - 1

  // 重新加载章节数据
  getChapterPages(1)
}

/**
 * 下一章
 */
function nextChapter() {
  if (!canGoNextChapter.value) return

  // 清空当前数据
  clearCurrentData()

  // 修改当前章节号
  currentChapter.value = currentChapter.value + 1

  // 重新加载章节数据
  getChapterPages(1)
}

/**
 * 重试加载数据
 */
function retryLoad() {
  loadingState.hasError = false
  loadingState.errorMessage = ''
  getChapterPages(1)
}

/**
 * 重新加载当前章节数据
 * 用于画质变化等需要重新获取数据的场景
 * @param forceRefresh 是否强制刷新，忽略缓存
 */
function reloadCurrentChapter(forceRefresh = false) {
  // 清空当前图片列表
  comicImages.length = 0

  // 重置分页信息
  Object.assign(pageInfo, {
    page: 1,
    pages: 1,
    total: 1,
    limit: 40,
  })

  // 清空错误状态
  loadingState.hasError = false
  loadingState.errorMessage = ''

  // 重新加载第一页数据，使用强制刷新
  getChapterPages(1, forceRefresh)
}

// 计算属性：是否可以跳转到上一章
const canGoPrevChapter = computed(() => currentChapter.value > 1)

// 计算属性：是否可以跳转到下一章
const canGoNextChapter = computed(() => currentChapter.value < maxChapterNum)

/**
 * 处理画质变化事件
 * @param newQuality 新的画质设置
 */
function handleQualityChange(newQuality: string) {
  console.log(`画质已更改为 ${newQuality}，强制重新加载章节数据`)

  // 使用强制刷新模式，忽略缓存
  reloadCurrentChapter(true)
}

/**
 * 处理线路代理变化事件
 * @param newProxy 新的线路代理设置
 */
function handleProxyChange(newProxy: any) {
  console.log(`线路代理已更改为 ${newProxy?.label || newProxy}，强制重新加载章节数据`)

  // 使用强制刷新模式，忽略缓存
  reloadCurrentChapter(true)
}

// 初始化数据
getChapterPages(1)
</script>

<template>
  <div class="flex flex-col bg-[--el-text-color-primary] h-screen">
    <!-- 顶部导航栏 -->
    <div class="h-50px flex justify-between items-center p-3 bg-[--el-color-black] color-[--el-color-white] border-b">
      <!-- 章节标题 -->
      <div class="flex items-center gap-3">
        <div class="font-medium">{{ chapterInfo.title || '加载中...' }}</div>
        <div class="text-sm opacity-75">共{{ maxChapterNum }}章</div>
        <!-- 加载状态指示器 -->
        <div v-if="loadingState.isLoadingNextPage" class="text-sm text-blue-400 flex items-center gap-1">
          <span class="animate-spin">⏳</span>
          加载中...
        </div>
        <!-- 错误状态指示器 -->
        <div v-if="loadingState.hasError" class="text-sm text-red-400 flex items-center gap-1">
          <span>❌</span>
          加载失败
          <el-button size="small" text @click="retryLoad">重试</el-button>
        </div>
      </div>

      <!-- 章节导航按钮 -->
      <div class="flex items-center gap-2">
        <el-button :disabled="!canGoPrevChapter" text bg @click="prevChapter">
          上一章
        </el-button>
        <el-button :disabled="!canGoNextChapter" text bg @click="nextChapter">
          下一章
        </el-button>

        <!-- 设置按钮 -->
        <el-icon class="cursor-pointer hover:text-blue-300 ml-2" @click="drawer = true">
          <Setting />
        </el-icon>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="flex-1 overflow-hidden">
      <el-scrollbar class="h-full" ref="scrollbarRef" @scroll="handleScroll">
        <div class="mx-auto" :style="{ width: settingStore.comic.comicImageWidth + 'px' }">
          <!-- 图片列表 -->
          <Image :src="item.path" aspect="auto" v-for="(item, index) in comicImages" :key="item.id || index"
            :alt="`第${index + 1}张图片`" />

          <!-- 加载更多指示器 -->
          <div v-if="loadingState.isLoadingNextPage" class="text-center py-4">
            <span class="text-gray-500">正在加载更多图片...</span>
          </div>

          <!-- 已加载完成提示 -->
          <div v-else-if="pageInfo.page >= pageInfo.pages && comicImages.length > 0" class="text-center py-4">
            <span class="text-gray-500">已加载全部图片</span>
          </div>
        </div>
      </el-scrollbar>
    </div>

    <!-- 设置抽屉 -->
    <el-drawer v-model="drawer" direction="rtl" size="400px" :with-header="false">
      <div class="size-full">

        <el-form label-width="100px" labelPosition="left">
          <el-form-item label="宽度">
            <el-slider v-model="settingStore.comic.comicImageWidth" :min="300" :max="windowInnerWidth" :step="10" />
          </el-form-item>
          <el-form-item label="画质">
            <el-select v-model="settingStore.comic.imageQuality" placeholder="请选择画质"
              :loading="loadingState.isLoadingNextPage" @change="handleQualityChange">
              <el-option v-for="item in pictureQuality" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <div v-if="loadingState.isLoadingNextPage" class="text-xs text-gray-400 mt-1">
              正在切换画质，重新加载图片...
            </div>
          </el-form-item>
          <el-form-item label="自动阅读">
            <template #label="{ label }">
              {{ label }}
              <el-tooltip placement="top">
                <template #content>
                  [开发中]自动下滑阅读，解放双手，且当前章节完成后会默认阅读下一章
                  <br />建议网速较好的情况下使用
                  <br />无忧无虑的冲吧~少年/女
                </template>
                <el-icon class="ml-1 cursor-pointer">
                  <QuestionFilled />
                </el-icon>
              </el-tooltip>
            </template>
            <el-switch v-model="settingStore.comic.autoRead" />
          </el-form-item>
          <el-form-item label="自动阅读速度">
            <el-input-number v-model="settingStore.comic.autoReadSpeed" :min="1" :max="1000" :step="1" />
          </el-form-item>

          <el-form-item label="线路代理">
            <el-select v-model="settingStore.comic.proxy" value-key="api" placeholder="请选择线路代理"
              :loading="loadingState.isLoadingNextPage" @change="handleProxyChange">
              <el-option v-for="item in proxy" :key="item.label" :label="item.label" :value="item.value" />
            </el-select>
            <div v-if="loadingState.isLoadingNextPage" class="text-xs text-gray-400 mt-1">
              正在切换线路，重新加载图片...
            </div>
          </el-form-item>

        </el-form>
      </div>
    </el-drawer>

  </div>
</template>

<style scoped lang="scss">
:deep(.el-drawer) {
  background-color: var(--el-color-black);
}

.el-form-item {
  :deep(.el-form-item__label) {
    color: var(--el-color-white);
    display: flex;
    align-items: center;
  }
}
</style>
