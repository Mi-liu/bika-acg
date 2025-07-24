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

// 拖拽排序模式
const isDragMode = ref(false)

function handleCategoryClick(title: string) {
  router.push({
    path: '/comic/list',
    query: {
      title,
    },
  })
}

function handleComicClick(id: string) {
  const to = router.resolve({
    path: `/comic/detail/${id}`,
  })
  window.open(to.href, '_blank')
}

/**
 * 处理分类顺序改变
 */
function handleCategoriesOrderChange(newCategories: Categories['categories']) {
  // 这里可以添加额外的处理逻辑，比如通知其他组件等
  console.log('分类顺序已更新:', newCategories)
}

/**
 * 切换拖拽模式
 */
function toggleDragMode() {
  isDragMode.value = !isDragMode.value
  if (isDragMode.value) {
    ElMessage.info('已开启拖拽排序模式，可以拖拽分类按钮调整顺序')
  }
  else {
    ElMessage.info('已关闭拖拽排序模式')
  }
}

function handleRandomRefresh() {
  randomMutate(undefined)
  randomRefresh()
}
</script>

<template>
  <el-scrollbar>
    <div class="content w-full max-w-1600px mx-auto">
      <!-- 分类区域标题和控制按钮 -->
      <div class="flex items-center justify-between mt-20px mb-10px">
        <div class="text-18px font-medium">漫画分类</div>
        <el-button
          :type="isDragMode ? 'primary' : 'default'"
          :icon="Sort"
          size="small"
          class="drag-toggle-btn"
          :class="{ 'active': isDragMode }"
          @click="toggleDragMode"
        >
          <span class="btn-text">{{ isDragMode ? '完成排序' : '拖拽排序' }}</span>
        </el-button>
      </div>

      <div class="category-section">
        <!-- 最近更新 - 固定位置，不参与拖拽 -->
        <div class="fixed-category mb-10px">
          <el-button class="w-full" plain @click="handleCategoryClick('最近更新')">
            最近更新
          </el-button>
        </div>

        <!-- 可拖拽的分类列表 -->
        <DraggableCategories
          v-if="categories"
          :categories="categories"
          :draggable="isDragMode"
          class="category-grid"
          @order-change="handleCategoriesOrderChange"
        >
          <template #default="{ category, draggable }">
            <el-button
              class="w-full category-button"
              :class="{ 'draggable-button': draggable }"
              plain
              @click="handleCategoryClick(category.title)"
            >
              <el-icon v-if="draggable" class="drag-handle">
                <svg viewBox="0 0 24 24" width="14" height="14">
                  <path fill="currentColor" d="M9 3h2v2H9V3zm0 4h2v2H9V7zm0 4h2v2H9v-2zm0 4h2v2H9v-2zm0 4h2v2H9v-2zm4-16h2v2h-2V3zm0 4h2v2h-2V7zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2z"/>
                </svg>
              </el-icon>
              <span class="category-title">{{ category.title }}</span>
              <div v-if="draggable" class="drag-indicator">
                <div class="drag-dot"></div>
                <div class="drag-dot"></div>
                <div class="drag-dot"></div>
              </div>
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
    .fixed-category {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: 10px;
    }

    .category-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: 10px;

      .category-button {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        border-radius: 8px;
        overflow: hidden;

        &.draggable-button {
          padding: 8px 12px;
          background: linear-gradient(135deg, var(--el-bg-color) 0%, var(--el-color-primary-light-9) 100%);
          border: 1px solid var(--el-color-primary-light-7);
          cursor: grab;

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
            border-color: var(--el-color-primary);
            background: linear-gradient(135deg, var(--el-color-primary-light-9) 0%, var(--el-color-primary-light-8) 100%);
          }

          &:active {
            cursor: grabbing;
          }

          &::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
            transition: left 0.6s;
          }

          &:hover::before {
            left: 100%;
          }
        }

        .drag-handle {
          position: absolute;
          left: 6px;
          top: 50%;
          transform: translateY(-50%);
          opacity: 0.4;
          transition: all 0.3s ease;
          color: var(--el-color-primary);
          z-index: 1;
        }

        .category-title {
          flex: 1;
          text-align: center;
          font-weight: 500;
          transition: all 0.3s ease;
          position: relative;
          z-index: 1;
        }

        .drag-indicator {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          gap: 2px;
          opacity: 0.4;
          transition: all 0.3s ease;

          .drag-dot {
            width: 3px;
            height: 3px;
            background: var(--el-color-primary);
            border-radius: 50%;
            transition: all 0.3s ease;
          }
        }

        &:hover {
          .drag-handle,
          .drag-indicator {
            opacity: 0.8;
          }

          .drag-indicator .drag-dot {
            background: var(--el-color-primary);
            transform: scale(1.2);
          }
        }
      }
    }
  }

  .drag-toggle-btn {
    position: relative;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);

    .btn-text {
      transition: all 0.3s ease;
    }

    &.active {
      animation: pulse-success 2s infinite;

      .btn-text {
        font-weight: 600;
      }
    }

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      transition: left 0.6s;
    }

    &:hover::before {
      left: 100%;
    }
  }

  .random-comic-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px 10px;
  }
}

// 成功脉冲动画
@keyframes pulse-success {
  0% {
    box-shadow: 0 0 0 0 rgba(var(--el-color-primary-rgb), 0.4);
  }
  70% {
    box-shadow: 0 0 0 8px rgba(var(--el-color-primary-rgb), 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(var(--el-color-primary-rgb), 0);
  }
}
</style>
