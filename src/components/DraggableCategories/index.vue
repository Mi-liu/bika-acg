<script setup lang="ts">
import type { SortableEvent } from 'vue-draggable-plus'
import type { Categories } from '@/api/comic'
import { VueDraggable } from 'vue-draggable-plus'

const props = defineProps<{
  /** 分类数据 */
  categories: Categories['categories']
  /** 是否启用拖拽排序 */
  draggable?: boolean
  /** 拖拽手柄选择器，不传时整项可拖拽 */
  handle?: string
}>()

const emit = defineEmits<{
  /** 分类顺序改变事件 */
  orderChange: [newCategories: Categories['categories']]
}>()

const localStore = useLocalStoreHook()

// 本地分类数据，用于拖拽排序
const localCategories = ref<Categories['categories']>([])
const isSorting = ref(false)
const isDropSettling = ref(false)
const dragStartOrder = ref('')
let settleTimer: ReturnType<typeof window.setTimeout> | undefined

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

function getOrderSnapshot() {
  return localCategories.value.map(category => category.title).join('\u001F')
}

function handleDragStart() {
  window.clearTimeout(settleTimer)
  isSorting.value = true
  isDropSettling.value = true
  dragStartOrder.value = getOrderSnapshot()
  document.body.classList.add('sortable-drag-active')
}

function handleDragEnd(event: SortableEvent) {
  isSorting.value = false
  document.body.classList.remove('sortable-drag-active')

  settleTimer = window.setTimeout(() => {
    isDropSettling.value = false
  }, 160)

  const oldIndex = event.oldDraggableIndex ?? event.oldIndex
  const newIndex = event.newDraggableIndex ?? event.newIndex
  const isSameIndex = oldIndex !== undefined && newIndex !== undefined && oldIndex === newIndex
  if (isSameIndex || dragStartOrder.value === getOrderSnapshot()) {
    return
  }

  localStore.updateCategoriesOrder(localCategories.value)
  emit('orderChange', localCategories.value)
  ElMessage.success('分类顺序已更新')
}

function handleItemClick(event: MouseEvent) {
  if (!props.draggable || (!isSorting.value && !isDropSettling.value)) {
    return
  }

  event.preventDefault()
  event.stopPropagation()
}

onBeforeUnmount(() => {
  window.clearTimeout(settleTimer)
  document.body.classList.remove('sortable-drag-active')
})
</script>

<template>
  <VueDraggable
    v-model="localCategories"
    class="draggable-categories"
    :class="{ 'draggable-enabled': draggable }"
    :disabled="!draggable"
    :animation="260"
    easing="cubic-bezier(0.22, 1, 0.36, 1)"
    draggable=".draggable-item"
    :handle="handle"
    ghost-class="sortable-ghost"
    chosen-class="sortable-chosen"
    drag-class="sortable-drag"
    fallback-class="sortable-fallback"
    :force-fallback="true"
    :fallback-on-body="true"
    :fallback-tolerance="3"
    :swap-threshold="0.42"
    :invert-swap="false"
    :empty-insert-threshold="18"
    @start="handleDragStart"
    @end="handleDragEnd"
  >
    <div
      v-for="(category, index) in localCategories"
      :key="category.title"
      class="draggable-item"
      :class="{ 'is-sorting': isSorting }"
      :data-index="index"
      @click.capture="handleItemClick"
    >
      <!-- 默认插槽：让外部自定义每个分类项的内容 -->
      <slot
        :category="category"
        :index="index"
        :draggable="draggable"
        :is-sorting="isSorting"
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
      touch-action: pan-y;
      cursor: grab;

      &:active {
        cursor: grabbing;
      }

      &:hover:not(.is-sorting) {
        transform: translateY(-1px);
      }
    }
  }

  .draggable-item {
    position: relative;
    transition:
      transform 260ms cubic-bezier(0.22, 1, 0.36, 1),
      opacity 180ms ease,
      box-shadow 180ms ease,
      filter 180ms ease;
    will-change: transform;
  }

  .default-category-item {
    padding: 8px 12px;
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
    background: var(--el-bg-color);
    text-align: center;
    position: relative;
    overflow: hidden;
    transition:
      border-color 160ms ease,
      background-color 160ms ease,
      box-shadow 160ms ease;

    &:hover {
      border-color: var(--el-color-primary);
      background-color: var(--el-color-primary-light-9);
    }
  }

  :global(.sortable-ghost) {
    opacity: 1;
  }

  :global(.sortable-ghost > *) {
    color: transparent;
    border: 1px dashed var(--el-color-primary) !important;
    border-radius: 8px;
    background-color: var(--el-color-primary-light-9) !important;
    box-shadow: inset 0 0 0 1px var(--el-color-primary-light-7) !important;
    opacity: 0.72;
  }

  :global(.sortable-chosen) {
    z-index: 3;
  }

  :global(.sortable-chosen > *) {
    border-color: var(--el-color-primary) !important;
    background-color: var(--el-color-primary-light-9) !important;
    box-shadow: 0 6px 18px rgba(64, 158, 255, 0.18) !important;
  }

  :global(.sortable-drag) {
    opacity: 1;
    transform: scale(1.04);
    filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.18));
    border-radius: 8px;
    z-index: 9999;
  }

  :global(.sortable-drag > *) {
    border-color: var(--el-color-primary) !important;
    background-color: var(--el-bg-color) !important;
    box-shadow: 0 10px 24px rgba(64, 158, 255, 0.2) !important;
  }

  :global(.sortable-fallback) {
    opacity: 1;
    transform: scale(1.04);
    filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.18));
    border-radius: 8px;
  }

  :global(.sortable-fallback > *) {
    border-color: var(--el-color-primary) !important;
    background-color: var(--el-bg-color) !important;
    box-shadow: 0 10px 24px rgba(64, 158, 255, 0.2) !important;
  }
}

// 拖拽时的全局样式优化
:global(body.sortable-drag-active) {
  user-select: none;

  * {
    cursor: grabbing !important;
  }
}

@media (prefers-reduced-motion: reduce) {
  .draggable-categories {
    .draggable-item,
    .default-category-item {
      transition-duration: 0.01ms;
    }
  }
}
</style>
