<script setup lang="ts">
import CommonPagination from '@common/components/CommonPagination/index.vue'
import { ChatLineRound, Document } from '@element-plus/icons-vue'
import { Time } from '@vicons/ionicons5'
import dayjs from 'dayjs'
import { getMyComments } from '@/api/user'
import Image from '@/components/Image/index.vue'
import { DEFAULT_PAGE_SIZE } from '@/config/pagination'
import { getImageUrl } from '@/utils/string'

const router = useRouter()

const { data, run: fetchComments, loading } = useRequest(getMyComments, {
  initialData: {
    docs: [],
    total: 0,
    page: 0,
    pages: 0,
    limit: DEFAULT_PAGE_SIZE,
  },
  defaultParams: [{
    page: 1,
  }],
})

function handlePageChange(event: { currentPage: number }) {
  if (data.value) {
    data.value.docs = []
  }

  fetchComments({
    page: event.currentPage,
  })
}

function handleComicClick(comicId: string) {
  router.push(`/comic/detail/${comicId}`)
}

function formatCommentTime(dateString: string) {
  return dayjs(dateString).format('YYYY-MM-DD HH:mm')
}

function getRelativeTime(dateString: string) {
  const now = dayjs()
  const commentTime = dayjs(dateString)
  const diffDays = now.diff(commentTime, 'day')

  if (diffDays === 0) {
    return '今天'
  }
  else if (diffDays === 1) {
    return '昨天'
  }
  else if (diffDays < 7) {
    return `${diffDays} 天前`
  }

  return commentTime.format('MM-DD')
}

function getComicCover(path?: string) {
  return path ? getImageUrl(path) : ''
}
</script>

<template>
  <main class="comments-page size-full flex-1 flex flex-col" aria-labelledby="comments-title">
    <header class="comments-header">
      <div class="header-main">
        <div class="header-icon" aria-hidden="true">
          <el-icon><ChatLineRound /></el-icon>
        </div>
        <div>
          <h1 id="comments-title">我的评论</h1>
          <p class="comments-summary" aria-live="polite">
            共 {{ data?.total || 0 }} 条评论记录
          </p>
        </div>
      </div>

      <CommonPagination
        class="comments-pagination"
        :total="data?.total || 0"
        layout="slot, ->, total, prev, pager, next, jumper"
        :page-size="DEFAULT_PAGE_SIZE"
        :disabled="loading"
        @change="handlePageChange"
      />
    </header>

    <div class="comments-scroll flex-1 overflow-hidden">
      <el-scrollbar height="100%">
        <section
          v-if="loading"
          class="comments-list"
          aria-label="评论加载中"
          aria-busy="true"
        >
          <article v-for="item in 6" :key="item" class="comment-card comment-skeleton">
            <el-skeleton animated>
              <template #template>
                <div class="skeleton-layout">
                  <el-skeleton-item variant="image" class="skeleton-cover" />
                  <div class="skeleton-copy">
                    <div class="skeleton-row">
                      <el-skeleton-item variant="h3" class="skeleton-title" />
                      <el-skeleton-item variant="text" class="skeleton-meta" />
                    </div>
                    <el-skeleton-item variant="text" class="skeleton-line" />
                    <el-skeleton-item variant="text" class="skeleton-line skeleton-line-short" />
                  </div>
                </div>
              </template>
            </el-skeleton>
          </article>
        </section>

        <section v-else-if="data?.docs?.length" class="comments-list" aria-label="评论列表">
          <article v-for="item in data.docs" :key="item._id" class="comment-card">
            <button
              class="comic-cover"
              type="button"
              :aria-label="`查看漫画：${item._comic.title}`"
              @click="handleComicClick(item._comic._id)"
            >
              <Image
                v-if="getComicCover(item._comic.thumb?.path)"
                :src="getComicCover(item._comic.thumb?.path)"
                :alt="item._comic.title"
              />
              <span v-else class="cover-placeholder" aria-hidden="true">
                <el-icon><Document /></el-icon>
              </span>
            </button>

            <div class="comment-main">
              <div class="comment-heading">
                <button class="comic-title" type="button" @click="handleComicClick(item._comic._id)">
                  {{ item._comic.title }}
                </button>
                <time class="comment-time" :datetime="item.created_at" :title="formatCommentTime(item.created_at)">
                  <el-icon aria-hidden="true"><Time /></el-icon>
                  {{ getRelativeTime(item.created_at) }}
                </time>
              </div>

              <p class="comment-content" dir="auto">{{ item.content }}</p>

              <div class="comment-actions">
                <time class="comment-date" :datetime="item.created_at">
                  {{ formatCommentTime(item.created_at) }}
                </time>
                <RouterLink
                  class="comic-link"
                  :to="`/comic/detail/${item._comic._id}`"
                >
                  查看漫画
                  <el-icon class="comic-link-icon"><Document /></el-icon>
                </RouterLink>
              </div>
            </div>
          </article>
        </section>

        <section v-else class="empty-state" aria-label="暂无评论记录">
          <el-empty :image-size="96">
            <template #description>
              <div class="empty-copy">
                <h2>还没有评论记录</h2>
                <p>读到喜欢的内容时，留下第一条评论吧。</p>
              </div>
            </template>
            <el-button type="primary" @click="router.push('/')">
              去看漫画
            </el-button>
          </el-empty>
        </section>
      </el-scrollbar>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.comments-page {
  min-width: 0;
  min-height: 100%;
  background: var(--el-bg-color-page);
}

