<script setup lang="ts">
import { Star, Setting, ChatLineSquare, Link, SwitchButton, Timer } from '@element-plus/icons-vue'
const layoutStore = useLayoutStoreHook()

const userStore = useUserStoreHook()

const settingStore = useSettingStoreHook()
</script>

<template>
  <el-dropdown class="h-full ml-auto" placement="bottom-end" trigger="hover" :show-timeout="100" :hide-timeout="100">
    <el-button class="h-full! outline-none!" text>
      <div class="truncate max-w-6em">
        {{ userStore.user?.name }}
      </div>
      <el-avatar class="ml-2" :size="30" :src="settingStore.imageBaseUrl + userStore.user?.avatar.path" />
    </el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item :icon="Link">我的关注</el-dropdown-item>
        <el-dropdown-item :icon="Star">我的收藏</el-dropdown-item>
        <el-dropdown-item :icon="ChatLineSquare">我的评论</el-dropdown-item>
        <el-dropdown-item :icon="Timer">稍后再看</el-dropdown-item>
        <el-dropdown-item :icon="Setting">设置</el-dropdown-item>
        <el-dropdown-item :icon="SwitchButton" divided>退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style lang="scss" scoped></style>
