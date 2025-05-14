<script setup lang="ts">
import { getComics } from '@/api/comic'
import { getImageUrl } from '@/utils/string'
import { useSettingStoreHook } from '@/store/modules/setting'
import type { Comic } from '@/api/comic'
import {
  Delete,
  Filter,
  InfoFilled,
  Picture,
  PictureRounded
} from '@element-plus/icons-vue'

// 定义接口
interface ComicsData {
  docs: Comic[];
  page: number;
  limit: number;
  pages: number;
  total: number;
}

const props = defineProps<{
  title: string
}>()

const settingStore = useSettingStoreHook()

// 使用 ref 替代 useRequest
const data = ref<ComicsData | null>(null)
const loading = ref(false)

// 计算属性：过滤后的漫画列表
const filteredComics = computed<Comic[]>(() => {
  if (!data.value?.docs) return [];

  const blockedCategories = settingStore.comic.blockedCategories || [];

  // 如果没有屏蔽的分类，直接返回原始数据
  if (blockedCategories.length === 0) return data.value.docs;

  // 过滤掉包含屏蔽分类的漫画
  return data.value.docs.filter(comic => {
    // 检查漫画的分类是否与屏蔽分类有交集
    return !comic.categories.some(category =>
      blockedCategories.includes(category)
    );
  });
});

// 计算属性：被过滤掉的漫画数量
const filteredOutCount = computed<number>(() => {
  if (!data.value?.docs) return 0;
  return data.value.docs.length - filteredComics.value.length;
});

// 获取漫画列表
async function fetchComics() {
  loading.value = true
  try {
    const result = await getComics({
      page: 1,
      c: encodeURIComponent(props.title),
      s: 'dd',
    })
    data.value = result
  } catch (error) {
    console.error('获取漫画列表失败:', error)
    ElMessage.error('获取漫画列表失败')
  } finally {
    loading.value = false
  }
}

// 分类屏蔽功能
async function handleBlockCategory(cat: string) {
  try {
    await ElMessageBox.confirm(
      `确定要屏蔽"${cat}"分类吗？`,
      '提示'
    )
    const blocked = settingStore.comic.blockedCategories
    if (blocked.includes(cat)) {
      ElMessage.warning(`分类"${cat}"已在屏蔽列表，无需重复添加。`)
      return
    }

    // 添加到屏蔽列表
    blocked.push(cat)

    // 显示成功消息
    ElMessage.success({
      message: `已屏蔽分类"${cat}"！`,
      duration: 2000
    })

    // 由于使用了计算属性，数据会自动重新过滤
    // 不需要手动调用 fetchComics
  } catch (e) {
    // 用户取消
  }
}

// 组件挂载时获取数据
onMounted(fetchComics)

// 监听标题变化，重新获取数据
watch(() => props.title, fetchComics)
</script>

<template>
  <div class="comics-list">
    <div class="comics-header">
      <el-page-header @back="$router.back()">
        <template #content>
          <span class="comics-title">{{ title }}</span>
        </template>
      </el-page-header>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="comics-loading">
      <el-skeleton :rows="5" animated />
    </div>

    <!-- 内容区域 -->
    <div v-else class="comics-container">
      <el-scrollbar>
        <!-- 无数据提示 -->
        <el-empty v-if="!data?.docs?.length" description="暂无数据" />

        <!-- 过滤信息提示 -->
        <div v-else-if="filteredOutCount && filteredOutCount > 0" class="filter-info">
          <el-alert type="info" :closable="false" show-icon>
            <template #icon>
              <el-icon>
                <InfoFilled />
              </el-icon>
            </template>
            <template #title>
              已为您过滤 <strong>{{ filteredOutCount }}</strong> 部含有屏蔽分类的漫画
            </template>
            <template #default>
              <div class="filter-actions">
                <el-button type="primary" size="small" link @click="settingStore.comic.blockedCategories = []">
                  <el-icon>
                    <Delete />
                  </el-icon> 清空屏蔽列表
                </el-button>
              </div>
            </template>
          </el-alert>
        </div>

        <!-- 漫画列表 -->
        <div v-if="filteredComics && filteredComics.length > 0" class="comics">
          <el-card v-for="item in filteredComics" :key="item.id" shadow="never" class="comic-card">
            <!-- 封面图 -->
            <el-image class="comic-image" :src="getImageUrl(item.thumb.path)" fit="cover" loading="lazy" :lazy="true">
              <template #placeholder>
                <div class="image-placeholder">
                  <el-icon>
                    <Picture />
                  </el-icon>
                </div>
              </template>
              <template #error>
                <div class="image-error">
                  <el-icon>
                    <PictureRounded />
                  </el-icon>
                </div>
              </template>
            </el-image>

            <!-- 信息区域 -->
            <div class="comic-info">
              <!-- 标题 -->
              <div class="comic-title">
                {{ item.title }}
              </div>

              <!-- 基本信息 -->
              <div class="comic-meta">
                <el-tag v-if="item.finished" type="success" size="small" effect="light" round>[完结]</el-tag>
                <span>{{ item.epsCount }} 话</span>
                <span>{{ item.pagesCount }}P</span>
              </div>

              <!-- 作者信息 -->
              <div class="comic-authors">
                <span class="comic-label">作者:</span>
                <el-link v-for="a in item.author.split('，')" :key="a" type="primary">
                  {{ a }}
                </el-link>
              </div>

              <!-- 分类标签 -->
              <div class="comic-categories">
                <el-tag v-for="cat in item.categories" :key="cat" effect="plain" size="small" closable round
                  @close="handleBlockCategory(cat)" class="comic-category-tag">
                  {{ cat }}
                </el-tag>
              </div>
            </div>
          </el-card>
        </div>

        <!-- 过滤后无数据提示 -->
        <el-empty v-else-if="filteredComics && filteredComics.length === 0 && data?.docs && data.docs.length > 0"
          description="所有漫画都包含已屏蔽的分类">
          <template #image>
            <el-icon style="font-size: 60px; color: var(--el-color-info);">
              <Filter />
            </el-icon>
          </template>
          <template #extra>
            <el-button type="primary" @click="settingStore.comic.blockedCategories = []">
              <el-icon>
                <Delete />
              </el-icon> 清空屏蔽列表
            </el-button>
          </template>
        </el-empty>
      </el-scrollbar>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.comics-list {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 1rem;
  background-color: var(--el-bg-color-page);

  @media (min-width: 768px) {
    padding: 2rem;
  }
}

