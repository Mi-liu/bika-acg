<script setup lang="ts">
import { getComics } from '@/api/comic'
import ComicList from '@/components/ComicList/index.vue'

const props = defineProps<{
  /** 标题 */
  title?: string
  /** 作者 */
  author?: string
  /** 都在搜索的关键词 */
  keywords?: string
}>()

const listTitle = computed(() => {
  if (props.title) {
    return props.title
  }
  else if (props.author) {
    return `作者：${props.author}`
  }
  else if (props.keywords) {
    return `关键词：${props.keywords}`
  }
  return '漫画列表'
})
</script>

<template>
  <div>
    <ComicList
      :title="listTitle" :params="{
        c: props.title ? encodeURIComponent(props.title) : undefined,
        a: props.author ? encodeURIComponent(props.author) : undefined,
        t: props.keywords ? encodeURIComponent(props.keywords) : undefined,
      }" :fetch="getComics"
    />
  </div>
</template>

<style scoped></style>
