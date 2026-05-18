<script setup lang="ts">
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const backStack = ref<string[]>([])
const forwardStack = ref<string[]>([])
const pendingHistoryNavigation = ref(false)

const canGoBack = computed(() => backStack.value.length > 0)
const canGoForward = computed(() => forwardStack.value.length > 0)

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

watch(
  () => route.fullPath,
  (to, from) => {
    if (!from || to === from) {
      return
    }

    if (pendingHistoryNavigation.value) {
      pendingHistoryNavigation.value = false
      return
    }

    backStack.value.push(from)
    forwardStack.value = []
  },
)

async function goBack() {
  if (!canGoBack.value) {
    return
  }

  const from = route.fullPath
  const target = backStack.value.at(-1)
  if (!target) {
    return
  }

  pendingHistoryNavigation.value = true
  await router.push(target)
  backStack.value.pop()
  forwardStack.value.push(from)
}

async function goForward() {
  if (!canGoForward.value) {
    return
  }

  const from = route.fullPath
  const target = forwardStack.value.at(-1)
  if (!target) {
    return
  }

  pendingHistoryNavigation.value = true
  await router.push(target)
  forwardStack.value.pop()
  backStack.value.push(from)
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
