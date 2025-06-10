<script setup lang="ts">
import CommonButton from '@common/components/CommonButton/index.vue'
import { Document, Memo, Reading, Star, StarFilled } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import { favorites, getComicDetail, getComicEps, getComicRecommendation } from '@/api/comic'
import Image from '@/components/Image/index.vue'
import { loopRequestList } from '@/utils/fetch'
import { getImageUrl } from '@/utils/string'

const props = defineProps<{ id: string }>()

const router = useRouter()

const localStore = useLocalStoreHook()

const { data, loading } = useRequest(getComicDetail, {
  defaultParams: [props.id],
})

const { data: recommendationData, loading: recommendationLoading } = useRequest(getComicRecommendation, {
  defaultParams: [props.id],
})

watch(data, (newVal) => {
  if (newVal) {
    localStore.removeItem('WATCH_LATER_LIST', newVal, '_id')
  }
})

const toolList = [
  {
    label: '点赞',
    prop: 'totalLikes',
  },
  {
    label: '阅读',
    prop: 'totalViews',
  },
  {
    label: '评论',
    prop: 'totalComments',
  },
] as const

const { data: epsData } = loopRequestList(page => getComicEps(props.id, page), {
  key: 'docs',
  beforeRequest: (page, res) => {
    if (res === undefined) {
      return true
    }
    return page <= res.pages
  },
})

// 关注状态管理
const isFollowingAuthor = ref(false)

/**
 * 处理作者点击事件
 * @param author 作者名称
 */
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

function handleTagClick(tag: string) {
  const url = router.resolve({
    path: '/comic/list',
    query: {
      title: tag,
    },
  }).href
  window.open(url, '_blank')
}

function handleFavoritesClick() {
  if (data.value === undefined)
    return
  return favorites(data.value._id)
    .then((res) => {
      if (res === 'favourite') {
        data.value!.isFavourite = true
      }
      else if (res === 'un_favourite') {
        data.value!.isFavourite = false
      }
    })
}

function handleEpsClick(index: number) {
  const chapterNum = index + 1
  const maxChapter = epsData.value.docs.length
  const url = router.resolve({
    path: `/comic/chapter/${props.id}`,
    query: {
      chapter: chapterNum,
      maxChapter,
    },
  }).href
  window.open(url, '_blank')
}

/**
 * 处理推荐漫画点击事件
 * @param comicId 漫画ID
 */
function handleRecommendationClick(comicId: string) {
  const url = router.resolve(`/comic/detail/${comicId}`).href
  window.open(url, '_blank')
}
</script>

