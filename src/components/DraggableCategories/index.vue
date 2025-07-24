<script setup lang="ts">
import type { Categories } from '@/api/comic'
import { VueDraggable } from 'vue-draggable-plus'

const props = defineProps<{
  /** 分类数据 */
  categories: Categories['categories']
  /** 是否启用拖拽排序 */
  draggable?: boolean
}>()

const emit = defineEmits<{
  /** 分类顺序改变事件 */
  orderChange: [newCategories: Categories['categories']]
}>()

const localStore = useLocalStoreHook()

// 本地分类数据，用于拖拽排序
const localCategories = ref<Categories['categories']>([])

// 监听 props.categories 变化，更新本地数据
watch(
  () => props.categories,
  (newCategories) => {
    if (newCategories) {
      localCategories.value = [...newCategories]
    }
  },
  { immediate: true },
)

/**
 * 处理拖拽结束事件
 */
function handleDragEnd() {
  // 保存到本地存储
  localStore.updateCategoriesOrder(localCategories.value)

  // 触发顺序改变事件
  emit('orderChange', localCategories.value)

  ElMessage.success('分类顺序已更新')
}
</script>

<template>
  <VueDraggable
    v-model="localCategories"
    class="draggable-categories"
    :class="{ 'draggable-enabled': draggable }"
    :disabled="!draggable"
    :animation="300"
    ghost-class="sortable-ghost"
    chosen-class="sortable-chosen"
    drag-class="sortable-drag"
    fallback-class="sortable-fallback"
    :force-fallback="true"
    :swap-threshold="0.65"
    :invert-swap="false"
    @end="handleDragEnd"
  >
    <div
      v-for="(category, index) in localCategories"
      :key="category.title"
      class="draggable-item"
      :data-index="index"
    >
      <!-- 默认插槽：让外部自定义每个分类项的内容 -->
      <slot
        :category="category"
        :index="index"
        :draggable="draggable"
      >
        <!-- 默认内容 -->
        <div class="default-category-item">
          {{ category.title }}
        </div>
      </slot>
    </div>
  </VueDraggable>
</template>

<style scoped lang="scss">
.draggable-categories {
  &.draggable-enabled {
    .draggable-item {
      cursor: grab;

      &:active {
        cursor: grabbing;
      }

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
    }
  }

  .draggable-item {
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    position: relative;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%);
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
      border-radius: inherit;
      z-index: -1;
    }

    &:hover::before {
      opacity: 1;
    }
  }

  .default-category-item {
    padding: 8px 12px;
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
    background: var(--el-bg-color);
    text-align: center;
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    position: relative;
    overflow: hidden;

    &:hover {
      border-color: var(--el-color-primary);
      background: var(--el-color-primary-light-9);
      transform: translateY(-1px);
    }
  }

  // 美化的 Sortable 全局样式
  :global(.sortable-ghost) {
    opacity: 0.3;
    background: linear-gradient(135deg, var(--el-color-primary-light-9) 0%, var(--el-color-primary-light-8) 100%);
    border: 2px dashed var(--el-color-primary);
    border-radius: 8px;
    transform: scale(0.95);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);

    &::after {
      content: '放置到这里';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: var(--el-color-primary);
      font-size: 12px;
      font-weight: 500;
      white-space: nowrap;
    }
  }

  :global(.sortable-chosen) {
    transform: scale(1.08) rotate(2deg);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    border-radius: 8px;
    background: linear-gradient(135deg, var(--el-bg-color) 0%, var(--el-color-primary-light-9) 100%);
    border: 2px solid var(--el-color-primary);

    &::before {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      background: linear-gradient(45deg, var(--el-color-primary), var(--el-color-primary-light-3));
      border-radius: 8px;
      z-index: -1;
      animation: pulse 2s infinite;
    }
  }

  :global(.sortable-drag) {
    transform: rotate(8deg) scale(1.1);
    opacity: 0.9;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25);
    border-radius: 8px;
    background: var(--el-bg-color);
    border: 2px solid var(--el-color-primary);
    z-index: 9999;
  }

  :global(.sortable-fallback) {
    opacity: 0.9;
    background: linear-gradient(135deg, var(--el-color-primary-light-8) 0%, var(--el-color-primary-light-7) 100%);
    border: 2px solid var(--el-color-primary);
    border-radius: 8px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    transform: scale(1.05);
  }
}

// 脉冲动画
@keyframes pulse {
  0% {
    opacity: 0.7;
    transform: scale(1);
  }
  50% {
    opacity: 0.9;
    transform: scale(1.02);
  }
  100% {
    opacity: 0.7;
    transform: scale(1);
  }
}

// 拖拽时的全局样式优化
:global(body.sortable-drag-active) {
  user-select: none;

  * {
    cursor: grabbing !important;
  }
}
</style>
