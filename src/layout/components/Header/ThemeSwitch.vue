<script setup lang="ts">
import type { Component } from 'vue'
import type { ThemeMode } from '@/store/modules/setting'
import { Monitor, Moon, Sunny } from '@element-plus/icons-vue'

interface ThemeOption {
  value: ThemeMode
  label: string
  icon: Component
}

const settingStore = useSettingStoreHook()

const themeOptions: ThemeOption[] = [
  {
    value: 'system',
    label: '跟随系统',
    icon: Monitor,
  },
  {
    value: 'light',
    label: '浅色模式',
    icon: Sunny,
  },
  {
    value: 'dark',
    label: '深色模式',
    icon: Moon,
  },
]

const currentThemeOption = computed(() => {
  return themeOptions.find(item => item.value === settingStore.appearance.themeMode) || themeOptions[0]
})

function handleThemeCommand(command: string | number | object) {
  if (typeof command !== 'string') {
    return
  }

  if (!themeOptions.some(item => item.value === command)) {
    return
  }

  settingStore.appearance.themeMode = command as ThemeMode
}
</script>

<template>
  <el-dropdown trigger="click" placement="bottom-end" @command="handleThemeCommand">
    <el-button
      circle
      class="theme-switch-button"
      :aria-label="`切换主题，当前${currentThemeOption.label}`"
    >
      <el-icon>
        <component :is="currentThemeOption.icon" />
      </el-icon>
    </el-button>

    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="option in themeOptions"
          :key="option.value"
          :command="option.value"
          :class="{ 'is-active': option.value === settingStore.appearance.themeMode }"
        >
          <el-icon>
            <component :is="option.icon" />
          </el-icon>
          <span>{{ option.label }}</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style scoped lang="scss">
.theme-switch-button {
  flex: 0 0 auto;
}

:deep(.is-active) {
  color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
}
</style>
