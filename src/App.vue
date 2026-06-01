<script setup lang="ts">
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { computed, watchEffect } from 'vue'
import { useRequestProvider } from 'vue-hooks-plus'
import layout from '@/layout/index.vue'

const settingStore = useSettingStoreHook()
const prefersDark = usePreferredDark()

const activeTheme = computed(() => {
  if (settingStore.appearance.themeMode === 'system') {
    return prefersDark.value ? 'dark' : 'light'
  }

  return settingStore.appearance.themeMode
})

useRequestProvider({
  /** 延迟 loading 变成 true 的时间，有效防止闪烁 */
  loadingDelay: 500,
})

watchEffect(() => {
  const isDark = activeTheme.value === 'dark'

  document.documentElement.classList.toggle('dark', isDark)
  document.documentElement.style.colorScheme = activeTheme.value
})
</script>

<template>
  <el-config-provider :locale="zhCn" size="large">
    <layout />
  </el-config-provider>
</template>

<style scoped></style>
