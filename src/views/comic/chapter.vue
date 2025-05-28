<script setup lang="ts">
import { getComicPages } from '@/api/comic'
import { Setting, QuestionFilled } from '@element-plus/icons-vue'
import { getImageUrl } from '@/utils/string'
import { pictureQuality } from '@/constants/options'
import debounce from 'lodash-es/debounce'
import { proxy } from '@/services/config'

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

const maxWidth = window.innerWidth

const currentChapter = Number(props.chapter)
const maxChapterNum = Number(props.maxChapter)

// 自动阅读状态管理
const autoReadState = reactive({
  isActive: false,
  animationId: null as number | null,
  isUserScrolling: false,
  lastUserScrollTime: 0,
  lastFrameTime: 0,
  targetScrollSpeed: 0,
  restartTimeoutId: null as number | null, // 重启定时器ID
  isMouseHovering: false // 鼠标是否悬停在图片容器上
})

const currentTitleId = ref('')
const titles = ref<{
  title: string
  _id: string
}[]>([])

const title = computed(() => {
  return titles.value.find(item => item._id === currentTitleId.value)
})

const drawer = ref(false)

/** 漫画图片列表 */
const comics = reactive<{ id: string, path: string }[]>([])

/**
 * 获取章节页面数据
 */
async function getChapterPages() {
  try {
    const res = await getComicPages(props.id, currentChapter, 1)
    titles.value.push(res.ep)
    currentTitleId.value = res.ep._id
    const formatData = res.pages.docs.map(item => ({
      id: item.id,
      path: getImageUrl(item.media.path),
    }))
    comics.push(...formatData)

    // 如果启用了自动阅读，延迟启动
    if (settingStore.comic.autoRead) {
      setTimeout(() => {
        startAutoRead()
      }, 1000) // 延迟1秒启动，确保图片加载完成
    }

    console.log('📖 章节数据加载完成:', res)
  } catch (error) {
    console.error('📖 章节数据加载失败:', error)
  }
}

const handleScroll = debounce((e: { scrollTop: number; scrollLeft: number }) => {
  const scrollElement = scrollbarRef.value?.wrapRef
  if (!scrollElement) return

  const { scrollTop } = e
  const { scrollHeight, clientHeight } = scrollElement

  // 记录用户手动滚动
  const now = Date.now()
  autoReadState.lastUserScrollTime = now
  // 如果自动阅读未激活且功能开启，用户滑动后1秒重启
  if (!autoReadState.isActive && settingStore.comic.autoRead) {
    autoReadState.isUserScrolling = true
    console.log('🔍 检测到用户滑动，准备1秒后重启自动阅读')
    scheduleAutoReadRestart()
  } else {
    // 如果是自动阅读期间的滚动，检查是否是用户主动滚动
    // 通过检查滚动距离是否超出预期来判断
    const expectedScrollTop = scrollElement.scrollTop
    const scrollDiff = Math.abs(scrollTop - expectedScrollTop)

    if (scrollDiff > autoReadState.targetScrollSpeed * 2) {
      // 滚动距离超出预期，可能是用户手动滚动
      autoReadState.isUserScrolling = true
      console.log('🖱️ 检测到用户手动滚动，暂停自动阅读')

      // 延迟恢复自动阅读
      setTimeout(() => {
        if (settingStore.comic.autoRead && now === autoReadState.lastUserScrollTime) {
          autoReadState.isUserScrolling = false
          console.log('🔄 恢复自动阅读')
        }
      }, 1500) // 1.5秒后恢复
    }
  }

  // 检查是否到达底部（距离底部小于10px时认为到底）
  const distanceFromBottom = scrollHeight - scrollTop - clientHeight
  if (distanceFromBottom <= 10) {
    console.log('🎯 已到达底部！')
    stopAutoRead() // 到达底部时停止自动阅读
    handleInfiniteScroll()
  }

  // 如果不是自动阅读状态，500ms后重置用户滚动状态
  if (!autoReadState.isActive) {
    setTimeout(() => {
      if (Date.now() - autoReadState.lastUserScrollTime >= 500) {
        autoReadState.isUserScrolling = false
      }
    }, 500)
  }
}, 50) // 进一步减少防抖时间，提高响应性

