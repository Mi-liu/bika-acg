<script setup lang="ts">
import type { RouteLocationNormalizedLoaded } from 'vue-router'

const layoutStore = useLayoutStoreHook()
const keepAliveMax = computed(() => Math.max(30, layoutStore.pageTabs.length))

function getRouteCacheKey(route: RouteLocationNormalizedLoaded) {
  return route.fullPath
}
</script>

<template>
  <main class="layout-main flex-1 bg-[--el-bg-color] overflow-hidden rounded-2 p-2">
    <router-view v-if="!false" v-slot="{ Component, route }">
      <transition>
        <keep-alive :max="keepAliveMax">
          <component :is="Component" :key="getRouteCacheKey(route)" class="size-full" />
        </keep-alive>
      </transition>
    </router-view>
  </main>
</template>

<style lang="scss" scoped></style>
