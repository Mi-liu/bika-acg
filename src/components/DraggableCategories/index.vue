<script setup lang="ts">
import type { Categories } from '@/api/comic'
import Sortable from 'sortablejs'

const props = defineProps<{
  /** 分类数据 */
  categories: Categories['categories']
  /** 是否启用拖拽排序 */
  draggable?: boolean
  /** Sortable 配置选项 */
  sortableOptions?: Partial<Sortable.Options>
}>()

const emit = defineEmits<{
  /** 分类顺序改变事件 */
  orderChange: [newCategories: Categories['categories']]
}>()

const localStore = useLocalStoreHook()

// 本地分类数据，用于拖拽排序
const localCategories = ref<Categories['categories']>([])

// 拖拽容器引用
const categoryListRef = useTemplateRef('categoryListRef')

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

// 初始化拖拽排序
onMounted(() => {
  if (props.draggable && categoryListRef.value) {
    initSortable()
  }
})
// 声明 sortableInstance 变量
let sortableInstance: Sortable | null = null
// 监听 draggable 属性变化
watch(
  () => props.draggable,
  (newDraggable) => {
    if (newDraggable && categoryListRef.value) {
      initSortable()
    }
    else if (!newDraggable && sortableInstance) {
      sortableInstance.destroy()
      sortableInstance = null
    }
  },
)

/**
 * 初始化 Sortable 拖拽排序
 */
function initSortable() {
  if (!categoryListRef.value || sortableInstance)
    return

  const defaultOptions: Partial<Sortable.Options> = {
    animation: 200,
    ghostClass: 'sortable-ghost',
    chosenClass: 'sortable-chosen',
    dragClass: 'sortable-drag',
    forceFallback: true,
    fallbackClass: 'sortable-fallback',
    onEnd: (evt) => {
      const { oldIndex, newIndex } = evt
      if (oldIndex !== undefined && newIndex !== undefined && oldIndex !== newIndex) {
        // 更新本地数据顺序
        const newCategories = [...localCategories.value]
        const [movedItem] = newCategories.splice(oldIndex, 1)
        newCategories.splice(newIndex, 0, movedItem)

        localCategories.value = newCategories

        // 保存到本地存储
        localStore.updateCategoriesOrder(newCategories)

        // 触发顺序改变事件
        emit('orderChange', newCategories)

        ElMessage.success('分类顺序已更新')
      }
    },
  }

  // 合并用户自定义配置
  const options = { ...defaultOptions, ...props.sortableOptions }

  sortableInstance = Sortable.create(categoryListRef.value, options)
}

// 组件卸载时销毁 Sortable 实例
onUnmounted(() => {
  if (sortableInstance) {
    sortableInstance.destroy()
    sortableInstance = null
  }
})
</script>

<template>
  <div
    ref="categoryListRef"
    class="draggable-categories"
    :class="{ 'draggable-enabled': draggable }"
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
  </div>
</template>

<style scoped lang="scss">
.draggable-categories {
  &.draggable-enabled {
    .draggable-item {
      cursor: move;
    }
  }

  .draggable-item {
    transition: transform 0.2s ease;
  }

  .default-category-item {
    padding: 8px 12px;
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
    background: var(--el-bg-color);
    text-align: center;
    transition: all 0.2s ease;

    &:hover {
      border-color: var(--el-color-primary);
      background: var(--el-color-primary-light-9);
    }
  }

  // Sortable 全局样式
  :global(.sortable-ghost) {
    opacity: 0.5;
    background: var(--el-color-primary-light-9);
    border: 2px dashed var(--el-color-primary);
  }

  :global(.sortable-chosen) {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  :global(.sortable-drag) {
    transform: rotate(5deg);
    opacity: 0.8;
  }

  :global(.sortable-fallback) {
    opacity: 0.8;
    background: var(--el-color-primary-light-8);
    border: 1px solid var(--el-color-primary);
    border-radius: 4px;
  }
}
</style>