<template>
  <el-scrollbar class="bg-[--el-bg-color-page] ">
    <div class="max-w-1100px mx-auto px-2">
      <!-- 主要信息区域 -->
      <div class="h-400px flex p4 rounded-2 bg-[--el-color-white] shadow-[--el-box-shadow-light]">
        <!-- 骨架屏 -->
        <el-skeleton v-if="loading" class="size-full" :loading="true">
          <template #template>
            <div class="flex size-full">
              <!-- 封面图骨架 -->
              <div class="w-280px h-full">
                <el-skeleton-item class="size-full!" variant="image" />
              </div>
              <!-- 信息区域骨架 -->
              <div class="flex-1 flex flex-col justify-between ml-4">
                <div class="flex-1 flex flex-col space-y-4">
                  <!-- 标题骨架 -->
                  <el-skeleton-item variant="h1" class="w-80%!" />

                  <!-- 标签骨架 -->
                  <div class="flex gap-2">
                    <el-skeleton-item variant="button" class="w-60px! h-24px!" />
                    <el-skeleton-item variant="button" class="w-80px! h-24px!" />
                    <el-skeleton-item variant="button" class="w-70px! h-24px!" />
                    <el-skeleton-item variant="button" class="w-120px! h-24px!" />
                  </div>

                  <!-- 分类标签骨架 -->
                  <div class="flex flex-wrap gap-2">
                    <el-skeleton-item variant="button" class="w-50px! h-24px!" />
                    <el-skeleton-item variant="button" class="w-60px! h-24px!" />
                    <el-skeleton-item variant="button" class="w-40px! h-24px!" />
                    <el-skeleton-item variant="button" class="w-70px! h-24px!" />
                  </div>

                  <!-- 标签骨架 -->
                  <div class="flex flex-wrap gap-2">
                    <el-skeleton-item variant="button" class="w-45px! h-24px!" />
                    <el-skeleton-item variant="button" class="w-55px! h-24px!" />
                    <el-skeleton-item variant="button" class="w-65px! h-24px!" />
                  </div>
                </div>

                <!-- 按钮区域骨架 -->
                <div class="flex justify-between items-center">
                  <div class="flex gap-2">
                    <el-skeleton-item variant="button" class="w-100px! h-32px!" />
                    <el-skeleton-item variant="button" class="w-100px! h-32px!" />
                  </div>
                  <div class="flex gap-2">
                    <el-skeleton-item variant="text" class="w-60px! h-20px!" />
                    <el-skeleton-item variant="text" class="w-60px! h-20px!" />
                  </div>
                </div>
              </div>
            </div>
          </template>
        </el-skeleton>

        <!-- 实际内容 -->
        <template v-else>
          <Image :src="getImageUrl(data?.thumb.path!)" />
          <div class="flex-1 flex flex-col justify-between ml overflow-hidden">
            <div class="flex-1 overflow-hidden flex flex-col">
              <!-- 标题和基本信息区域 -->
              <div class="flex flex-col space-y-3">
                <!-- 标题 -->
                <div class="text-26px">
                  {{ data?.title }}
                </div>

                <div class="flex gap-2">
                  <el-tag type="info" round>{{ data?.epsCount }}章</el-tag>
                  <el-tag type="info" round>{{ data?.pagesCount }}P</el-tag>
                  <el-tag type="info" round>{{ data?.finished ? '已完结' : '连载中' }}</el-tag>
                  <el-tag type="info" round>{{ dayjs.utc(data?.updated_at).format('YYYY-MM-DD HH:mm:ss') }} 更新</el-tag>
                </div>

                <!-- 分类 -->
                <div class="mt-2 flex flex-wrap gap-2">
                  <el-tag
                    v-for="tag in data?.categories" :key="tag" class="cursor-pointer"
                    type="primary" effect="plain"
                    @click="handleTagClick(tag)"
                  >
                    {{ tag }}
                  </el-tag>
                </div>
                <!-- 标签 -->
                <div class="flex flex-wrap gap-10px cursor-pointer mt">
                  <el-tag v-for="item in data?.tags" :key="item">
                    {{ item }}
                  </el-tag>
                </div>
              </div>
            </div>
            <div class="flex mt">
              <el-button type="primary" :icon="Reading" @click="handleEpsClick(0)">开始阅读</el-button>
              <CommonButton v-if="data?.isFavourite" @click="handleFavoritesClick">
                <el-icon class="mr-1" size="18" color="var(--el-color-warning-light-3)">
                  <StarFilled />
                </el-icon>
                取消收藏
              </CommonButton>
              <CommonButton v-else @click="handleFavoritesClick">
                <el-icon class="mr-1">
                  <Star />
                </el-icon>
                收藏漫画
              </CommonButton>

              <div class="ml-auto flex items-center gap-2">
                <el-popover v-for="author in data?.author.split(/[、,，]\s*/)" :key="author" width="70px">
                  <template #reference>
                    <el-link type="primary" underline="always" @click.stop="handleAuthorClick(author)">
                      {{ author
                      }}
                    </el-link>
                  </template>
                  <div class="w-full flex flex-col">
                    <el-button
                      v-if="localStore.local.FOLLOW_AUTHOR_LIST.includes(author)" class="w-full" type="danger"
                      size="default"
                      @click.stop="handleUnfollowAuthor(author)"
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
          </div>
        </template>
      </div>

      <!-- 统计 -->
      <div class="h-90px flex mt-4 rounded-2 bg-[--el-color-white] shadow-[--el-box-shadow-light]">
        <!-- 统计区域骨架屏 -->
        <el-skeleton v-if="loading" class="size-full p-4" :loading="true">
          <template #template>
            <div class="flex h-full">
              <div v-for="i in 3" :key="i" class="flex-1 flex flex-col items-center justify-center gap-2">
                <el-skeleton-item variant="h3" class="w-60px! h-32px!" />
                <el-skeleton-item variant="text" class="w-40px! h-16px!" />
              </div>
            </div>
          </template>
        </el-skeleton>

        <!-- 实际统计内容 -->
        <template v-else>
          <div v-for="item in toolList" :key="item.prop" class="flex-1 flex flex-col items-center justify-center">
            <div>
              <el-statistic :value="data?.[item.prop]" />
            </div>
            <div>{{ item.label }}</div>
          </div>
        </template>
      </div>

      <!-- 简介 -->
      <div class="p4 mt-4 rounded-2 bg-[--el-color-white] shadow-[--el-box-shadow-light]">
        <!-- 简介区域骨架屏 -->
        <el-skeleton v-if="loading" class="size-full" :loading="true">
          <template #template>
            <div class="space-y-3">
              <!-- 标题骨架 -->
              <div class="flex items-center gap-1">
                <el-skeleton-item variant="circle" class="w-18px! h-18px!" />
                <el-skeleton-item variant="h3" class="w-80px! h-18px!" />
              </div>
              <!-- 内容骨架 -->
              <div class="space-y-2">
                <el-skeleton-item variant="text" class="w-full!" />
                <el-skeleton-item variant="text" class="w-90%!" />
                <el-skeleton-item variant="text" class="w-85%!" />
                <el-skeleton-item variant="text" class="w-70%!" />
              </div>
            </div>
          </template>
        </el-skeleton>

        <!-- 实际简介内容 -->
        <template v-else>
          <div class="flex items-center gap-1 text-18px font-bold">
            <el-icon>
              <Document />
            </el-icon>
            作品简介
          </div>
          <div class="mt2 text-[--el-text-color-secondary] whitespace-pre-wrap break-words">{{ data?.description }}</div>
        </template>
      </div>

      <!-- 章节信息 -->
      <div class="p4 mt-4  rounded-2 bg-[--el-color-white] shadow-[--el-box-shadow-light]">
        <!-- 章节列表区域骨架屏 -->
        <el-skeleton v-if="loading || epsData.docs.length === 0" class="size-full" :loading="true">
          <template #template>
            <div class="space-y-3">
              <!-- 标题骨架 -->
              <div class="flex items-center gap-1">
                <el-skeleton-item variant="circle" class="w-18px! h-18px!" />
                <el-skeleton-item variant="h3" class="w-80px! h-18px!" />
              </div>
              <!-- 章节按钮骨架 -->
              <div class="flex flex-wrap gap-2">
                <el-skeleton-item
                  v-for="i in 12" :key="i" variant="button"
                  class="w-80px! h-32px!"
                />
              </div>
            </div>
          </template>
        </el-skeleton>

        <!-- 实际章节内容 -->
        <template v-else>
          <div class="flex items-center gap-1 text-18px font-bold">
            <el-icon>
              <Memo />
            </el-icon>
            章节列表
          </div>
          <div class="mt3 flex flex-wrap gap-10px">
            <el-button
              v-for="(item, index) in epsData.docs.toReversed()" :key="item.id || index" class="ml-0!"
              @click="handleEpsClick(index)"
            >
              {{ item.title }}
            </el-button>
          </div>
        </template>
      </div>

      <!-- 相关推荐 -->
      <div class="p4 mt-4 rounded-2 bg-[--el-color-white] shadow-[--el-box-shadow-light]">
        <div class="flex items-center gap-1 text-18px font-bold mb-4">
          <el-icon>
            <Star />
          </el-icon>
          相关推荐
        </div>

        <!-- 推荐列表骨架屏 -->
        <div v-if="recommendationLoading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <el-skeleton
            v-for="i in 10" :key="i" class="rounded-2 overflow-hidden"
            :loading="true"
          >
            <template #template>
              <div class="space-y-2">
                <!-- 封面图骨架 -->
                <div class="w-full aspect-3/4">
                  <el-skeleton-item class="size-full!" variant="image" />
                </div>
                <!-- 标题骨架 -->
                <el-skeleton-item variant="h3" class="w-full! h-16px!" />
                <el-skeleton-item variant="text" class="w-80%! h-14px!" />
              </div>
            </template>
          </el-skeleton>
        </div>

        <!-- 推荐列表内容 -->
        <div v-else-if="recommendationData && recommendationData.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <div
            v-for="comic in recommendationData" :key="comic._id"
            class="group cursor-pointer rounded-2 overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105"
            @click="handleRecommendationClick(comic._id)"
          >
            <!-- 封面图 -->
            <div class="relative w-full aspect-3/4 overflow-hidden rounded-2">
              <Image
                :src="getImageUrl(comic.thumb.path)"
                :alt="comic.title"
                class="size-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <!-- 悬停遮罩 -->
              <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                <div class="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm font-medium">
                  点击查看
                </div>
              </div>
            </div>

            <!-- 标题 -->
            <div class="mt-2 px-1">
              <h3 class="text-14px font-medium line-clamp-2 text-[--el-text-color-primary] group-hover:text-[--el-color-primary] transition-colors duration-300">
                {{ comic.title }}
              </h3>
            </div>
          </div>
        </div>

        <!-- 无推荐内容 -->
        <div v-else class="text-center py-8 text-[--el-text-color-secondary]">
          <el-icon class="text-48px mb-2">
            <Star />
          </el-icon>
          <div>暂无相关推荐</div>
        </div>
      </div>
    </div>
  </el-scrollbar>
</template>

<style lang="scss" scoped>
.el-statistic {
  :deep(.el-statistic__number) {
    font-size: 24px !important;
    font-weight: bold !important;
    color: var(--el-color-primary) !important;
  }
}
</style>
