<script setup lang="ts">
import type { ComicOrderPage, PageData } from '@/api/comic'
import { QuestionFilled, Setting } from '@element-plus/icons-vue'
import { omit } from 'lodash-es'
import debounce from 'lodash-es/debounce'
import { getComicPages } from '@/api/comic'
import { pictureQuality } from '@/constants/options'
import { proxy } from '@/services/config'
import { addAutoReadScrollListener, useAutoRead } from '@/utils/autoRead'
import { getImageUrl } from '@/utils/string'

// 类型定义
type ChapterInfo = ComicOrderPage['ep']

interface ComicImage {
  id: string
  path: string
}

const props = defineProps<{
  /** 漫画ID */
  id: string
  /** 当前章节号 */
  chapter: string
  /** 最大章节数 */
  maxChapter: string
}>()
// 常量定义
const SCROLL_DEBOUNCE_DELAY = 50
const PRELOAD_THRESHOLD_MULTIPLIER = 2

const settingStore = useSettingStoreHook()
const scrollbarRef = useTemplateRef('scrollbarRef')

// 窗口尺寸常量
const windowInnerWidth = window.innerWidth
const windowInnerHeight = window.innerHeight

// 使用 VueUse 的 useDocumentVisibility 监听页面可见性
const documentVisibility = useDocumentVisibility()

// 自动阅读功能
const autoRead = useAutoRead({
  enabled: computed(() => settingStore.comic.autoRead),
  speed: computed(() => settingStore.comic.autoReadSpeed),
  container: computed(() => scrollbarRef.value?.wrapRef),
  resumeDelay: 1000,
})

// 页面可见性状态管理
const isPageVisible = ref(true)

// 监听页面可见性变化，控制自动滚动
watch(documentVisibility, (visibility) => {
  if (!settingStore.comic.autoRead)
    return

  if (visibility === 'visible') {
    // 页面获得焦点时，恢复自动滚动
    console.log('页面获得焦点，恢复自动滚动')
    isPageVisible.value = true
    // 如果自动阅读开启且没有其他暂停条件，则开始滚动
    if (!autoRead.state.isPausedByHover && !autoRead.state.isPausedByManualScroll) {
      autoRead.start()
    }
  }
  else if (visibility === 'hidden') {
    // 页面失去焦点时，暂停自动滚动
    console.log('页面失去焦点，暂停自动滚动')
    isPageVisible.value = false
    autoRead.stop()
  }
})

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
  if (loadingState.isLoadingNextPage)
    return

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
  }
  catch (error) {
    console.error('章节数据加载失败:', error)
    loadingState.hasError = true
    loadingState.errorMessage = '章节数据加载失败，请稍后重试'
    ElMessage.error(loadingState.errorMessage)
  }
  finally {
    loadingState.isLoadingNextPage = false
  }
}

/**
 * 滚动事件处理函数
 * 使用防抖优化性能，支持无限滚动加载
 */
