# ComicList 漫画列表组件

一个功能完整的漫画列表展示组件，支持分页、筛选、排序等功能。

## 功能特性

- 🎯 **分页展示**: 支持分页加载漫画数据
- 🔍 **筛选排序**: 支持多种排序方式和筛选条件
- 💾 **稍后阅读**: 支持添加/移除稍后阅读功能
- 🏷️ **标签管理**: 支持标签点击跳转和过滤
- 📱 **响应式设计**: 自适应不同屏幕尺寸
- ⚡ **加载状态**: 美观的骨架屏加载效果
- 🎨 **空状态显示**: 数据为空时的友好提示界面

## 组件状态

### 1. 加载状态
- 显示 12 个骨架屏卡片
- 带有动画效果的渐入动画
- 使用 Motion 组件实现流畅过渡

### 2. 空状态显示 ⭐ 新增功能
当没有数据时显示友好的空状态界面：

**视觉元素**：
- 📚 书籍图标 + 动态小球动画
- 清晰的提示文字
- 操作按钮

**交互功能**：
- **重新加载**: 重新请求当前页数据
- **重置筛选**: 清除所有筛选条件并重新加载

**触发条件**：
- 非加载状态 (`!loading`)
- 漫画数据为空 (`comics.length === 0`)

### 3. 正常数据显示
- 网格布局展示漫画卡片
- 每个卡片包含封面、标题、作者、统计信息等
- 支持点击跳转到详情页

## Props

```typescript
interface ComicsListProps<T> {
  title?: string                    // 列表标题
  fetch: (params: T) => Promise<Comics['comics']>  // 数据获取函数
  params?: T                        // 请求参数
  isBlockedCategories?: boolean     // 是否过滤被屏蔽的分类
  pageSize?: number                 // 每页数据量
}
```

## 插槽

### filter 插槽
用于自定义筛选器：
```vue
<template #filter="{ handleReset }">
  <el-select v-model="customFilter" @change="handleReset">
    <!-- 自定义筛选选项 -->
  </el-select>
</template>
```

### pagination 插槽
用于自定义分页组件：
```vue
<template #pagination>
  <CustomPagination @change="handlePageChange" />
</template>
```

## 使用示例

```vue
<template>
  <ComicList
    title="热门漫画"
    :fetch="getComicsList"
    :params="{ category: 'hot' }"
    :page-size="20"
  >
    <template #filter="{ handleReset }">
      <el-select v-model="category" @change="handleReset">
        <el-option label="全部" value="" />
        <el-option label="热门" value="hot" />
        <el-option label="最新" value="new" />
      </el-select>
    </template>
  </ComicList>
</template>
```

## 空状态设计

### 视觉设计
- **图标**: 使用书籍 emoji (📚) 作为主图标
- **动画**: 
  - 主图标淡入淡出动画 (`animate-pulse`)
  - 三个彩色小球弹跳动画 (`animate-bounce`)
  - 不同延迟时间创造波浪效果

### 文案设计
- **主标题**: "暂无漫画数据"
- **副标题**: "当前筛选条件下没有找到相关漫画"
- **提示**: "请尝试调整筛选条件或稍后再试"

### 交互设计
- **重新加载按钮**: 带刷新图标，重新请求数据
- **重置筛选按钮**: 清除筛选条件，回到默认状态

## 技术实现

### 状态管理
- 使用 `useRequest` 管理数据请求状态
- 响应式计算过滤后的漫画数据
- 自动处理加载、错误状态

### 动画效果
- 骨架屏使用 Motion 组件实现渐入动画
- 空状态使用 CSS 动画实现视觉效果
- 流畅的状态切换过渡

### 性能优化
- 懒加载图片组件
- 虚拟滚动支持（通过 el-scrollbar）
- 防抖处理用户操作

## 注意事项

1. **数据过滤**: 组件会根据设置自动过滤被屏蔽的分类和作者
2. **路由跳转**: 点击漫画卡片会在新标签页打开详情页
3. **本地存储**: 稍后阅读功能依赖本地存储
4. **响应式**: 网格布局会根据容器宽度自动调整列数
