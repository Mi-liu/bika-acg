<script setup lang="ts">
import Image from '@/components/Image/index.vue'
import CommonButton from '@common/components/CommonButton/index.vue'
import { getImageUrl } from '@/utils/string'
import { getComicDetail, favorites, getComicEps } from '@/api/comic'
import { Star, StarFilled, Reading } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import { loopRequestList } from '@/utils/fetch'
import type { ComicDetail } from '@/api/comic'

const router = useRouter()

const props = defineProps<{ id: string }>()

const { data } = useRequest(getComicDetail, {
  defaultParams: [props.id],
})

const toolList = <const>[
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
]


const { data: epsData } = loopRequestList((page) => getComicEps(props.id, page), {
  key: 'docs',
  beforeRequest: (page, res) => {
    if (res === undefined) {
      return true
    }
    return page <= res.pages
  },
})

function handleAuthorClick(author: string) {
  console.log('作者的点击', author);
}

function handleTagClick(tag: string) {
  const url = router.resolve({
    path: '/comic/list',
    query: {
      title: tag
    }
  }).href
  window.open(url, '_blank');
}

function handleFavoritesClick() {
  if (data.value === undefined) return
  return favorites(data.value._id)
    .then(res => {
      if (res === 'favourite') {
        data.value!.isFavourite = true
      } else if (res === 'un_favourite') {
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
      maxChapter: maxChapter
    }
  }).href
  window.open(url, '_blank');
}
</script>

<template>
  <el-scrollbar class="bg-[--el-bg-color-page]">
    <div class="max-w-1400px mx-auto">
      <div class="h-400px flex p4 rounded-2 bg-[--el-color-white] shadow-[--el-box-shadow-light]">
        <Image :src="getImageUrl(data?.thumb.path!)"></Image>
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

              <!-- 作者 -->
              <!-- <div class="text-20px text-[--el-text-color-secondary] flex mt">
                作者:
                <div class="flex-1 flex gap-2 ml-2 flex-wrap">
                  <el-link class="text-20px!" type="primary" underline="always"
                    v-for="author in data?.author.split(/[、,，]\s*/)" @click.stop="handleAuthorClick(author)">{{ author
                    }}</el-link>
                </div>
              </div> -->
              <!-- 分类 -->
              <div class="mt-2 flex flex-wrap gap-2">
                <el-tag class="cursor-pointer" v-for="tag in data?.categories" :key="tag" type="primary" effect="plain"
                  @click="handleTagClick(tag)">
                  {{ tag }}
                </el-tag>
              </div>
              <!-- 标签 -->
              <div class="flex gap-10px cursor-pointer mt">
                <el-tag v-for="item in data?.tags">
                  {{ item }}
                </el-tag>
              </div>
            </div>

            <!-- 滚动区域 - 使用flex-1自动撑开 -->
            <!-- <div class="flex-1 min-h-0 mt-2 flex flex-col mt">
              <el-scrollbar class="h-full w-full text-[--el-text-color-secondary]">
                <div class="whitespace-pre-wrap break-words">{{ data?.description }}</div>
              </el-scrollbar>
            </div> -->
          </div>
          <div class="flex mt">
            <el-button type="primary" :icon="Reading" @click="handleEpsClick(0)">开始阅读</el-button>
            <CommonButton v-if="data?.isFavourite" @click="handleFavoritesClick">
              <el-icon class="mr-1" size="18" color="var(--el-color-warning-light-3)">
                <StarFilled></StarFilled>
              </el-icon>
              取消收藏
            </CommonButton>
            <CommonButton @click="handleFavoritesClick" v-else>
              <el-icon class="mr-1">
                <Star></Star>
              </el-icon>
              收藏漫画
            </CommonButton>

            <div class="ml-auto">
              作者
            </div>
          </div>
        </div>
      </div>

      <!-- 统计 -->
      <div class="h-90px flex mt-4 rounded-2 bg-[--el-color-white] shadow-[--el-box-shadow-light]">
        <div class="flex-1 flex flex-col items-center justify-center" v-for="item in toolList" :key="item.prop">
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
        <div class="text-18px font-bold">作品简介</div>
        <div class="mt2 text-[--el-text-color-secondary] whitespace-pre-wrap break-words">{{ data?.description }}</div>
      </div>

      <!-- 章节信息 -->
      <div class="p4 mt-4  rounded-2 bg-[--el-color-white] shadow-[--el-box-shadow-light]">
        <div class="text-18px font-bold">章节列表</div>
        <div class="mt3 flex flex-wrap gap-10px">
          <el-button class="ml-0!" v-for="(item, index) in epsData.docs.toReversed()" @click="handleEpsClick(index)">
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
