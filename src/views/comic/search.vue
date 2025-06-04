<script setup lang="ts">
import { searchComics } from '@/api/comic'
import ComicList from '@/components/ComicList/index.vue'

const props = defineProps<{
  /** 搜索的关键词 */
  keyword: string
}>()
</script>

<template>
  <div>
    <ComicList :title="`搜索结果: ${props.keyword}`" :params="{ keyword: props.keyword }" :fetch="searchComics" />
  </div>
</template>

<style scoped></style>
