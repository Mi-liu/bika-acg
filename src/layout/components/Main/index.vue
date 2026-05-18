<script setup lang="ts">
import type { RouteLocationNormalizedLoaded } from 'vue-router'

const routeCacheStateKey = '__picAgeRouteCacheKey'
let routeCacheKeySeed = 0

function createRouteCacheEntryId() {
  routeCacheKeySeed += 1
  return `${Date.now()}-${routeCacheKeySeed}`
}

function getRouteCacheKey(route: RouteLocationNormalizedLoaded) {
  const state = window.history.state as Record<string, unknown> | null
  const existingEntryId = state?.[routeCacheStateKey]

  if (typeof existingEntryId === 'string') {
    return `${route.fullPath}:${existingEntryId}`
  }

  const entryId = createRouteCacheEntryId()
  window.history.replaceState(
    {
      ...state,
      [routeCacheStateKey]: entryId,
    },
    '',
  )

  return `${route.fullPath}:${entryId}`
}
</script>

<template>
  <main class="layout-main flex-1 bg-[--el-bg-color] overflow-hidden rounded-2 p-2">
    <router-view v-if="!false" v-slot="{ Component, route }">
      <transition>
        <keep-alive :max="30">
          <component :is="Component" :key="getRouteCacheKey(route)" class="size-full" />
        </keep-alive>
      </transition>
    </router-view>
  </main>
</template>

<style lang="scss" scoped></style>
