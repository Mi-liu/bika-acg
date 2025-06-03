<script setup lang="ts">
import ComicList from '@/components/ComicList/index.vue'
import { searchComics } from '@/api/comic'

const props = defineProps<{
  /** 搜索的关键词 */
  keyword: string
}>()
</script>

<template>
  <div>
    <ComicList :title="`搜索结果: ${props.keyword}`" :params="{ keyword: props.keyword }" :fetch="searchComics"></ComicList>
  </div>
</template>

<style scoped></style>
