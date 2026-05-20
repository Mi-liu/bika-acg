<script setup lang="ts">
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const canGoBack = ref(false)
const canGoForward = ref(false)

function syncHistoryState() {
  const state = window.history.state as Record<string, unknown> | null

  canGoBack.value = typeof state?.back === 'string'
  canGoForward.value = typeof state?.forward === 'string'
}

const breadcrumbs = computed(() => {
  const matched = route.matched
    .filter(record => record.meta?.title)

  return matched.map((record, index) => {
    const isLast = index === matched.length - 1
    const title = isLast && typeof route.query.title === 'string' && route.query.title
      ? route.query.title
      : String(record.meta?.title || record.name || record.path)

    return {
      title,
      to: isLast ? undefined : record.path,
    }
  })
})

watch(() => route.fullPath, () => nextTick(syncHistoryState), { immediate: true })

function goBack() {
  if (!canGoBack.value) {
    return
  }

  router.go(-1)
}

function goForward() {
  if (!canGoForward.value) {
    return
  }

  router.go(1)
}
</script>

<template>
  <nav
    v-if="breadcrumbs.length > 0"
    aria-label="Breadcrumb"
    class="layout-breadcrumb flex-none flex items-center gap-3 px-4 py-2 bg-[--el-bg-color] rounded-2"
  >
    <div class="flex items-center gap-1">
      <el-button
        :icon="ArrowLeft"
        :disabled="!canGoBack"
        circle
        size="small"
        aria-label="后退"
        @click="goBack"
      />
      <el-button
        :icon="ArrowRight"
        :disabled="!canGoForward"
        circle
        size="small"
        aria-label="前进"
        @click="goForward"
      />
    </div>

    <el-breadcrumb separator="/" class="min-w-0">
      <el-breadcrumb-item
        v-for="item in breadcrumbs"
        :key="`${item.to || 'current'}-${item.title}`"
        :to="item.to"
      >
        {{ item.title }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </nav>
</template>

<style lang="scss" scoped></style>
