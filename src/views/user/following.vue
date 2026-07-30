<script setup lang="ts">
import { Close, Search, UserFilled } from '@element-plus/icons-vue'
import { ElButton, ElMessage } from 'element-plus'
import Author from '@/components/Author/index.vue'

const localStore = useLocalStoreHook()
const router = useRouter()

const keyword = ref('')
const sortBy = ref<'followed' | 'name'>('followed')

const followedAuthors = computed(() => localStore.local.FOLLOW_AUTHOR_LIST)
const filteredAuthors = computed(() => {
  const normalizedKeyword = keyword.value.trim().toLocaleLowerCase()

  return followedAuthors.value.filter((author) => {
    return !normalizedKeyword || author.toLocaleLowerCase().includes(normalizedKeyword)
  })
})
const visibleAuthors = computed(() => {
  const authors = [...filteredAuthors.value]

  return sortBy.value === 'name'
    ? authors.sort((first, second) => first.localeCompare(second, 'zh-CN'))
    : authors
})

async function handleUnfollow(authorName: string) {
  try {
    await ElMessageBox.confirm(`确定取消关注 ${authorName} 吗？`, '取消关注', {
      confirmButtonText: '取消关注',
      cancelButtonText: '保留关注',
      type: 'warning',
    })
  }
  catch {
    return
  }

  localStore.removeItem('FOLLOW_AUTHOR_LIST', authorName)
  ElMessage.success(`已取消关注 ${authorName}`)
}

function discoverAuthors() {
  router.push('/comic/list')
}
</script>

<template>
  <main class="following-page">
    <header class="following-page__header">
      <div>
        <h1>我的关注</h1>
        <p aria-live="polite">
          已关注 {{ followedAuthors.length }} 位作者
        </p>
      </div>

      <div v-if="followedAuthors.length > 0" class="following-page__tools">
        <el-input
          v-model="keyword"
          class="following-page__search"
          clearable
          placeholder="搜索作者"
          aria-label="搜索作者"
          :prefix-icon="Search"
        />
        <el-select v-model="sortBy" aria-label="关注列表排序">
          <el-option label="按关注顺序" value="followed" />
          <el-option label="按名称排序" value="name" />
        </el-select>
      </div>
    </header>

    <section v-if="followedAuthors.length > 0" aria-labelledby="following-list-title">
      <h2 id="following-list-title" class="sr-only">
        关注的作者
      </h2>

      <ul v-if="visibleAuthors.length > 0" class="author-list">
        <li v-for="author in visibleAuthors" :key="author" class="author-card">
          <el-avatar :size="44" :icon="UserFilled" />
          <div class="author-card__content">
            <Author :author="author" :show-menus="false" />
            <span>点击查看作者作品</span>
          </div>
          <el-tooltip content="取消关注" placement="top">
            <ElButton
              aria-label="取消关注"
              class="author-card__remove"
              circle
              :icon="Close"
              text
              type="danger"
              @click="handleUnfollow(author)"
            />
          </el-tooltip>
        </li>
      </ul>

      <el-empty v-else description="未找到匹配的作者" :image-size="120">
        <ElButton @click="keyword = ''">
          清除搜索条件
        </ElButton>
      </el-empty>
    </section>

    <section v-else class="following-page__empty" aria-labelledby="empty-following-title">
      <el-empty :image-size="160">
        <template #description>
          <div>
            <h2 id="empty-following-title">
              暂无关注作者
            </h2>
            <p>关注喜欢的作者后，会在这里统一管理。</p>
          </div>
        </template>
        <ElButton type="primary" @click="discoverAuthors">
          去发现作者
        </ElButton>
      </el-empty>
    </section>
  </main>
</template>

<style scoped>
.following-page {
  min-block-size: 25rem;
}

.following-page__header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  margin-block-end: 1.5rem;
}

h1,
h2,
p {
  margin: 0;
}

h1 {
  color: var(--el-text-color-primary);
  font-size: 1.5rem;
  line-height: 1.25;
}

.following-page__header p,
.author-card__content span,
.following-page__empty p {
  color: var(--el-text-color-secondary);
  font-size: 0.875rem;
  line-height: 1.5;
}

.following-page__header p {
  margin-block-start: 0.375rem;
}

.following-page__tools {
  display: flex;
  flex: 1 1 24rem;
  justify-content: flex-end;
  gap: 0.75rem;
  max-inline-size: 34rem;
}

.following-page__search {
  min-inline-size: 12rem;
}

.author-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 16rem), 1fr));
  gap: 0.75rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.author-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-inline-size: 0;
  padding: 0.75rem;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 0.5rem;
  background: var(--el-bg-color);
  transition: border-color 150ms ease, box-shadow 150ms ease, transform 150ms ease;
}

.author-card:hover,
.author-card:focus-within {
  border-color: var(--el-color-primary-light-5);
  box-shadow: var(--el-box-shadow-light);
  transform: translateY(-1px);
}

.author-card__content {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-inline-size: 0;
  gap: 0.25rem;
}

.author-card__content :deep(.el-link) {
  align-self: flex-start;
  max-inline-size: 100%;
  overflow: hidden;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.author-card__remove {
  flex: 0 0 auto;
  inline-size: 2.75rem;
  block-size: 2.75rem;
}

.following-page__empty :deep(.el-empty) {
  min-block-size: 22rem;
}

.following-page__empty h2 {
  color: var(--el-text-color-primary);
  font-size: 1rem;
  font-weight: 600;
}

.following-page__empty p {
  margin-block-start: 0.5rem;
}

@media (max-width: 40rem) {
  .following-page__header,
  .following-page__tools {
    align-items: stretch;
    flex-direction: column;
  }

  .following-page__tools {
    max-inline-size: none;
  }

  .following-page__search {
    min-inline-size: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .author-card {
    transition: none;
  }
}
</style>