.comments-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 24px clamp(20px, 4vw, 48px) 20px;
  background: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.header-main,
.comment-heading,
.comment-actions,
.skeleton-row,
.skeleton-layout {
  display: flex;
  align-items: center;
}

.header-main {
  gap: 12px;
  min-width: 0;
}

.header-icon {
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
}

.header-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  font-size: 21px;
}

h1,
h2,
p {
  margin: 0;
}

h1 {
  color: var(--el-text-color-primary);
  font-size: 1.375rem;
  font-weight: 650;
  line-height: 1.25;
}

.comments-summary {
  margin-top: 4px;
  color: var(--el-text-color-secondary);
  font-size: 0.8125rem;
  line-height: 1.4;
}

.comments-pagination {
  flex: 0 1 auto;
  min-width: 0;
}

.comments-scroll {
  min-height: 0;
  min-width: 0;
  container-type: inline-size;
}

.comments-list {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  box-sizing: border-box;
  width: min(100%, 1280px);
  gap: 16px;
  justify-content: start;
  margin-inline: auto;
  padding: 20px 24px 36px;
}

.comments-list:has(.comment-card:nth-child(3)) {
  justify-content: center;
}

.comment-card {
  --comment-cover-height: 150px;

  display: grid;
  grid-template-columns: 104px minmax(0, 1fr);
  gap: 16px;
  min-height: 174px;
  padding: 12px;
  overflow: hidden;
  min-width: 0;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  box-shadow: var(--el-box-shadow-light);
  transition: border-color 160ms ease, box-shadow 160ms ease;
}

.comment-card:hover,
.comment-card:focus-within {
  border-color: var(--el-color-primary);
  box-shadow: var(--el-box-shadow);
}

.comic-cover {
  width: 104px;
  min-height: var(--comment-cover-height);
  padding: 0;
  overflow: hidden;
  background: var(--el-fill-color-light);
  border: 0;
  border-radius: 5px;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid var(--el-color-primary);
    outline-offset: 3px;
  }

  :deep(.el-image),
  :deep(.el-image__inner) {
    width: 100%;
    height: 100%;
  }

  :deep(> div) {
    height: 100%;
  }
}

.cover-placeholder {
  display: grid;
  width: 100%;
  height: 100%;
  min-height: var(--comment-cover-height);
  place-items: center;
  color: var(--el-text-color-secondary);
  font-size: 24px;
  background: var(--el-fill-color-light);
}

.comment-main {
  display: flex;
  flex-direction: column;
  min-height: var(--comment-cover-height);
  min-width: 0;
}

@container (min-width: 28rem) {
  .comments-list {
    grid-template-columns: 400px;
  }
}

