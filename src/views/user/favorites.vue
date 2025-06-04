<script setup lang="ts">
import { getUserFavourite } from '@/api/user'
import ComicList from '@/components/ComicList/index.vue'
</script>

<template>
  <div>
    <ComicList
      title="我的收藏" :params="{}" :fetch="getUserFavourite"
      :is-blocked-categories="false"
    />
  </div>
</template>

<style scoped></style>
