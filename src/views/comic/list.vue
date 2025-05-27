<script setup lang="ts">
import ComicList from '@/components/ComicList/index.vue'
import { getComics } from '@/api/comic'

const props = defineProps<{
  title: string
}>()
</script>

<template>
  <div>
    <ComicList :title="props.title" :fetch="getComics"></ComicList>
  </div>
</template>

<style scoped></style>