@container (min-width: 54rem) {
  .comments-list {
    grid-template-columns: repeat(2, 400px);
  }
}

@container (min-width: 80rem) {
  .comments-list {
    grid-template-columns: repeat(3, 400px);
  }
}

.comment-heading {
  justify-content: space-between;
  gap: 16px;
}

.comic-title {
  padding: 0;
  overflow: hidden;
  color: var(--el-text-color-primary);
  font: inherit;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.45;
  text-align: start;
  text-overflow: ellipsis;
  white-space: nowrap;
  background: transparent;
  border: 0;
  cursor: pointer;
  transition: color 160ms ease;

  &:hover,
  &:focus-visible {
    color: var(--el-color-primary);
  }

  &:focus-visible {
    border-radius: 2px;
    outline: 2px solid var(--el-color-primary);
    outline-offset: 3px;
  }
}

.comment-time,
.comment-date {
  flex: 0 0 auto;
  color: var(--el-text-color-secondary);
  font-size: 0.75rem;
  line-height: 1.5;
  white-space: nowrap;
}

.comment-time {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.comment-content {
  display: -webkit-box;
  overflow: hidden;
  margin-top: 10px;
  overflow-wrap: anywhere;
  color: var(--el-text-color-regular);
  font-size: 0.9375rem;
  line-height: 1.75;
  white-space: pre-line;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.comment-actions {
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-top: auto;
  padding-top: 12px;
}

.comic-link {
  display: inline-flex;
  align-items: center;
  height: auto;
  min-height: 0;
  padding: 0;
  color: var(--el-color-primary);
  font-size: 0.8125rem;
  line-height: 1.5;
  text-decoration: none;

  &:hover,
  &:focus-visible {
    color: var(--el-color-primary-light-3);
  }

  &:focus-visible {
    border-radius: 2px;
    outline: 2px solid var(--el-color-primary);
    outline-offset: 3px;
  }
}

.comic-link-icon {
  margin-inline-start: 4px;
}

.comment-skeleton {
  display: block;
}

.skeleton-row {
  justify-content: space-between;
  gap: 12px;
}

.skeleton-layout {
  align-items: stretch;
  gap: 16px;
}

.skeleton-cover {
  width: 104px;
  height: 150px;
  flex: 0 0 auto;
}

.skeleton-copy {
  display: grid;
  gap: 8px;
  flex: 1;
}

.skeleton-title {
  width: min(45%, 260px);
}

.skeleton-meta {
  width: 96px;
}

.skeleton-line {
  width: 100%;
  margin-top: 16px;
}

.skeleton-line-short {
  width: 56%;
  margin-top: 8px;
}

.empty-state {
  display: grid;
  min-height: min(480px, calc(100vh - 180px));
  place-items: center;
  padding: 32px 24px;
}

.empty-copy h2 {
  color: var(--el-text-color-primary);
  font-size: 1.125rem;
  font-weight: 600;
}

.empty-copy p {
  max-width: 22rem;
  margin-top: 8px;
  color: var(--el-text-color-secondary);
  font-size: 0.875rem;
  line-height: 1.6;
}

@media (max-width: 48rem) {
  .comments-header {
    align-items: flex-start;
    flex-direction: column;
    gap: 16px;
    padding: 20px 16px 16px;
  }

  .comments-pagination {
    width: 100%;
    overflow-x: auto;
  }

  .comments-list {
    padding: 16px 16px 28px;
  }

  .comment-card {
    --comment-cover-height: 122px;

    grid-template-columns: 88px minmax(0, 1fr);
    gap: 12px;
    min-height: 142px;
    padding: 10px;
  }

  .comic-cover,
  .skeleton-cover {
    width: 88px;
    min-height: var(--comment-cover-height);
    height: var(--comment-cover-height);
  }

  .cover-placeholder {
    min-height: var(--comment-cover-height);
  }

  .comment-heading {
    align-items: flex-start;
    flex-direction: column;
    gap: 4px;
  }

  .comic-title {
    width: 100%;
  }

  .comment-content {
    margin-top: 8px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .comic-title,
  .comment-card {
    transition: none;
  }
}
</style>
