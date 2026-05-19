<script setup lang="ts">
import type { Categories } from '@/api/comic'
import { Refresh, Sort } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { getCategories, getRandomComic } from '@/api/comic'
import DraggableCategories from '@/components/DraggableCategories/index.vue'
import Image from '@/components/Image/index.vue'
import { getImageUrl } from '@/utils/string'

const router = useRouter()

const { data: categories } = useRequest(getCategories)

const { data: randomComics, run: randomRefresh, mutate: randomMutate, loading: randomLoading } = useRequest(getRandomComic)

function handleCategoryClick(title: string) {
  router.push({
    path: '/comic/list',
    query: {
      title,
    },
  })
}

function handleCategoryButtonClick(event: MouseEvent, title: string) {
  if (event.target instanceof Element && event.target.closest('.category-drag-handle')) {
    return
  }

  handleCategoryClick(title)
}

function handleComicClick(id: string) {
  router.push({
    path: `/comic/detail/${id}`,
  })
}

/**
 * 处理分类顺序改变
 */
function handleCategoriesOrderChange(newCategories: Categories['categories']) {
  // 这里可以添加额外的处理逻辑，比如通知其他组件等
  console.log('分类顺序已更新:', newCategories)
}

function handleRandomRefresh() {
  randomMutate(undefined)
  randomRefresh()
}
</script>

<template>
  <el-scrollbar>
    <div class="content w-full max-w-1600px mx-auto">
      <!-- 分类区域标题 -->
      <div class="flex items-center justify-between mt-20px mb-10px">
        <div class="text-18px font-medium">漫画分类</div>
      </div>

      <div class="category-section">
        <!-- 分类列表，最近更新固定在首位且不参与拖拽 -->
        <DraggableCategories
          v-if="categories"
          :categories="categories"
          :draggable="true"
          handle=".category-drag-handle"
          class="category-grid"
          @order-change="handleCategoriesOrderChange"
        >
          <template #prepend>
            <el-button class="w-full category-button" plain @click="handleCategoryClick('最近更新')">
              <span class="category-text-area">
                <span class="category-title">最近更新</span>
              </span>
            </el-button>
          </template>

          <template #default="{ category, draggable }">
            <el-button
              class="w-full category-button"
              :class="{ 'has-sort-handle': draggable }"
              plain
              @click="handleCategoryButtonClick($event, category.title)"
            >
              <span class="category-text-area">
                <span class="category-title">{{ category.title }}</span>
              </span>
              <span
                v-if="draggable"
                class="category-drag-handle"
                title="拖拽排序"
                aria-label="拖拽排序"
                @click.stop.prevent
              >
                <el-icon>
                  <Sort />
                </el-icon>
              </span>
            </el-button>
          </template>
        </DraggableCategories>
      </div>
      <div>
        <div class="flex items-center justify-between mt-3">
          <div class="text-20px">随机漫画</div>
          <el-button :icon="Refresh" @click="handleRandomRefresh">
            换一批
          </el-button>
        </div>
        <div class="random-comic-list mt-2">
          <el-skeleton
            v-for="i in 10" :key="i" class="w-full"
            :loading="randomLoading"
          >
            <template #template>
              <div class="size-full">
                <div class="w-full! aspect-3/4">
                  <el-skeleton-item class="size-full!" variant="image" />
                </div>
                <el-skeleton-item variant="h3" class="w-40%! mt-1" />
                <el-skeleton-item variant="h3" />
              </div>
            </template>
          </el-skeleton>

          <div
            v-for="comic in randomComics" :key="comic._id" class="random-comic-item cursor-pointer"
            @click="handleComicClick(comic._id)"
          >
            <Image :src="getImageUrl(comic.thumb.path)" />
            <div class="random-comic-item-title line-clamp-2">
              {{ comic.title }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-scrollbar>
</template>

<style scoped lang="scss">
.content {
  .category-section {
    .category-grid {
      --draggable-category-width: 150px;

      .category-button {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        min-width: 0;
        min-height: 32px;
        padding: 0;
        gap: 0;
        transition:
          border-color 160ms ease,
          background-color 160ms ease,
          box-shadow 160ms ease;
        border-radius: 8px;
        overflow: hidden;
      }

      .category-button :deep(> span) {
        display: flex;
        align-items: stretch;
        justify-content: stretch;
        width: 100%;
        min-width: 0;
      }

      .category-text-area {
        display: flex;
        flex: 1 1 auto;
        align-items: center;
        justify-content: center;
        min-width: 0;
        padding: 8px 10px;
      }

      .category-title {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: center;
        font-weight: 500;
        position: relative;
        z-index: 1;
      }

      .category-drag-handle {
        display: inline-flex;
        flex: 0 0 32px;
        align-items: center;
        justify-content: center;
        width: 32px;
        border-left: 1px solid var(--el-border-color-lighter);
        cursor: grab;
        color: var(--el-text-color-secondary);
        background-color: var(--el-fill-color-extra-light);
        transition:
          color 160ms ease,
          background-color 160ms ease,
          border-color 160ms ease;

        &:active {
          cursor: grabbing;
        }

        &:hover {
          border-color: var(--el-color-primary-light-7);
          color: var(--el-color-primary);
          background-color: var(--el-color-primary-light-9);
        }
      }

      .category-button:hover {
        .category-drag-handle {
          border-color: var(--el-border-color);
        }
      }
    }
  }

  .random-comic-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px 10px;
  }
}
</style>
