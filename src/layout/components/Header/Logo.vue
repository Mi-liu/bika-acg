<script setup lang="ts">
import router from '@/router'

function handleLogoClick() {
  router.push('/')
}
</script>

<template>
  <img
    class="h-40px cursor-pointer" src="@/assets/image/app/logo.png" alt="Logo"
    @click="handleLogoClick"
  >
</template>

<style lang="scss" scoped></style>
