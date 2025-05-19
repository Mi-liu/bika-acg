<script setup lang="ts">

</script>

<template>
  <main class="layout-main flex-1 bg-[--el-bg-color] overflow-hidden">
    <router-view v-slot="{ Component }">
      <transition>
        <!-- <keep-alive> -->
        <component class="size-full" :is="Component" />
        <!-- </keep-alive> -->
      </transition>
    </router-view>
  </main>
</template>

<style lang="scss" scoped></style>