.comics-header {
  margin: 1rem 0 1.5rem;
  padding: 0.75rem 1rem;
  background-color: var(--el-bg-color);
  border-radius: var(--el-border-radius-base);
  box-shadow: var(--el-box-shadow-lighter);
  display: flex;
  align-items: center;
}

.comics-title {
  font-size: var(--el-font-size-extra-large);
  font-weight: var(--el-font-weight-bold);
  margin-right: 0.75rem;
  color: var(--el-color-primary);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 40px;
    height: 3px;
    background-color: var(--el-color-primary);
    border-radius: 3px;
  }
}

.comics-loading {
  padding: 3rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  background-color: var(--el-bg-color);
  border-radius: var(--el-border-radius-base);
  box-shadow: var(--el-box-shadow-lighter);
}

.comics-container {
  flex: 1;
  overflow: hidden;
}

.filter-info {
  margin-bottom: 1.5rem;

  .el-alert {
    border-radius: var(--el-border-radius-base);
    box-shadow: var(--el-box-shadow-lighter);
  }
}

.filter-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 0.5rem;
}

.comics {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
  justify-content: center;

  @media (min-width: 640px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}

.comic-card {
  width: 100%;
  min-width: 0;
  max-width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0;
  cursor: pointer;
  overflow: hidden;
  border-radius: 12px;
  background-color: var(--el-bg-color);
  transition: all 0.3s ease;
  box-shadow: var(--el-box-shadow-lighter);
  border: 1px solid var(--el-border-color-lighter);
  position: relative;
}

.comic-image {
  width: 100%;
  aspect-ratio: 3/4;
  object-fit: cover;
  transition: transform 0.3s ease;

  .image-placeholder,
  .image-error {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--el-fill-color-light);
    color: var(--el-text-color-secondary);

    .el-icon {
      font-size: 48px;
      opacity: 0.5;
    }
  }

  .image-error {
    background-color: var(--el-fill-color);

    .el-icon {
      color: var(--el-color-danger);
    }
  }
}

.comic-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem;
  background-color: var(--el-bg-color);
  border-top: 1px solid var(--el-border-color-lighter);
}

.comic-title {
  font-weight: var(--el-font-weight-bold);
  font-size: var(--el-font-size-medium);
  margin-bottom: 0.5rem;
  color: var(--el-text-color-primary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.3s ease;
}

.comic-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  font-size: var(--el-font-size-small);
  color: var(--el-text-color-secondary);
  margin-bottom: 0.75rem;
  gap: 0.5rem;

  span {
    display: inline-flex;
    align-items: center;

    &::before {
      content: '•';
      margin-right: 0.25rem;
      color: var(--el-color-info);
    }

    &:first-child::before {
      display: none;
    }
  }
}

.comic-authors,
.comic-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.comic-label {
  color: var(--el-text-color-secondary);
  font-size: var(--el-font-size-small);
  margin-right: 0.25rem;
}

.comic-category-tag {
  font-size: var(--el-font-size-extra-small);
  border-radius: 12px;
  padding: 0 8px;
  height: 22px;
  line-height: 20px;
  transition: all 0.3s ease;
}
</style>
