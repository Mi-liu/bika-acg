<script setup lang="ts">
import { getComics } from '@/api/comic'
import { getImageUrl } from '@/utils/string'

const props = defineProps<{
  title: string
}>()

const settinnStore = useSettingStoreHook()

const { data } = useRequest(() =>
  getComics({
    page: 1,
    c: encodeURIComponent(props.title),
    s: 'dd',
  }),
)

// 分类屏蔽功能
async function handleBlockCategory(cat: string) {
  try {
    await ElMessageBox.confirm(
      `确定要屏蔽"${cat}"分类吗？`,
      '提示',
    )
    const blocked = settinnStore.comic.blockedCategories
    if (blocked.includes(cat)) {
      ElMessage.warning(`分类“${cat}”已在屏蔽列表，无需重复添加。`)
      return
    }
    blocked.push(cat)
    ElMessage.success(`已屏蔽分类“${cat}”！`)
  } catch (e) {
    // 用户取消
  }
}
</script>

<template>
  <div class="comics-list p-4 md:p-8 bg-gray-50 dark:bg-dark-800 min-h-screen">
    <el-page-header class="my-3" @back="$router.back()">
      <template #content>
        <span class="text-large font-600 mr-3"> {{ title }} </span>
      </template>
    </el-page-header>
    <div class="scroll-container flex-1 overflow-hidden">
      <el-scrollbar height="100%">
        <div class="comics">
          <el-card v-for="item in data?.docs" :key="item.id" shadow="hover"
            class="comic-card rounded-1 overflow-hidden transition-all duration-300 hover:shadow-2xl bg-white dark:bg-dark-700 flex flex-col p-0 cursor-pointer group">
            <div class="relative">
              <el-image
                class="aspect-ratio-3/4 w-full object-cover rounded-1 transition-transform duration-300 group-hover:scale-105 group-hover:shadow-lg"
                :src="getImageUrl(item.thumb.path)" fit="cover" />
            </div>
            <div class="flex-1 flex flex-col justify-between p-4">
              <div class="title font-bold text-lg mb-1 line-clamp-2 text-gray-800 dark:text-gray-100">
                {{ item.title }}
              </div>
              <div class="flex items-center text-sm text-gray-500 mb-2 gap-2">
                <span v-if="item.finished" class="text-green-600 dark:text-green-400 font-semibold">[完结]</span>
                <span>共 {{ item.epsCount }} 话</span>
                <span>{{ item.pagesCount }}P</span>
              </div>
              <div class="flex items-center flex-wrap gap-2 mt-2">
                <span class="text-gray-400">作者:</span>
                <el-tag v-for="a in item.author.split('，')" :key="a"
                  class="ml-0 text-sm bg-blue-500/90 dark:bg-blue-400/80 text-white dark:text-gray-900 border-none font-semibold"
                  effect="dark">
                  {{ a }}
                </el-tag>
              </div>
              <!-- 分类 -->
              <div class="flex flex-wrap gap-2 mt-2">
                <el-tag v-for="cat in item.categories" :key="cat"
                  class="text-xs border border-gray-300 dark:border-gray-600 bg-transparent text-gray-600 dark:text-gray-300 font-normal"
                  effect="plain" closable @close="handleBlockCategory(cat)">
                  {{ cat }}
                </el-tag>
              </div>

            </div>
          </el-card>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.comics-list {
  display: flex;
  flex-direction: column;

  .comics {
    display: grid;
    grid-template-columns: repeat(auto-fill, 280px);
    gap: 20px;
    justify-content: center;
  }

  .comic-card {
    width: 100%;
    min-width: 0;
    max-width: 100%;
  }
}
</style>
