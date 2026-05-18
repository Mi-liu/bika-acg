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
          class="category-grid"
          @order-change="handleCategoriesOrderChange"
        >
          <template #prepend>
            <el-button class="w-full category-button" plain @click="handleCategoryClick('最近更新')">
              最近更新
            </el-button>
          </template>

          <template #default="{ category, draggable }">
            <el-button
              class="w-full category-button"
              :class="{ 'draggable-button': draggable }"
              plain
              @click="handleCategoryClick(category.title)"
            >
              <span class="category-title">{{ category.title }}</span>
              <el-icon v-if="draggable" class="category-drag-icon">
                <Sort />
              </el-icon>
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
      --draggable-category-width: 120px;

      .category-button {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        min-height: 32px;
        transition:
          border-color 160ms ease,
          background-color 160ms ease,
          box-shadow 160ms ease;
        border-radius: 8px;
        overflow: hidden;

        &.draggable-button {
          padding: 8px 12px;
          cursor: grab;
          user-select: none;

          &:active {
            cursor: grabbing;
          }
        }

        .category-title {
          text-align: center;
          font-weight: 500;
          position: relative;
          z-index: 1;
        }

        .category-drag-icon {
          margin-left: 4px;
          opacity: 0.55;
          transition: opacity 160ms ease;
          color: var(--el-text-color-secondary);
        }

        &:hover {
          .category-drag-icon {
            opacity: 0.8;
          }
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
