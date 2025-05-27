<script setup lang="ts">
import { getComicPages } from '@/api/comic'
import { Setting } from '@element-plus/icons-vue'
import { getImageUrl } from '@/utils/string'
import type { ComicOrderPage } from '@/api/comic'

/**
 * 章节阅读页面
 * 路由格式: /chapter/:id/:chapter/:maxChapter
 * 例如: /chapter/comic123/1/10
 */
const props = defineProps<{
  /** 漫画ID */
  id: string
  /** 当前章节号 */
  chapter: string
  /** 最大章节数 */
  maxChapter: string
}>()

const route = useRoute()
const router = useRouter()

// 监听路由变化，用于调试热更新时的参数保持
watch(() => route.fullPath, (newPath, oldPath) => {
  console.log('🔄 章节页面路由变化:', { 
    from: oldPath, 
    to: newPath, 
    props: {
      id: props.id,
      chapter: props.chapter,
      maxChapter: props.maxChapter
    }
  })
}, { immediate: true })

const settingStore = useSettingStoreHook()

const currentChapter = Number(props.chapter)
const maxChapterNum = Number(props.maxChapter)

const currentTitleId = ref('')
const titles = ref<{
  title: string
  _id: string
}[]>([])

const title = computed(() => {
  return titles.value.find(item => item._id === currentTitleId.value)
})

const drawer = ref(false)

const comics = reactive<ComicOrderPage['pages']['docs']>([])

/**
 * 获取章节页面数据
 */
function getChapterPages() {
  return getComicPages(props.id, currentChapter, 1).then((res) => {
    titles.value.push(res.ep)
    currentTitleId.value = res.ep._id
    // res.pages.docs
    comics.push(...res.pages.docs)
    console.log('📖 章节数据加载完成:', res)
  })
}

/**
 * 跳转到指定章节
 */
function goToChapter(chapterNum: number) {
  if (chapterNum < 1 || chapterNum > maxChapterNum) {
    ElMessage.warning('章节号超出范围')
    return
  }
  
  router.push(`/chapter/${props.id}/${chapterNum}/${props.maxChapter}`)
}

/**
 * 上一章
 */
function prevChapter() {
  goToChapter(currentChapter - 1)
}

/**
 * 下一章
 */
function nextChapter() {
  goToChapter(currentChapter + 1)
}

// 计算属性
const canGoPrev = computed(() => currentChapter > 1)
const canGoNext = computed(() => currentChapter < maxChapterNum)

// 初始化数据
getChapterPages()
</script>

<template>
  <div class="flex flex-col bg-[--el-text-color-primary] h-screen">
    <!-- 顶部导航栏 -->
    <div class="h-50px flex justify-between items-center p-3 bg-[--el-color-black] color-[--el-color-white] border-b">
      <!-- 章节标题 -->
      <div class="flex items-center gap-3">
        <div class="font-medium">{{ title?.title || `第${props.chapter}章` }}</div>
        <div class="text-sm opacity-75">{{ currentChapter }}/{{ maxChapterNum }}</div>
      </div>

      <!-- 章节导航按钮 -->
      <div class="flex items-center gap-2">
        <el-button 
          size="small" 
          type="primary"
          :disabled="!canGoPrev"
          @click="prevChapter"
        >
          ← 上一章
        </el-button>
        <el-button 
          size="small" 
          type="primary"
          :disabled="!canGoNext"
          @click="nextChapter"
        >
          下一章 →
        </el-button>
        
        <!-- 设置按钮 -->
        <el-icon class="cursor-pointer hover:text-blue-300 ml-2" @click="drawer = true">
          <Setting />
        </el-icon>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="flex-1 overflow-hidden">
      <el-scrollbar class="h-full">
        <div class="mx-auto" :style="{ width: settingStore.comic.comicImageWidth + 'px' }">
          <Image 
            :src="getImageUrl(item.media.path)" 
            v-for="(item, index) in comics" 
            :key="item.id || index"
            class="block w-full"
          />
        </div>
      </el-scrollbar>
    </div>

    <!-- 底部导航栏 -->
    <div class="h-50px flex justify-center items-center bg-gray-100 border-t">
      <div class="flex items-center gap-4">
        <el-button 
          type="primary" 
          size="small"
          :disabled="!canGoPrev"
          @click="prevChapter"
        >
          ← 上一章
        </el-button>
        
        <span class="text-sm text-gray-600">
          第 {{ currentChapter }} 章 / 共 {{ maxChapterNum }} 章
        </span>
        
        <el-button 
          type="primary" 
          size="small"
          :disabled="!canGoNext"
          @click="nextChapter"
        >
          下一章 →
        </el-button>
      </div>
    </div>

    <!-- 设置抽屉 -->
    <el-drawer v-model="drawer" direction="rtl" size="400px">
      <template #header>
        <h4>📚 阅读设置</h4>
      </template>
      <el-form label-width="100px">
        <el-form-item label="漫画宽度">
          <el-slider 
            v-model="settingStore.comic.comicImageWidth" 
            :min="300" 
            :max="1200" 
            :step="10"
            show-input
          />
          <div class="text-sm text-gray-500 mt-1">
            当前宽度: {{ settingStore.comic.comicImageWidth }}px
          </div>
        </el-form-item>
        
        <el-form-item label="章节信息">
          <div class="text-sm">
            <div>漫画ID: {{ props.id }}</div>
            <div>当前章节: {{ props.chapter }}</div>
            <div>总章节数: {{ props.maxChapter }}</div>
            <div>完整路径: {{ route.fullPath }}</div>
          </div>
        </el-form-item>
      </el-form>
    </el-drawer>

    <!-- 热更新测试提示 -->
    <div class="fixed bottom-4 right-4 bg-yellow-100 p-3 rounded shadow text-sm max-w-300px z-50">
      <div class="font-bold text-yellow-800 mb-1">🔥 热更新测试</div>
      <div class="text-yellow-700 text-xs">
        修改此文件并保存，观察URL参数是否保持：<br>
        <code class="text-xs break-all">/chapter/{{ props.id }}/{{ props.chapter }}/{{ props.maxChapter }}</code>
      </div>
      <!-- 🔧 修改这个注释来触发热更新测试: 手动路由配置 -->
    </div>
  </div>
</template>

<style scoped>
/* 章节阅读页面样式 */
.chapter-reader {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 🎨 修改这里的样式也会触发热更新 */
.navigation-button {
  transition: all 0.2s ease;
}

.navigation-button:hover {
  transform: translateY(-1px);
}

/* 漫画图片样式 */
.comic-image {
  display: block;
  width: 100%;
  height: auto;
  margin-bottom: 2px;
}
</style>
