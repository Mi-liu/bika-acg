<script setup lang="ts">
import Image from '@/components/Image/index.vue'
import CommonButton from '@common/components/CommonButton/index.vue'
import { getImageUrl } from '@/utils/string'
import { getComicDetail, favorites, getComicEps } from '@/api/comic'
import { Star, StarFilled } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import { loopRequestList } from '@/utils/fetch'

const router = useRouter()

const props = defineProps<{ id: string }>()

const { data } = useRequest(getComicDetail, {
  defaultParams: [props.id],
})

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
  // 使用新的路由结构: /comic/chapter/:id/:chapter/:maxChapter
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
  <el-scrollbar>
    <div class="max-w-1400px mx-auto">
      <div class="h-400px flex">
        <Image :src="getImageUrl(data?.thumb.path)"></Image>
        <div class="flex-1 flex flex-col justify-between ml overflow-hidden">
          <div class="flex-1 overflow-hidden flex flex-col">
            <!-- 标题和基本信息区域 -->
            <div>
              <!-- 标题 -->
              <div class="text-26px">
                {{ data?.title }}
              </div>

              <!-- 作者 -->
              <div class="text-20px text-[--el-text-color-secondary] flex mt">
                作者:
                <div class="flex-1 flex gap-2 ml-2 flex-wrap">
                  <el-link class="text-20px!" type="primary" underline="always"
                    v-for="author in data?.author.split(/[、,，]\s*/)" @click.stop="handleAuthorClick(author)">{{ author
                    }}</el-link>
                </div>
              </div>
              <!-- 章节信息 -->
              <div class="text-20px mt-1 text-[--el-text-color-secondary]">
                <el-text class="mx-1 text-20px!" type="primary" v-if="data?.finished">[完结]</el-text> 共 {{ data?.epsCount
                }}P
              </div>
              <!-- 分类 -->
              <div class="mt-2 flex flex-wrap gap-2">
                分类:
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
            <div class="flex-1 min-h-0 mt-2 flex flex-col mt">
              <el-scrollbar class="h-full w-full text-[--el-text-color-secondary]">
                <div class="whitespace-pre-wrap break-words">{{ data?.description }}</div>
              </el-scrollbar>
            </div>
          </div>
          <div class="flex mt">
            <el-button type="primary" @click="handleEpsClick(0)">开始阅读</el-button>
            <CommonButton v-if="data?.isFavourite" @click="handleFavoritesClick">
              取消收藏
              <el-icon size="18" color="var(--el-color-warning-light-3)">
                <StarFilled></StarFilled>
              </el-icon>
            </CommonButton>
            <CommonButton @click="handleFavoritesClick" v-else>
              收藏本子
              <el-icon>
                <Star></Star>
              </el-icon>
            </CommonButton>

            <div class="ml-auto">
              {{ dayjs.utc(data?.updated_at).format('YYYY-MM-DD HH:mm:ss') }} 更新
            </div>
          </div>
        </div>
      </div>

      <!-- 章节信息 -->
      <div class="mt flex flex-wrap gap-10px">
        <el-button class="ml-0!" v-for="(item, index) in epsData.docs.toReversed()" @click="handleEpsClick(index)">
          {{ item.title }}
        </el-button>
      </div>

    </div>
  </el-scrollbar>
</template>

<style lang="scss" scoped></style>
