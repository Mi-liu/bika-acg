<script setup lang="ts">
import { ChatLineSquare, Link, Setting, Star, SwitchButton, Timer, UserFilled } from '@element-plus/icons-vue'
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

/**
 * 处理切换账号
 * 跳转到账号列表页面
 */
function handleSwitchAccount() {
  router.replace({
    path: '/login/account-list',
    query: {
      redirect: encodeURIComponent(router.currentRoute.value.fullPath),
    },
  })
}

/**
 * 处理退出登录
 * 清空用户信息并返回到登录页面
 */
function handleLogout() {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    // 清空用户信息
    userStore.clearUserProfile()

    // 跳转到登录页面
    router.replace({
      path: '/login/index',
      query: {
        redirect: encodeURIComponent(router.currentRoute.value.fullPath),
      },
    })

    ElMessage.success('已退出登录')
  }).catch(() => {
    // 用户取消退出
  })
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
        <el-dropdown-item :icon="UserFilled" divided @click="handleSwitchAccount">切换账号</el-dropdown-item>
        <el-dropdown-item :icon="SwitchButton" @click="handleLogout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style lang="scss" scoped></style>
