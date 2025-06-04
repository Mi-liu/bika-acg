<script setup lang="ts" generic="T extends Partial<ComicsParams>">
import type { ComicsListProps } from './type'
import type { Comic, Comics, ComicsParams } from '@/api/comic'
import type { SortOptionValue } from '@/constants/options'
import CommonPagination from '@common/components/CommonPagination/index.vue'
import { Minus, Timer } from '@element-plus/icons-vue'
import { cloneDeep } from 'lodash-es'
import { cardAnimations } from '@/animations/cardAnimation'
import Image from '@/components/Image/index.vue'
import { DEFAULT_PAGE_SIZE } from '@/config/pagination'
import { defaultSort, sort } from '@/constants/options'
import { arrayContains } from '@/utils/array'
import { getImageUrl } from '@/utils/string'
import '@/animations/cardAnimation.scss'

const props = withDefaults(defineProps<ComicsListProps<T>>(), {
  isBlockedCategories: true,
})

const router = useRouter()

const settingStore = useSettingStoreHook()

const localStore = useLocalStoreHook()

const CommonPaginationRef = useTemplateRef('CommonPaginationRef')

const loading = ref(false)

const data = ref<Comics['comics']>({
  docs: [],
  total: 0,
  page: 1,
  pages: 0,
  limit: DEFAULT_PAGE_SIZE,
})

const s = ref<SortOptionValue>(defaultSort)

function handleSelectChange() {
  CommonPaginationRef.value?.reset()
}

async function handlePageChange(event: { currentPage: number }) {
  try {
    loading.value = true
    const result = await props.fetch({
      page: event.currentPage,
      s: s.value,
      ...props.params,
    } as T & { page: number, s: string })
    data.value = result
  }
  finally {
    await nextTick()
    loading.value = false
  }
}
handlePageChange({
  currentPage: 1,
})

const comics = computed(() => {
  if (props.isBlockedCategories) {
    return data.value.docs.filter((item) => {
      return !item.categories.some(tag => settingStore.comic.blockedCategories.includes(tag))
    })
  }
  else {
    return data.value.docs
  }
})

async function handleCloseTag(tag: string) {
  await ElMessageBox.alert(`是否屏蔽分类：${tag}`, '提示', {
    showCancelButton: true,
  })
  if (settingStore.comic.blockedCategories.includes(tag)) {
    ElMessage.warning('分类已被屏蔽，请勿重复添加')
  }
  else {
    settingStore.comic.blockedCategories.push(tag)
    ElMessage.success('分类已被屏蔽')
  }
}

// 选择动画效果
const animation = cardAnimations.leftToRight

function handleComicClick(item: Comic) {
  const url = router.resolve(`/comic/detail/${item._id}`).href
  window.open(url, '_blank')
}

function handleAuthorClick(author: string) {
  const url = router.resolve({
    path: '/comic/list',
    query: {
      author,
    },
  }).href
  window.open(url, '_blank')
}

function handleFollowAuthor(author: string) {
  localStore.pushItem('FOLLOW_AUTHOR_LIST', author)
}

function handleUnfollowAuthor(author: string) {
  localStore.removeItem('FOLLOW_AUTHOR_LIST', author)
}

function handleAddToLater(item: Comic) {
  localStore.pushItem('WATCH_LATER_LIST', cloneDeep(item))
}

function handleRemoveFromLater(item: Comic) {
  localStore.removeItem('WATCH_LATER_LIST', item, '_id')
}

function handleTagClick(tag: string) {
  const url = router.resolve({
    path: '/comic/list',
    query: {
      title: tag,
    },
  }).href
  window.open(url, '_blank')
}
</script>

