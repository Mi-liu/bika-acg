<script setup lang="ts">
import { getCategories, getComics } from '@/api/comic'

const { data: categories } = useRequest(getCategories)


const props = defineProps<{
  title?: string
}>()

console.log(props.title);


const handleCategoryClick = (title: string) => {
  console.log(title)
}

// https://api.manhuabika.com/comics?page=1&s=dd
// https://api.go2778.com/comics?page=1&s=dd
// getComics({
//   page: 1,
//   s: 'dd',
// })

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
