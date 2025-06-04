<script setup lang="ts">

</script>

<template>
  <main class="layout-main flex-1 bg-[--el-bg-color] overflow-hidden">
    <router-view v-slot="{ Component }">
      <transition>
        <!-- <keep-alive> -->
        <component :is="Component" class="size-full" />
        <!-- </keep-alive> -->
      </transition>
    </router-view>
  </main>
</template>

<style lang="scss" scoped></style>
