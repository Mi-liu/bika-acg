<script setup lang="ts">
import { Close, UserFilled } from '@element-plus/icons-vue'
import { ElButton, ElIcon, ElMessage } from 'element-plus'
import Author from '@/components/Author/index.vue'

/**
 * 我的关注列表页面
 */

const localStore = useLocalStoreHook()

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
  <div class="flex flex-col">
    <div>
      我的关注
    </div>
    <el-scrollbar v-if="localStore.local.FOLLOW_AUTHOR_LIST.length > 0">
      <div class="flex gap-2">
        <ElButton v-for="item in localStore.local.FOLLOW_AUTHOR_LIST" :key="item" class="ml-0! h-fit!">
          <el-avatar class="mr-2" size="small" :icon="UserFilled" />
          <Author :author="item" :show-menus="false" />

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
    <div v-else class="flex-center h-full min-h-400px">
      <el-empty description="暂无关注作者" :image-size="160">
        <div class="text-14px text-[--el-text-color-secondary] leading-relaxed text-center">
          关注喜欢的作者后，会在这里展示
        </div>
      </el-empty>
    </div>
  </div>
</template>

<style scoped></style>
