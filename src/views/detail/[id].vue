<script setup lang="ts">
import Image from '@/components/Image/index.vue'
import CommonButton from '@common/components/CommonButton/index.vue'
import { getImageUrl } from '@/utils/string'
import { getComicDetail, favorites } from '@/api/comic'
import { Star, StarFilled } from '@element-plus/icons-vue'
import dayjs from 'dayjs'

const router = useRouter()

const props = defineProps<{ id: string }>()


const { data } = useRequest(getComicDetail, {
  defaultParams: [props.id],
})

function handelAuthorClick(author: string) {
  console.log('作者的点击', author);
}

function handelTagClick(tag: string) {
  const url = router.resolve({
    path: '/list',
    query: {
      title: tag
    }
  }).href
  window.open(url, '_blank');
}

function handelFavoritesClick() {
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

</script>

<template>
  <el-scrollbar>
    <div class="max-w-1400px mx-auto">

      <div class="h-400px flex">
        <Image :src="getImageUrl(data?.thumb.path)"></Image>
        <div class="flex-1 flex flex-col justify-between ml">
          <div class="flex-1 overflow-hidden flex flex-col">
            <!-- 标题和基本信息区域 -->
            <div>
              <!-- 标题 -->
              <div class="text-26px">
                {{ data?.title }}
              </div>
              <!-- 章节信息 -->
              <div class="text-20px mt-1 text-[--el-text-color-secondary]">
                <el-text class="mx-1 text-20px!" type="primary" v-if="data?.finished">[完结]</el-text> 共 {{ data?.epsCount
                }}P
              </div>
              <!-- 作者 -->
              <div class="text-20px text-[--el-text-color-secondary] flex">
                作者:
                <div class="flex-1 flex gap-2 ml-2 flex-wrap">
                  <el-link class="text-20px!" type="primary" underline="always"
                    v-for="author in data?.author.split(/[、,，]\s*/)" @click.stop="handelAuthorClick(author)">{{ author
                    }}</el-link>
                </div>
              </div>
              <!-- 分类 -->
              <div class="mt-2 flex flex-wrap gap-2">
                分类:
                <el-tag class="cursor-pointer" v-for="tag in data?.categories" :key="tag" type="primary" effect="plain"
                  @click="handelTagClick(tag)">
                  {{ tag }}
                </el-tag>
              </div>
              <!-- 标签 -->
              <div class="flex gap-10px cursor-pointer">
                <el-tag v-for="item in data?.tags">
                  {{ item }}
                </el-tag>
              </div>
            </div>

            <!-- 滚动区域 - 使用flex-1自动撑开 -->
            <div class="flex-1 min-h-0 mt-2 flex flex-col">
              <el-scrollbar class="h-full whitespace-pre text-[--el-text-color-secondary]">
                {{ data?.description }}
              </el-scrollbar>
            </div>
          </div>
          <div class="flex">
            <el-button type="primary">开始阅读</el-button>
            <CommonButton v-if="data?.isFavourite" @click="handelFavoritesClick">
              取消收藏
              <el-icon size="18" color="var(--el-color-warning-light-3)">
                <StarFilled></StarFilled>
              </el-icon>
            </CommonButton>
            <CommonButton @click="handelFavoritesClick" v-else>
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


    </div>
  </el-scrollbar>

</template>

<style lang="scss" scoped></style>
