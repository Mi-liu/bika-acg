<script setup lang="ts">
import router from '@/router'

function handleLogoClick() {
  router.push('/')
}
</script>

<template>
  <div class="select-none cursor-pointer text-18px" @click="handleLogoClick">
    哔咔漫画
  </div>
</template>

<style lang="scss" scoped></style>
