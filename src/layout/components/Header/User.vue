<script setup lang="ts">
import { ChatLineSquare, Link, Setting, Star, SwitchButton, Timer } from '@element-plus/icons-vue'
import { getImageUrl } from '@/utils/string'

const userStore = useUserStoreHook()
userStore.getUserProfile()

const router = useRouter()

function handleFavourite() {
  const url = router.resolve({
    path: '/user/favorites',
  }).href
  window.open(url, '_blank')
}

function handleComments() {
  const url = router.resolve({
    path: '/user/comments',
  }).href
  window.open(url, '_blank')
}

function handleFollowing() {
  const url = router.resolve({
    path: '/user/following',
  }).href
  window.open(url, '_blank')
}

function handleWatchLater() {
  const url = router.resolve({
    path: '/user/watch-later',
  }).href
  window.open(url, '_blank')
}

function handleSetting() {
  const url = router.resolve({
    path: '/setting/index',
  }).href
  window.open(url, '_blank')
}
</script>

<template>
  <el-dropdown
    v-if="userStore.user" class="h-full ml-auto" placement="bottom-end"
    trigger="hover" :show-timeout="100"
    :hide-timeout="100"
  >
    <el-button class="h-full! outline-none!" text>
      <div class="truncate max-w-6em">
        {{ userStore.user?.name }}
      </div>
      <el-avatar class="ml-2" :size="30" :src="getImageUrl(userStore.user?.avatar?.path)" />
    </el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item :icon="Link" @click="handleFollowing">我的关注</el-dropdown-item>
        <el-dropdown-item :icon="Star" @click="handleFavourite">我的收藏</el-dropdown-item>
        <el-dropdown-item :icon="ChatLineSquare" @click="handleComments">我的评论</el-dropdown-item>
        <el-dropdown-item :icon="Timer" @click="handleWatchLater">稍后再看</el-dropdown-item>
        <el-dropdown-item :icon="Setting" @click="handleSetting">设置</el-dropdown-item>
        <el-dropdown-item :icon="SwitchButton" divided>退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style lang="scss" scoped></style>
