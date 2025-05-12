<script setup lang="ts">
import { getCategories, getComics } from '@/api/comic'
import { useRouter } from 'vue-router'

const router = useRouter()

const { data: categories } = useRequest(getCategories)

const handleCategoryClick = (title: string) => {
  router.push({
    path: '/list',
    query: {
      title: title
    }
  })
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

    .category-item {}
  }

}
</style>