const handleScroll = debounce((e: { scrollTop: number, scrollLeft: number }) => {
  const scrollElement = scrollbarRef.value?.wrapRef
  if (!scrollElement)
    return

  const { scrollTop } = e
  const { scrollHeight, clientHeight } = scrollElement
  const distanceFromBottom = scrollHeight - scrollTop - clientHeight

  // 预加载阈值：当距离底部小于2个屏幕高度时开始加载下一页
  const preloadThreshold = windowInnerHeight * PRELOAD_THRESHOLD_MULTIPLIER

  // 检查是否需要加载下一页
  const shouldLoadNextPage
    = distanceFromBottom <= preloadThreshold
      && pageInfo.page < pageInfo.pages
      && !loadingState.isLoadingNextPage

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
  Object.keys(chapterInfo).forEach((key) => {
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

// 计算属性：是否可以跳转到上一章
const canGoPrevChapter = computed(() => currentChapter.value > 1)

// 计算属性：是否可以跳转到下一章
const canGoNextChapter = computed(() => currentChapter.value < maxChapterNum)

/**
 * 上一章
 */
function prevChapter() {
  if (!canGoPrevChapter.value)
    return

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
  if (!canGoNextChapter.value)
    return

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

// useEventListener('dialog', () => {
//   drawer.value = false
// })

function handleContextMenu(e: MouseEvent) {
  e.stopPropagation()
  e.preventDefault()
  // 展开/收起 设置抽屉
  drawer.value = !drawer.value
}

// 自动阅读事件监听器清理函数
let autoReadCleanupFunctions: (() => void)[] = []

onMounted(() => {
  useEventListener(document.querySelector('.chapter-drawer-modal'), 'contextmenu', handleContextMenu)

  // 初始化自动阅读事件监听器
  nextTick(() => {
    const scrollContainer = scrollbarRef.value?.wrapRef
    if (scrollContainer) {
      // 添加滚动监听器
      const scrollCleanup = addAutoReadScrollListener(scrollContainer, autoRead)
      autoReadCleanupFunctions.push(scrollCleanup)
    }
  })
})

onUnmounted(() => {
  // 清理自动阅读事件监听器
  autoReadCleanupFunctions.forEach(cleanup => cleanup())
  autoReadCleanupFunctions = []
})

// chapter-drawer-modal

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
        <el-button
          :disabled="!canGoPrevChapter" text bg
          @click="prevChapter"
        >
          上一章
        </el-button>
        <el-button
          :disabled="!canGoNextChapter" text bg
          @click="nextChapter"
        >
          下一章
        </el-button>

        <!-- 设置按钮 -->
        <el-icon class="cursor-pointer hover:text-blue-300 ml-2" @click="drawer = true">
          <Setting />
        </el-icon>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="flex-1 overflow-hidden" @contextmenu.prevent="handleContextMenu">
      <el-scrollbar ref="scrollbarRef" class="h-full" @scroll="handleScroll">
        <div class="mx-auto" :style="{ width: `${settingStore.comic.comicImageWidth}px` }">
          <!-- 图片列表 -->
          <Image
            v-for="(item, index) in comicImages" :key="item.id || index" :src="item.path"
            aspect="auto"
            :alt="`第${index + 1}张图片`"
            @mouseenter="autoRead.pauseByHover"
            @mouseleave="autoRead.resumeByHover"
          />

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
    <el-drawer
      v-model="drawer" modal-class="chapter-drawer-modal" direction="rtl"
      size="400px" :with-header="false"
    >
      <div class="size-full">
        <el-form label-width="100px" label-position="left">
          <el-form-item label="宽度">
            <el-slider
              v-model="settingStore.comic.comicImageWidth" :min="300" :max="windowInnerWidth"
              :step="10"
            />
          </el-form-item>
          <el-form-item label="画质">
            <el-select
              v-model="settingStore.comic.imageQuality" placeholder="请选择画质"
              :loading="loadingState.isLoadingNextPage" @change="handleQualityChange"
            >
              <el-option
                v-for="item in pictureQuality" :key="item.value" :label="item.label"
                :value="item.value"
              />
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
                  自动下滑阅读，解放双手，鼠标移动到图片上会暂停
                  <br>建议网速较好的情况下使用
                  <br>手动滚动后会在1秒后自动恢复
                </template>
                <el-icon class="ml-1 cursor-pointer">
                  <QuestionFilled />
                </el-icon>
              </el-tooltip>
            </template>
            <div class="flex items-center gap-2">
              <el-switch v-model="settingStore.comic.autoRead" />
              <el-button
                v-if="settingStore.comic.autoRead"
                :type="autoRead.state.isAutoScrolling ? 'danger' : 'primary'"
                size="small"
                @click="autoRead.toggle"
              >
                {{ autoRead.state.isAutoScrolling ? '暂停' : '开始' }}
              </el-button>
            </div>
          </el-form-item>
          <el-form-item v-if="settingStore.comic.autoRead" label="自动阅读速度">
            <div class="w-full">
              <el-slider
                v-model="settingStore.comic.autoReadSpeed"
                :min="5"
                :max="200"
                :step="5"
                show-input
                :show-input-controls="false"
              />
              <div class="text-xs text-gray-400 mt-1">
                当前速度: {{ settingStore.comic.autoReadSpeed }} 像素/秒
                <span v-if="!isPageVisible" class="text-red-400 ml-2">
                  (页面失去焦点已暂停)
                </span>
                <span v-else-if="autoRead.state.isPausedByHover" class="text-yellow-400 ml-2">
                  (鼠标悬停已暂停)
                </span>
                <span v-else-if="autoRead.state.isPausedByManualScroll" class="text-blue-400 ml-2">
                  (手动滚动已暂停)
                </span>
              </div>
            </div>
          </el-form-item>

          <el-form-item label="线路代理">
            <el-select
              v-model="settingStore.comic.proxy" value-key="api" placeholder="请选择线路代理"
              @change="handleProxyChange"
            >
              <el-option
                v-for="item in proxy" :key="item.label" :label="item.label"
                :value="item.value"
              />
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