/**
 * 鼠标进入图片容器
 */
function handleMouseEnter() {
  autoReadState.isMouseHovering = true
  console.log('🖱️ 鼠标进入图片区域，暂停自动阅读')
}

/**
 * 鼠标离开图片容器
 */
function handleMouseLeave() {
  autoReadState.isMouseHovering = false
  console.log('🖱️ 鼠标离开图片区域，恢复自动阅读')
}

/**
 * 调度自动阅读重启
 */
function scheduleAutoReadRestart() {
  // 清除之前的重启定时器
  if (autoReadState.restartTimeoutId) {
    clearTimeout(autoReadState.restartTimeoutId)
  }

  console.log('⏰ 计划在1秒后重启自动阅读')

  autoReadState.restartTimeoutId = setTimeout(() => {
    // 简单检查：自动阅读开启且当前未激活
    if (settingStore.comic.autoRead && !autoReadState.isActive) {
      console.log('🔄 用户滑动后自动重启阅读')
      autoReadState.isUserScrolling = false // 重置滚动状态
      startAutoRead()
    } else {
      console.log('❌ 不满足重启条件，跳过重启')
    }
    autoReadState.restartTimeoutId = null
  }, 1000) // 1秒后重启
}

/**
 * 启动自动阅读
 */
function startAutoRead() {
  if (autoReadState.isActive || !scrollbarRef.value?.wrapRef) return

  autoReadState.isActive = true
  autoReadState.lastFrameTime = performance.now()
  autoReadState.targetScrollSpeed = settingStore.comic.autoReadSpeed / 10 // 转换为每帧的滚动距离
  console.log('🚀 启动自动阅读，速度:', settingStore.comic.autoReadSpeed)

  const animate = (currentTime: number) => {
    if (!autoReadState.isActive || !scrollbarRef.value?.wrapRef) return

    const scrollElement = scrollbarRef.value.wrapRef
    const { scrollTop, scrollHeight, clientHeight } = scrollElement

    // 检查是否到达底部
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      console.log('📖 自动阅读完成 - 到达底部')
      stopAutoRead()
      return
    }

    // 如果用户正在手动滚动或鼠标悬停，跳过这一帧但继续动画循环
    if (autoReadState.isUserScrolling || autoReadState.isMouseHovering) {
      autoReadState.lastFrameTime = currentTime
      autoReadState.animationId = requestAnimationFrame(animate)
      return
    }

    // 计算时间差，实现平滑滚动
    const deltaTime = currentTime - autoReadState.lastFrameTime

    // 控制滚动频率，大约60fps但可以调节
    if (deltaTime >= 16) { // 约60fps
      const scrollDistance = autoReadState.targetScrollSpeed * (deltaTime / 16)

      // 直接设置scrollTop，避免smooth行为导致的冲突
      scrollElement.scrollTop = scrollTop + scrollDistance

      autoReadState.lastFrameTime = currentTime
    }

    // 继续下一帧
    autoReadState.animationId = requestAnimationFrame(animate)
  }

  // 启动动画循环
  autoReadState.animationId = requestAnimationFrame(animate)
}

/**
 * 停止自动阅读
 */
function stopAutoRead() {
  if (!autoReadState.isActive) return

  autoReadState.isActive = false
  if (autoReadState.animationId) {
    cancelAnimationFrame(autoReadState.animationId)
    autoReadState.animationId = null
  }

  // 清除重启定时器
  if (autoReadState.restartTimeoutId) {
    clearTimeout(autoReadState.restartTimeoutId)
    autoReadState.restartTimeoutId = null
  }

  console.log('⏹️ 停止自动阅读')
}


