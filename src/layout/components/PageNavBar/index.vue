<script setup lang="ts">
import type { RouteLocationNormalizedLoaded } from 'vue-router'

interface PageNavTabItem {
  title: string
  baseTitle?: string
  subtitle?: string
  fullPath: string
  path: string
}

const router = useRouter()
const route = useRoute()
const layoutStore = useLayoutStoreHook()

function getRouteTitle(currentRoute: RouteLocationNormalizedLoaded) {
  if (typeof currentRoute.query.title === 'string' && currentRoute.query.title) {
    return currentRoute.query.title
  }

  const matchedWithTitle = currentRoute.matched.filter(record => record.meta?.title)
  const lastMatched = matchedWithTitle.at(-1)

  return String(lastMatched?.meta?.title || currentRoute.name || currentRoute.path || '未命名页面')
}

const pageTabs = computed(() => layoutStore.pageTabs)
const activeFullPath = computed(() => route.fullPath)
const canClosePageTab = computed(() => pageTabs.value.length > 1)

watch(() => route.fullPath, () => {
  if (route.meta.layout !== false) {
    layoutStore.upsertPageTab({
      title: getRouteTitle(route),
      fullPath: route.fullPath,
      path: route.path,
    })
  }
}, { immediate: true })

function switchPageTab(tab: PageNavTabItem) {
  if (tab.fullPath === route.fullPath) {
    return
  }

  router.push(tab.fullPath)
}

function switchPageTabByFullPath(fullPath: string | number) {
  const tab = pageTabs.value.find(item => item.fullPath === String(fullPath))

  if (tab) {
    switchPageTab(tab)
  }
}

function getNextPageTabFullPath(fullPath: string) {
  const currentIndex = pageTabs.value.findIndex(tab => tab.fullPath === fullPath)

  if (currentIndex === -1) {
    return pageTabs.value.at(-1)?.fullPath
  }

  return pageTabs.value[currentIndex + 1]?.fullPath || pageTabs.value[currentIndex - 1]?.fullPath
}

function closePageTab(tab: PageNavTabItem) {
  if (!canClosePageTab.value) {
    return
  }

  const nextFullPath = tab.fullPath === route.fullPath
    ? getNextPageTabFullPath(tab.fullPath)
    : undefined

  layoutStore.removePageTab(tab.fullPath)

  if (nextFullPath) {
    router.push(nextFullPath)
  }
}

function closePageTabByFullPath(fullPath: string | number) {
  const tab = pageTabs.value.find(item => item.fullPath === String(fullPath))

  if (tab) {
    closePageTab(tab)
  }
}
</script>

<template>
  <nav
    v-if="pageTabs.length > 0"
    aria-label="页面标签栏"
    class="layout-page-nav-bar flex-none bg-[--el-bg-color] rounded-2"
  >
    <el-tabs
      :model-value="activeFullPath"
      type="card"
      :closable="canClosePageTab"
      class="page-tabs"
      @tab-change="switchPageTabByFullPath"
      @tab-remove="closePageTabByFullPath"
    >
      <el-tab-pane
        v-for="tab in pageTabs"
        :key="tab.fullPath"
        :label="tab.title"
        :name="tab.fullPath"
      >
        <template #label>
          <span class="page-tab-label" :title="tab.title">
            <span class="page-tab-label__base">{{ tab.baseTitle || tab.title }}</span>
            <template v-if="tab.subtitle">
              <span class="page-tab-label__separator">-</span>
              <span class="page-tab-label__subtitle">{{ tab.subtitle }}</span>
            </template>
          </span>
        </template>
      </el-tab-pane>
    </el-tabs>
  </nav>
</template>

<style lang="scss" scoped>
.layout-page-nav-bar {
  min-height: 40px;
  padding: 6px 10px 0;
}

.page-tabs {
  --el-tabs-header-height: 34px;

  :deep(.el-tabs__header) {
    margin: 0;
    border-bottom-color: var(--el-border-color-lighter);
  }

  :deep(.el-tabs__nav) {
    max-width: 100%;
  }

  :deep(.el-tabs__item) {
    max-width: 240px;
    padding-inline: 16px;
    color: var(--el-text-color-regular);
  }

  :deep(.el-tabs__item .is-icon-close) {
    margin-left: 8px;
  }

  :deep(.el-tabs__item.is-active) {
    background: var(--el-bg-color);
    color: var(--el-color-primary);
  }

  :deep(.el-tabs__item.is-active .page-tab-label__subtitle),
  :deep(.el-tabs__item.is-active .page-tab-label__separator) {
    color: var(--el-color-primary);
  }

  :deep(.el-tabs__content) {
    display: none;
  }
}

.page-tab-label {
  display: inline-flex;
  align-items: center;
  max-width: 184px;
  min-width: 0;
  vertical-align: middle;
}

.page-tab-label__base,
.page-tab-label__separator {
  flex: none;
}

.page-tab-label__separator {
  margin-inline: 2px;
  color: var(--el-text-color-secondary);
}

.page-tab-label__subtitle {
  min-width: 0;
  max-width: 140px;
  overflow: hidden;
  color: var(--el-text-color-secondary);
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
