<script setup lang="ts">
import ComicList from '@/components/ComicList/index.vue'
import { getComics } from '@/api/comic'

const props = defineProps<{
  /** 标题 */
  title?: string
  /** 作者 */
  author?: string
}>()
</script>

<template>
  <div>
    <ComicList :title="props.title" :author="props.author" :fetch="getComics"></ComicList>
  </div>
</template>

<style scoped></style>
