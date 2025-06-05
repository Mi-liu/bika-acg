<script setup lang="ts">
import CommonButton from '@common/components/CommonButton/index.vue'
import { Document, Memo, Reading, Star, StarFilled } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import { favorites, getComicDetail, getComicEps } from '@/api/comic'
import Image from '@/components/Image/index.vue'
import { loopRequestList } from '@/utils/fetch'
import { getImageUrl } from '@/utils/string'

const props = defineProps<{ id: string }>()

const router = useRouter()

const localStore = useLocalStoreHook()

const { data } = useRequest(getComicDetail, {
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
</script>

<template>
  <el-scrollbar class="bg-[--el-bg-color-page]">
    <div class="max-w-1100px mx-auto">
      <div class="h-400px flex p4 rounded-2 bg-[--el-color-white] shadow-[--el-box-shadow-light]">
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
      </div>

      <!-- 统计 -->
      <div class="h-90px flex mt-4 rounded-2 bg-[--el-color-white] shadow-[--el-box-shadow-light]">
        <div v-for="item in toolList" :key="item.prop" class="flex-1 flex flex-col items-center justify-center">
          <div>
            <el-statistic :value="data?.[item.prop]" />
          </div>
          <div>{{ item.label }}</div>
        </div>
        <!-- <div class="flex-1 flex flex-col items-center justify-center">
          爱心
        </div> -->
      </div>

      <!-- 简介 -->
      <div class="p4 mt-4 rounded-2 bg-[--el-color-white] shadow-[--el-box-shadow-light]">
        <div class="flex items-center gap-1 text-18px font-bold">
          <el-icon>
            <Document />
          </el-icon>
          作品简介
        </div>
        <div class="mt2 text-[--el-text-color-secondary] whitespace-pre-wrap break-words">{{ data?.description }}</div>
      </div>

      <!-- 章节信息 -->
      <div class="p4 mt-4  rounded-2 bg-[--el-color-white] shadow-[--el-box-shadow-light]">
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
