<script setup lang="ts">
import ComicList from '@/components/ComicList/index.vue'
import { getUserFavourite } from '@/api/user'

</script>

<template>
  <div>
    <ComicList title="我的收藏" :params="{}" :fetch="getUserFavourite"></ComicList>
  </div>
</template>

<style scoped></style>
