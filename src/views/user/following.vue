<script setup lang="ts">
import { Close, UserFilled } from '@element-plus/icons-vue'
import { ElButton, ElIcon, ElMessage } from 'element-plus'

/**
 * 我的关注列表页面
 */

const router = useRouter()

const localStore = useLocalStoreHook()

function handleAuthorClick(author: string) {
  const url = router.resolve({
    path: '/comic/list',
    query: {
      author,
    },
  }).href
  window.open(url, '_blank')
}

/**
 * 取消关注作者
 * @param authorName 作者名称
 */
async function handleUnfollow(authorName: string) {
  await ElMessageBox.confirm('确定取消关注该作者吗？', '提示', {
    title: '提示',
    message: '确定取消关注该作者吗？',
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
  localStore.removeItem('FOLLOW_AUTHOR_LIST', authorName)
  ElMessage.success(`已取消关注 ${authorName}`)
}
</script>

<template>
  <div class="flex flex-col bg-[--el-bg-color-page]">
    <div>
      我的关注
    </div>
    <el-scrollbar>
      <div class="flex gap-2">
        <ElButton v-for="item in localStore.local.FOLLOW_AUTHOR_LIST" :key="item" class="ml-0! h-fit!">
          <el-avatar size="small" :icon="UserFilled" />
          <el-link
            class="ml-auto ml-2!" type="primary" underline="always"
            @click="handleAuthorClick(item)"
          >
            {{ item }}
          </el-link>

          <div
            class="size-20px rounded-50% flex-center ml-2 hover:text-[--el-color-danger]"
            @click="handleUnfollow(item)"
          >
            <ElIcon size="18">
              <Close />
            </ElIcon>
          </div>
        </ElButton>
      </div>
    </el-scrollbar>
  </div>
</template>

<style scoped></style>
