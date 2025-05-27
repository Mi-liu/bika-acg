<script setup lang="ts">
import { getCategories } from '@/api/comic'
import { useRouter } from 'vue-router'

const router = useRouter()

const { data: categories } = useRequest(getCategories)

const handleCategoryClick = (title: string) => {
  const url = router.resolve({
    path: '/comic/list',
    query: {
      title: title
    }
  }).href
  window.open(url, '_blank')
}
</script>

<template>
  <div class="home-container">
    <div class="category-list">
      <div class="category-item" v-for="category in categories" :key="category.title">
        <el-button class="w-full" plain @click="handleCategoryClick(category.title)">
          {{ category.title }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.home-container {
  .category-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, 100px);
    gap: 10px;
  }
}
</style>