/**
 * 上一章
 */
function prevChapter() {

}

/**
 * 下一章
 */
function nextChapter() {

}

function handleInfiniteScroll() {
  console.log('🚀 触发无限滚动加载')
  // 这里可以加载下一章或更多图片
  // 例如：自动跳转到下一章
  // nextChapter()
}

// 监听自动阅读开关变化
watch(() => settingStore.comic.autoRead, (newValue) => {
  if (newValue) {
    startAutoRead()
  } else {
    stopAutoRead()
  }
})

// 监听自动阅读速度变化
watch(() => settingStore.comic.autoReadSpeed, (newSpeed) => {
  if (autoReadState.isActive) {
    autoReadState.targetScrollSpeed = newSpeed / 10
    console.log('🔄 自动阅读速度已调整为:', newSpeed)
  }
})

// 组件卸载时清理
onUnmounted(() => {
  stopAutoRead()
  // 清理重启定时器
  if (autoReadState.restartTimeoutId) {
    clearTimeout(autoReadState.restartTimeoutId)
    autoReadState.restartTimeoutId = null
  }
})

// 初始化数据
getChapterPages()
</script>

<template>
  <div class="flex flex-col bg-[--el-text-color-primary] h-screen">
    <!-- 顶部导航栏 -->
    <div class="h-50px flex justify-between items-center p-3 bg-[--el-color-black] color-[--el-color-white] border-b">
      <!-- 章节标题 -->
      <div class="flex items-center gap-3">
        <div class="font-medium">{{ title?.title }}</div>
        <div class="text-sm opacity-75">共{{ maxChapterNum }}话</div>
        <div v-if="autoReadState.isActive" class="text-sm flex items-center gap-1"
          :class="autoReadState.isMouseHovering ? 'text-orange-400' : 'text-green-400'">
          <span class="animate-pulse">🤖</span>
          {{ autoReadState.isMouseHovering ? '鼠标悬停中' : '自动阅读中' }}
        </div>
        <div v-else-if="settingStore.comic.autoRead" class="text-sm text-yellow-400 flex items-center gap-1">
          <span>⏸️</span>
          已停止 (滑动可重启)
        </div>
        <div v-if="autoReadState.restartTimeoutId" class="text-sm text-blue-400 flex items-center gap-1">
          <span class="animate-pulse">⏰</span>
          准备重启中...
        </div>
      </div>

      <!-- 章节导航按钮 -->
      <div class="flex items-center gap-2">
        <el-button :disabled="currentChapter >= 1" text bg @click="prevChapter">
          上一章
        </el-button>
        <el-button :disabled="currentChapter >= maxChapterNum" text bg @click="nextChapter">
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
        <div class="mx-auto" :style="{ width: settingStore.comic.comicImageWidth + 'px' }"
          @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
          <Image :src="item.path" aspect="auto" v-for="(item, index) in comics" :key="item.id || index" />
        </div>
      </el-scrollbar>
    </div>

    <!-- 设置抽屉 -->
    <el-drawer v-model="drawer" direction="rtl" size="400px" :with-header="false">
      <div class="size-full">

        <el-form label-width="100px" labelPosition="left">
          <el-form-item label="宽度">
            <el-slider v-model="settingStore.comic.comicImageWidth" :min="300" :max="maxWidth" :step="10" />
          </el-form-item>
          <el-form-item label="画质">
            <el-select v-model="settingStore.comic.imageQuality" placeholder="请选择画质">
              <el-option v-for="item in pictureQuality" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="自动阅读">
            <template #label="{ label }">
              {{ label }}
              <el-tooltip placement="top">
                <template #content>
                  自动下滑阅读，解放双手，且当前章节完成后会默认阅读下一章
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
            <el-select v-model="settingStore.comic.proxy" value-key="api" placeholder="请选择线路代理">
              <el-option v-for="item in proxy" :key="item.label" :label="item.label" :value="item.value" />
            </el-select>
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
