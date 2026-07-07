<script setup lang="ts" generic="T extends Partial<ComicsParams>">
import type { ScrollbarInstance } from 'element-plus'
import type { ComicsListProps } from './type'
import type { Comic, Comics, ComicsParams } from '@/api/comic'
import type { SortOptionValue } from '@/constants/options'
import CommonPagination from '@common/components/CommonPagination/index.vue'
import { Minus, Timer } from '@element-plus/icons-vue'
import { Eye, Heart } from '@vicons/ionicons5'
import { cloneDeep } from 'lodash-es'
import { Motion } from 'motion-v'
import Author from '@/components/Author/index.vue'
import Image from '@/components/Image/index.vue'
import { DEFAULT_PAGE_SIZE } from '@/config/pagination'
import { defaultSort, sort } from '@/constants/options'
import { arrayContains } from '@/utils/array'
import { getImageUrl } from '@/utils/string'

const props = withDefaults(defineProps<ComicsListProps<T>>(), {
  isBlockedCategories: true,
  pageSize: DEFAULT_PAGE_SIZE,
})

const router = useRouter()

const settingStore = useSettingStoreHook()

const localStore = useLocalStoreHook()
const layoutStore = useLayoutStoreHook()

const CommonPaginationRef = useTemplateRef('CommonPaginationRef')
const scrollbarRef = useTemplateRef<ScrollbarInstance>('scrollbarRef')

const s = ref<SortOptionValue>(defaultSort)
const contextMenu = reactive({
  visible: false,
  x: 0,
  y: 0,
  comic: undefined as Comic | undefined,
})

const requestParamsKey = computed(() => JSON.stringify(props.params ?? {}))
const showSkeleton = ref(true)
const contextMenuStyle = computed(() => ({
  left: `${contextMenu.x}px`,
  top: `${contextMenu.y}px`,
}))

interface RefreshOptions {
  page?: number
  showSkeleton?: boolean
  clearBeforeFetch?: boolean
  resetScroll?: boolean
}

// 使用 useRequest 管理分页请求
const { loading, data, run: fetchComics } = useRequest<Comics['comics'], [T & { page: number, s: string }]>(
  (params: T & { page: number, s: string }) => props.fetch(params),
  {
    manual: true,
    initialData: {
      docs: [],
      total: 0,
      page: 1,
      pages: 0,
      limit: props.pageSize,
    } as Comics['comics'],
    onError: (error) => {
      console.error('获取漫画列表失败:', error)
    },
  },
)

const shouldShowSkeleton = computed(() => loading.value && showSkeleton.value)

function handleSelectChange() {
  handleReset()
}

function handleReset() {
  CommonPaginationRef.value?.reset()
}

function refresh(options: RefreshOptions = {}) {
  const {
    page = data.value?.page || 1,
    showSkeleton: nextShowSkeleton = true,
    clearBeforeFetch = nextShowSkeleton,
    resetScroll = false,
  } = options

  showSkeleton.value = nextShowSkeleton

  if (resetScroll) {
    scrollbarRef.value?.setScrollTop(0)
  }

  if (clearBeforeFetch && data.value) {
    data.value.docs = []
  }

  return fetchComics({
    page,
    s: s.value,
    ...props.params,
  } as T & { page: number, s: string })
}

function handlePageChange(event: { currentPage: number }) {
  refresh({
    page: event.currentPage,
    showSkeleton: true,
    clearBeforeFetch: true,
    resetScroll: true,
  })
}

// 初始化加载第一页数据
handlePageChange({
  currentPage: 1,
})

watch(requestParamsKey, () => {
  handleReset()
})

const comics = computed(() => {
  if (!data.value)
    return []

  if (props.isBlockedCategories) {
    return data.value.docs.filter((item) => {
      return !item.categories.some(tag => settingStore.filter.categories.includes(tag)) && !settingStore.filter.authors.some(author => item.author.split(/[、,，]\s*/).includes(author))
    })
  }
  else {
    return data.value.docs
  }
})

async function handleCloseTag(tag: string) {
  await ElMessageBox.alert(`是否过滤分类：${tag}`, '提示', {
    showCancelButton: true,
  })
  if (settingStore.filter.categories.includes(tag)) {
    ElMessage.warning('分类已被过滤，请勿重复添加')
  }
  else {
    settingStore.filter.categories.push(tag)
    ElMessage.success('分类已被过滤')
  }
}

function getComicPath(item: Comic) {
  return `/comic/detail/${item._id}`
}

function getComicLabel(item: Comic) {
  return `查看漫画 ${item.title}`
}

function closeContextMenu() {
  contextMenu.visible = false
  contextMenu.comic = undefined
}

function showContextMenu(event: MouseEvent, item: Comic) {
  event.preventDefault()
  event.stopPropagation()

  const menuWidth = 180
  const menuHeight = 48
  const margin = 8
  const maxX = window.innerWidth - menuWidth - margin
  const maxY = window.innerHeight - menuHeight - margin

  contextMenu.x = Math.max(margin, Math.min(event.clientX, maxX))
  contextMenu.y = Math.max(margin, Math.min(event.clientY, maxY))
  contextMenu.comic = item
  contextMenu.visible = true
}

