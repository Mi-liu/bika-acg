<script setup lang="ts">
import { Refresh } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { getCategories, getRandomComic } from '@/api/comic'
import Image from '@/components/Image/index.vue'
import { getImageUrl } from '@/utils/string'

const router = useRouter()

const { data: categories } = useRequest(getCategories)

const { data: randomComics, run: handleRandomRefresh } = useRequest(getRandomComic)

function handleCategoryClick(title: string) {
  const url = router.resolve({
    path: '/comic/list',
    query: {
      title,
    },
  }).href
  window.open(url, '_blank')
}

function handleComicClick(id: string) {
  const to = router.resolve({
    path: `/comic/detail/${id}`,
  })
  window.open(to.href, '_blank')
}
</script>

<template>
  <el-scrollbar>
    <div class="content w-full max-w-1600px mx-auto">
      <div class="category-list">
        <div v-for="category in categories" :key="category.title" class="category-item">
          <el-button class="w-full" plain @click="handleCategoryClick(category.title)">
            {{ category.title }}
          </el-button>
        </div>
      </div>
      <div>
        <div class="flex items-center justify-between mt-3">
          <div>随机漫画</div>
          <el-button :icon="Refresh" @click="handleRandomRefresh">
            换一批
          </el-button>
        </div>
        <div class="random-comic-list mt-2">
          <div
            v-for="comic in randomComics" :key="comic._id"
            class="random-comic-item cursor-pointer" @click="handleComicClick(comic._id)"
          >
            <Image :src="getImageUrl(comic.thumb.path)" />
            <div class="random-comic-item-title line-clamp-2">
              {{ comic.title }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-scrollbar>
</template>

<style scoped lang="scss">
.content {
  .category-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 10px;
  }

  .random-comic-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px 10px;
  }
}
</style>