<template>
  <div class="comic-list size-full flex-1 flex flex-col">
    <div class="flex px py">
      <div class="size-full flex justify-between">
        <div class="text-18px">{{ props.title || '漫画列表' }}</div>
        <el-select v-model="s" class="w-110px!" @change="handleSelectChange">
          <el-option
            v-for="item in sort" :key="item.value" :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <CommonPagination
        ref="CommonPaginationRef" :total="data.total"
        layout="slot, ->, total, prev, pager, next, jumper" :page-size="DEFAULT_PAGE_SIZE" @change="handlePageChange"
      />
    </div>
    <div class="h-full flex-1 overflow-hidden">
      <el-scrollbar height="100%">
        <TransitionGroup
          tag="div" class="card-animation-grid card-grid-custom"
          style="grid-template-columns: repeat(auto-fill, 270px); gap: 20px;" :css="false"
          @before-enter="animation.onBeforeEnter" @enter="animation.onEnter" @leave="animation.onLeave"
          @move="animation.onMove"
        >
          <div
            v-for="item in comics" :key="item._id"
            class="rounded-2 overflow-hidden cursor-pointer p-3 shadow-[--el-box-shadow]"
            @click="handleComicClick(item)"
          >
            <!-- 封面图 -->
            <div class="relative">
              <Image :src="getImageUrl(item.thumb.path)" />
              <el-tooltip
                class="box-item" effect="dark"
                :content="arrayContains(localStore.local.WATCH_LATER_LIST, item._id, '_id') ? '从稍后再看中移除' : '添加到稍后再看'"
                placement="top-start"
              >
                <div
                  v-if="!arrayContains(localStore.local.WATCH_LATER_LIST, item._id, '_id')"
                  class="absolute top-2 right-2 w-30px h-30px bg-[--el-color-info] rounded-1 flex-center"
                  @click.stop="handleAddToLater(item)"
                >
                  <el-icon class="text-[--el-color-white]!">
                    <Timer />
                  </el-icon>
                </div>
                <div
                  v-else class="absolute top-2 right-2 w-30px h-30px bg-[--el-color-info] rounded-1 flex-center"
                  @click.stop="handleRemoveFromLater(item)"
                >
                  <el-icon class="text-[--el-color-white]!">
                    <Minus />
                  </el-icon>
                </div>
              </el-tooltip>
            </div>
            <!-- 标题 -->
            <div class="line-clamp-2 text-16px font-500 mt-2">
              {{ item.title }}
            </div>
            <!-- 章节信息 -->
            <div class="text-13px mt-1 text-[--el-text-color-secondary]">
              <el-text v-if="item.finished" class="mx-1" type="primary">[完结]</el-text> {{ item.epsCount }}章 共 {{
                item.pagesCount }}P
            </div>
            <!-- 作者 -->
            <div class="text-14px text-[--el-text-color-secondary] flex">
              作者:
              <div class="flex-1 flex gap-2 ml-2 flex-wrap">
                <el-popover v-for="author in item.author.split(/[、,，]\s*/)" :key="author" width="70px">
                  <template #reference>
                    <el-link type="primary" underline="always" @click.stop="handleAuthorClick(author)">
                      {{ author
                      }}
                    </el-link>
                  </template>
                  <div class="w-full flex flex-col">
                    <el-button
                      v-if="localStore.local.FOLLOW_AUTHOR_LIST.includes(author)" class="w-full" type="danger"
                      size="default" @click.stop="handleUnfollowAuthor(author)"
                    >
                      取消关注
                    </el-button>
                    <el-button
                      v-else class="w-full" type="primary"
                      size="default"
                      @click.stop="handleFollowAuthor(author)"
                    >
                      关注
                    </el-button>
                  </div>
                </el-popover>
              </div>
            </div>
            <!-- 分类 -->
            <div class="mt-2 flex flex-wrap gap-2">
              <el-tag
                v-for="tag in item.categories" :key="tag" closable
                type="primary" effect="plain"
                @close="handleCloseTag(tag)" @click.stop="handleTagClick(tag)"
              >
                {{ tag }}
              </el-tag>
            </div>
          </div>
        </TransitionGroup>
      </el-scrollbar>
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* 自定义样式可以在这里添加 */
</style>