function openComicInPageTab(item: Comic) {
  layoutStore.upsertPageTab({
    title: '漫画详情',
    baseTitle: '漫画详情',
    subtitle: item.title,
    fullPath: getComicPath(item),
    path: getComicPath(item),
  })
  closeContextMenu()
}

function handleAddToLater(item: Comic) {
  localStore.pushItem('WATCH_LATER_LIST', cloneDeep(item))
}

function handleRemoveFromLater(item: Comic) {
  localStore.removeItem('WATCH_LATER_LIST', item, '_id')
}

function handleTagClick(tag: string) {
  router.push({
    path: '/comic/list',
    query: {
      title: tag,
    },
  })
}

/**
 * 格式化数字显示
 * @param num 数字
 * @returns 格式化后的字符串
 */
function formatNumber(num?: number): string {
  if (!num) {
    return '0'
  }
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  }
  else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`
  }
  return num.toString()
}

useEventListener(document, 'click', closeContextMenu)
useEventListener(document, 'contextmenu', closeContextMenu)
useEventListener(document, 'scroll', closeContextMenu, true)
useEventListener(window, 'resize', closeContextMenu)
useEventListener(document, 'keydown', (event) => {
  if (event.key === 'Escape') {
    closeContextMenu()
  }
})

defineExpose({
  refresh,
})
</script>

<template>
  <div class="comic-list size-full flex-1 flex flex-col">
    <div class="flex px py">
      <div class="size-full flex justify-between">
        <div class="text-18px">{{ props.title || '漫画列表' }}</div>

        <div>
          <slot name="filter" :handle-reset="handleReset">
            <!-- 更多过滤 -->
            <el-select
              v-model="s" class="w-110px!" :disabled="loading"
              @change="handleSelectChange"
            >
              <el-option
                v-for="item in sort" :key="item.value" :label="item.label"
                :value="item.value"
              />
            </el-select>
          </slot>
        </div>
      </div>
      <slot name="pagination">
        <CommonPagination
          ref="CommonPaginationRef" :total="data?.total || 0"
          layout="slot, ->, total, prev, pager, next, jumper" :page-size="props.pageSize" :disabled="loading"
          @change="handlePageChange"
        />
      </slot>
    </div>
    <div class="h-full flex-1 overflow-hidden">
      <el-scrollbar ref="scrollbarRef" height="100%">
        <div class="w-full h-6px" />
        <!-- 加载状态骨架屏 -->
        <div
          v-if="shouldShowSkeleton" class="grid justify-center gap-5"
          style="grid-template-columns: repeat(auto-fill, 270px);"
        >
          <Motion
            v-for="(i, index) in 12" :key="i"
            :initial="{ opacity: 0, x: -30, scale: 0.8 }"
            :animate="{ opacity: 1, x: 0, scale: 1 }"
            :transition="{
              duration: 0.4,
              delay: index * 0.05,
              ease: 'backOut',
            }"
          >
            <el-skeleton
              class="rounded-2 overflow-hidden p-3 shadow-[--el-box-shadow]"
              :loading="true"
            >
              <template #template>
                <div class="size-full">
                  <div class="w-full! aspect-3/4">
                    <el-skeleton-item class="size-full!" variant="image" />
                  </div>
                  <el-skeleton-item variant="h3" class="w-80%! mt-2" />
                  <el-skeleton-item variant="text" class="w-60%! mt-1" />
                  <el-skeleton-item variant="text" class="w-40%! mt-1" />
                  <div class="mt-2 flex gap-2">
                    <el-skeleton-item variant="button" class="w-50px! h-24px!" />
                    <el-skeleton-item variant="button" class="w-60px! h-24px!" />
                    <el-skeleton-item variant="button" class="w-40px! h-24px!" />
                  </div>
                </div>
              </template>
            </el-skeleton>
          </Motion>
        </div>

        <!-- 空状态显示 -->
        <div v-else-if="!loading && comics.length === 0" class="flex-center h-full min-h-400px">
          <el-empty description="暂无漫画数据" :image-size="160">
            <div class="text-14px text-[--el-text-color-secondary] leading-relaxed text-center">
              <div>当前筛选条件下没有找到相关漫画</div>
              <div class="mt-1">请尝试调整筛选条件或稍后再试</div>
            </div>
          </el-empty>
        </div>

        <!-- 实际内容 -->
        <div
          v-else class="grid justify-center gap-5"
          style="grid-template-columns: repeat(auto-fill, 270px);"
        >
          <article
            v-for="item in comics" :key="item._id"
            class="comic-card rounded-2 overflow-hidden p-3 shadow-[--el-box-shadow]"
            @contextmenu="showContextMenu($event, item)"
          >
            <RouterLink
              class="comic-card-link"
              :to="getComicPath(item)"
              :aria-label="getComicLabel(item)"
            />
            <!-- 封面图 -->
            <div class="relative">
              <Image :src="getImageUrl(item.thumb.path)" :alt="item.title" />
              <el-tooltip
                class="box-item" effect="dark"
                :content="arrayContains(localStore.local.WATCH_LATER_LIST, item._id, '_id') ? '从稍后再看中移除' : '添加到稍后再看'"
                placement="top-start"
              >
                <button
                  v-if="!arrayContains(localStore.local.WATCH_LATER_LIST, item._id, '_id')"
                  type="button"
                  class="absolute top-2 right-2 z-2 size-34px bg-[--el-color-info] rounded-1 flex-center"
                  @click.stop="handleAddToLater(item)"
                >
                  <el-icon class="text-[--el-color-white]!">
                    <Timer />
                  </el-icon>
                </button>
                <button
                  v-else class="absolute top-2 right-2 z-2 w-44px h-44px bg-[--el-color-info] rounded-1 flex-center"
                  type="button"
                  @click.stop="handleRemoveFromLater(item)"
                >
                  <el-icon class="text-[--el-color-white]!">
                    <Minus />
                  </el-icon>
                </button>
              </el-tooltip>
            </div>
            <!-- 标题 -->
            <div class="line-clamp-2 text-16px font-500 mt-2">
              {{ item.title }}
            </div>
            <!-- 章节信息 -->
            <div class="text-16px mt-1 text-[--el-text-color-secondary]">
              <el-text v-if="item.finished" class="mx-1" type="primary">[完结]</el-text> {{ item.epsCount }}章 {{
                item.pagesCount }}P
            </div>
            <!-- 作者 -->
            <div class="relative z-2 text-[--el-text-color-secondary] flex">
              作者:
              <div class="flex-1 flex gap-2 ml-2 flex-wrap">
                <Author v-for="author in item.author.split(/[、,，]\s*/)" :key="author" :author="author" />
              </div>
            </div>
            <!-- 统计信息 -->
            <div class="mt-2 flex items-center gap-4 text-[--el-text-color-secondary] text-14px">
              <div class="flex items-center gap-1">
                <el-icon color="var(--el-color-danger)">
                  <Heart />
                </el-icon>
                <span>{{ formatNumber(item.totalLikes) }}</span>
              </div>
              <div class="flex items-center gap-1">
                <el-icon color="var(--el-color-primary)">
                  <Eye />
                </el-icon>
                <span>{{ formatNumber(item.totalViews) }}</span>
              </div>
            </div>
            <!-- 分类 -->
            <div class="relative z-2 mt-1 flex flex-wrap gap-2">
              <el-tag
                v-for="tag in item.categories" :key="tag" closable
                class="comic-category-tag"
                type="primary" effect="plain"
                @close="handleCloseTag(tag)" @click.stop="handleTagClick(tag)"
              >
                {{ tag }}
              </el-tag>
            </div>
          </article>
          <div class="w-full h-6px" />
        </div>
      </el-scrollbar>
    </div>
    <Teleport to="body">
      <div
        v-if="contextMenu.visible && contextMenu.comic"
        class="comic-context-menu"
        :style="contextMenuStyle"
        role="menu"
        @click.stop
        @contextmenu.prevent.stop
      >
        <button
          type="button"
          class="comic-context-menu__item"
          role="menuitem"
          @click="openComicInPageTab(contextMenu.comic)"
        >
          在新标签页中打开链接
        </button>
      </div>
    </Teleport>
  </div>
</template>

<style lang="scss" scoped>
.comic-card {
  position: relative;
  color: inherit;
  transition:
    box-shadow 160ms ease,
    transform 160ms ease;

  &:hover,
  &:focus-within {
    box-shadow: var(--el-box-shadow-light);
    transform: translateY(-2px);
  }
}

.comic-card-link {
  position: absolute;
  inset: 0;
  z-index: 1;
  border-radius: inherit;
  color: inherit;
  text-decoration: none;

  &:focus-visible {
    outline: 2px solid var(--el-color-primary);
    outline-offset: -2px;
  }
}

.comic-category-tag {
  cursor: pointer;
}

button {
  border: 0;
  padding: 0;
  cursor: pointer;
}

.comic-context-menu {
  position: fixed;
  z-index: 3000;
  min-width: 180px;
  padding: 8px;
  border: 1px solid var(--el-border-color-light);
  border-radius: 10px;
  background: var(--el-bg-color-overlay);
  box-shadow: var(--el-box-shadow-light);
}

.comic-context-menu__item {
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 40px;
  padding: 0 14px;
  border-radius: 7px;
  background: transparent;
  color: var(--el-text-color-primary);
  font-size: 14px;
  text-align: left;

  &:hover,
  &:focus-visible {
    background: var(--el-fill-color-light);
    color: var(--el-color-primary);
    outline: none;
  }
}
</style>
