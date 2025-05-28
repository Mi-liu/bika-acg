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

const currentTitleId = ref('')
const titles = ref<{
  title: string
  _id: string
}[]>([])

const title = computed(() => {
  return titles.value.find(item => item._id === currentTitleId.value)
})

const page = reactive({
  page: 0,
  pages: 1,
})

const drawer = ref(false)

/** 漫画图片列表 */
const comics = reactive<{ id: string, path: string }[]>([])

/**
 * 获取章节页面数据
 */
async function getChapterPages() {
  try {
    const res = await getComicPages(props.id, currentChapter, page.page + 1)
    page.page = res.pages.page
    page.pages = res.pages.pages
    titles.value.push(res.ep)
    currentTitleId.value = res.ep._id
    const formatData = res.pages.docs.map(item => ({
      id: item.id,
      path: getImageUrl(item.media.path),
    }))
    comics.push(...formatData)

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

  // 检查是否到达底部（距离底部小于10px时认为到底）
  const distanceFromBottom = scrollHeight - scrollTop - clientHeight
  if (distanceFromBottom <= 10) {
    console.log('🎯 已到达底部！')
    handleInfiniteScroll()
  }
}, 50)

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
        <div class="mx-auto" :style="{ width: settingStore.comic.comicImageWidth + 'px' }">
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
