<script setup lang="ts">
import { ChatLineSquare, Link, Setting, Star, SwitchButton, Timer, UserFilled } from '@element-plus/icons-vue'
import { getImageUrl } from '@/utils/string'

const userStore = useUserStoreHook()
userStore.getUserProfile()

const router = useRouter()

const switchAccountRoute = computed(() => {
  return {
    path: '/login/account-list',
    query: {
      redirect: encodeURIComponent(router.currentRoute.value.fullPath),
    },
  }
})

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
        <el-dropdown-item class="user-menu-link-item">
          <RouterLink class="user-menu-link" to="/user/following">
            <el-icon>
              <Link />
            </el-icon>
            <span>我的关注</span>
          </RouterLink>
        </el-dropdown-item>
        <el-dropdown-item class="user-menu-link-item">
          <RouterLink class="user-menu-link" to="/user/favorites">
            <el-icon>
              <Star />
            </el-icon>
            <span>我的收藏</span>
          </RouterLink>
        </el-dropdown-item>
        <el-dropdown-item class="user-menu-link-item">
          <RouterLink class="user-menu-link" to="/user/comments">
            <el-icon>
              <ChatLineSquare />
            </el-icon>
            <span>我的评论</span>
          </RouterLink>
        </el-dropdown-item>
        <el-dropdown-item class="user-menu-link-item">
          <RouterLink class="user-menu-link" to="/user/watch-later">
            <el-icon>
              <Timer />
            </el-icon>
            <span>稍后再看</span>
          </RouterLink>
        </el-dropdown-item>
        <el-dropdown-item class="user-menu-link-item">
          <RouterLink class="user-menu-link" to="/user/setting">
            <el-icon>
              <Setting />
            </el-icon>
            <span>设置</span>
          </RouterLink>
        </el-dropdown-item>
        <el-dropdown-item class="user-menu-link-item" divided>
          <RouterLink class="user-menu-link" :to="switchAccountRoute" replace>
            <el-icon>
              <UserFilled />
            </el-icon>
            <span>切换账号</span>
          </RouterLink>
        </el-dropdown-item>
        <el-dropdown-item class="user-menu-link-item" @click="handleLogout">
          <span class="user-menu-link">
            <el-icon>
              <SwitchButton />
            </el-icon>
            <span>退出登录</span>
          </span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style lang="scss" scoped>
.user-menu-link-item {
  padding: 0;

  :deep(.el-dropdown-menu__item) {
    padding: 0;
  }
}

.user-menu-link {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 5px 16px;
  color: inherit;
  text-decoration: none;
}
</style>
