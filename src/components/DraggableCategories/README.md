# DraggableCategories 可拖拽排序组件

一个基于 `vue-draggable-plus` 的现代拖拽排序组件，专为 Vue 3 设计，支持自定义样式和内容。

## 特性

- 🎯 **通用性强**: 通过插槽让外部完全自定义内容和样式
- 🎨 **样式灵活**: 不强制任何具体样式，完全由外部控制
- 💾 **自动保存**: 自动保存排序结果到本地存储
- ⚡ **性能优化**: 支持自定义 Sortable 配置选项
- 🔧 **易于使用**: 简单的 API 设计

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `categories` | `Categories['categories']` | - | 分类数据数组 |
| `draggable` | `boolean` | `false` | 是否启用拖拽排序 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `orderChange` | `newCategories: Categories['categories']` | 分类顺序改变时触发 |

## 插槽

### 默认插槽

用于自定义每个分类项的内容和样式。

**插槽参数:**
- `category`: 当前分类对象
- `index`: 当前项的索引
- `draggable`: 是否处于拖拽模式

## 使用示例

### 基础用法

```vue
<template>
  <DraggableCategories
    :categories="categories"
    :draggable="isDragMode"
    @order-change="handleOrderChange"
  >
    <template #default="{ category, draggable }">
      <div class="my-category-item">
        {{ category.title }}
        <span v-if="draggable" class="drag-indicator">⋮⋮</span>
      </div>
    </template>
  </DraggableCategories>
</template>
```

### 技术优势

- **Vue 3 原生支持**: 基于 `vue-draggable-plus`，专为 Vue 3 设计
- **TypeScript 友好**: 完整的类型支持和智能提示
- **性能优化**: 使用 Vue 3 的响应式系统，性能更佳
- **API 简洁**: 更简单的配置和使用方式

### 使用 Element Plus 按钮

```vue
<template>
  <DraggableCategories
    :categories="categories"
    :draggable="isDragMode"
    @order-change="handleOrderChange"
    class="category-grid"
  >
    <template #default="{ category, draggable }">
      <el-button 
        class="w-full category-button" 
        plain 
        @click="handleCategoryClick(category.title)"
      >
        <span class="category-title">{{ category.title }}</span>
        <el-icon v-if="draggable" class="drag-handle">
          <Sort />
        </el-icon>
      </el-button>
    </template>
  </DraggableCategories>
</template>

<style scoped>
.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 10px;
}

.category-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.category-title {
  flex: 1;
  text-align: center;
}

.drag-handle {
  opacity: 0.5;
  transition: opacity 0.2s;
  margin-left: 8px;
}

.category-button:hover .drag-handle {
  opacity: 1;
}
</style>
```

### 自定义 Sortable 配置

```vue
<template>
  <DraggableCategories
    :categories="categories"
    :draggable="isDragMode"
    :sortable-options="{
      animation: 300,
      ghostClass: 'my-ghost-class',
      chosenClass: 'my-chosen-class'
    }"
    @order-change="handleOrderChange"
  >
    <template #default="{ category }">
      <div class="custom-item">{{ category.title }}</div>
    </template>
  </DraggableCategories>
</template>
```

## 注意事项

1. **样式完全自定义**: 组件不提供任何具体的布局样式，需要外部通过 CSS 类或内联样式来控制布局
2. **拖拽状态**: 可以通过插槽参数 `draggable` 来判断当前是否处于拖拽模式，从而显示不同的 UI
3. **自动保存**: 组件会自动将排序结果保存到本地存储中，无需手动处理
4. **性能考虑**: 大量数据时建议使用虚拟滚动或分页来优化性能

## 全局拖拽样式类

组件提供了以下全局样式类，可以在外部覆盖：

- `.sortable-ghost`: 拖拽时的占位符样式
- `.sortable-chosen`: 被选中项的样式
- `.sortable-drag`: 拖拽中的样式
- `.sortable-fallback`: 降级模式下的样式
