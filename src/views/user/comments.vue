<script setup lang="ts">
import CommonPagination from '@common/components/CommonPagination/index.vue'
import { ChatLineRound, Document } from '@element-plus/icons-vue'
import { Time } from '@vicons/ionicons5'
import dayjs from 'dayjs'
import { Motion } from 'motion-v'
import { getMyComments } from '@/api/user'
import { DEFAULT_PAGE_SIZE } from '@/config/pagination'

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
  // 清空当前数据，显示加载状态
  if (data.value) {
    data.value.docs = []
  }
  fetchComments({
    page: event.currentPage,
  })
}

/**
 * 处理漫画点击事件
 * @param comicId 漫画ID
 */
function handleComicClick(comicId: string) {
  router.push(`/comic/detail/${comicId}`)
}

/**
 * 格式化评论时间
 * @param dateString 时间字符串
 */
function formatCommentTime(dateString: string) {
  return dayjs(dateString).format('YYYY-MM-DD HH:mm')
}

/**
 * 获取相对时间
 * @param dateString 时间字符串
 */
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
    return `${diffDays}天前`
  }
  else {
    return commentTime.format('MM-DD')
  }
}
</script>

<template>
  <div class="comments-page size-full flex-1 flex flex-col">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-title">
          <el-icon class="title-icon">
            <ChatLineRound />
          </el-icon>
          <h1>我的评论</h1>
        </div>

        <CommonPagination
          :total="data?.total || 0"
          layout="slot, ->, total, prev, pager, next, jumper" :page-size="DEFAULT_PAGE_SIZE" :disabled="loading"
          @change="handlePageChange"
        />
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="h-full flex-1 overflow-hidden">
      <el-scrollbar height="100%">
        <div class="w-full h-6px" />

        <!-- 加载状态骨架屏 -->
        <div v-if="loading" class="comments-container">
          <Motion
            v-for="(i, index) in 8" :key="i"
            :initial="{ opacity: 0, y: 20, scale: 0.95 }"
            :animate="{ opacity: 1, y: 0, scale: 1 }"
            :transition="{
              duration: 0.4,
              delay: index * 0.05,
              ease: 'easeOut',
            }"
          >
            <div class="comment-card skeleton-card">
              <el-skeleton :loading="true" animated>
                <template #template>
                  <div class="skeleton-content">
                    <!-- 头部骨架 -->
                    <div class="skeleton-header">
                      <el-skeleton-item variant="circle" class="w-10 h-10" />
                      <div class="skeleton-info">
                        <el-skeleton-item variant="h3" class="w-48 mb-2" />
                        <el-skeleton-item variant="text" class="w-32" />
                      </div>
                    </div>
                    <!-- 内容骨架 -->
                    <div class="skeleton-body">
                      <el-skeleton-item variant="text" class="w-full mb-2" />
                      <el-skeleton-item variant="text" class="w-4/5 mb-2" />
                      <el-skeleton-item variant="text" class="w-3/5" />
                    </div>
                    <!-- 底部骨架 -->
                    <div class="skeleton-footer">
                      <el-skeleton-item variant="button" class="w-20 h-8" />
                    </div>
                  </div>
                </template>
              </el-skeleton>
            </div>
          </Motion>
        </div>

        <!-- 评论列表 -->
        <div v-else-if="data?.docs && data.docs.length > 0" class="comments-container">
          <Motion
            v-for="(item, index) in data.docs" :key="item._id"
            :initial="{ opacity: 0, y: 30, scale: 0.95 }"
            :animate="{ opacity: 1, y: 0, scale: 1 }"
            :transition="{
              duration: 0.5,
              delay: index * 0.08,
              ease: 'backOut',
            }"
          >
            <div class="comment-card">
              <!-- 评论头部 -->
              <div class="comment-header">
                <div class="comic-info">
                  <div class="comic-icon">
                    <el-icon class="text-20px">
                      <Document />
                    </el-icon>
                  </div>
                  <div class="comic-details">
                    <h3 class="comic-title" @click="handleComicClick(item._comic._id)">
                      {{ item._comic.title }}
                    </h3>
                    <div class="comment-meta">
                      <div class="time-info">
                        <el-icon class="text-12px">
                          <Time />
                        </el-icon>
                        <span class="relative-time">{{ getRelativeTime(item.created_at) }}</span>
                        <span class="exact-time">{{ formatCommentTime(item.created_at) }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 评论ID标识 -->
                <div class="comment-id">
                  #{{ item._id.slice(-6) }}
                </div>
              </div>

              <!-- 评论内容 -->
              <div class="comment-body">
                <div class="comment-content">
                  <div class="quote-mark">💬</div>
                  <div class="comment-text">
                    {{ item.content }}
                  </div>
                </div>
              </div>

              <!-- 评论底部 -->
              <div class="comment-footer">
                <div class="footer-actions">
                  <el-button
                    type="primary"
                    size="small"
                    class="view-comic-btn"
                    @click="handleComicClick(item._comic._id)"
                  >
                    <el-icon class="mr-1">
                      <Document />
                    </el-icon>
                    查看漫画
                  </el-button>
                </div>
              </div>
            </div>
          </Motion>
        </div>

        <!-- 空状态 -->
        <div v-else-if="!loading" class="empty-state">
          <div class="empty-content">
            <div class="empty-icon">
              <el-icon class="text-60px">
                <ChatLineRound />
              </el-icon>
            </div>

            <div class="empty-text">
              <h3>还没有评论记录</h3>
              <p>快去看看喜欢的漫画，发表你的第一条评论吧！</p>
            </div>

            <div class="empty-actions">
              <el-button type="primary" size="large" @click="router.push('/')">
                <el-icon class="mr-2">
                  <Document />
                </el-icon>
                去看漫画
              </el-button>
            </div>
          </div>
        </div>

        <div class="w-full h-6px" />
      </el-scrollbar>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.comments-page {
  background: linear-gradient(135deg, var(--el-fill-color-extra-light) 0%, var(--el-bg-color-page) 100%);
  min-height: 100vh;
}

/* 页面头部样式 */
.page-header {
  padding: 20px 24px;
  margin-bottom: 24px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 12px;

  .title-icon {
    font-size: 24px;
    color: var(--el-color-primary);
  }

  h1 {
    font-size: 24px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    margin: 0;
  }
}

/* 评论容器 */
.comments-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0 24px;
  max-width: 800px;
  margin: 0 auto;
}

/* 评论卡片 */
.comment-card {
  background: var(--el-bg-color);
  border-radius: 12px;
  border: 1px solid var(--el-border-color-light);
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    border-color: var(--el-color-primary-light-7);
  }
}

/* 骨架屏卡片 */
.skeleton-card {
  &:hover {
    transform: none;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  }
}

.skeleton-content {
  padding: 20px;
}

.skeleton-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.skeleton-info {
  flex: 1;
}

.skeleton-body {
  margin-bottom: 16px;
}

.skeleton-footer {
  display: flex;
  justify-content: flex-end;
}

/* 评论头部 */
.comment-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.comic-info {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex: 1;
}

.comic-icon {
  width: 32px;
  height: 32px;
  background: var(--el-color-primary-light-9);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--el-color-primary);
  flex-shrink: 0;
  font-size: 16px;
}

.comic-details {
  flex: 1;
  min-width: 0;
}

.comic-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  cursor: pointer;
  transition: color 0.3s ease;
  line-height: 1.4;
  margin: 0 0 6px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  &:hover {
    color: var(--el-color-primary);
  }
}

.comment-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.time-info {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--el-text-color-secondary);

  .relative-time {
    font-weight: 500;
  }

  .exact-time {
    opacity: 0.7;
  }
}

.comment-id {
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 500;
  font-family: monospace;
}

/* 评论内容区域 */
.comment-body {
  padding: 16px 20px;
}

.comment-content {
  background: var(--el-fill-color-lighter);
  border-radius: 8px;
  padding: 16px;
  position: relative;
}

.quote-mark {
  position: absolute;
  top: -6px;
  left: 12px;
  font-size: 16px;
  background: var(--el-bg-color);
  padding: 2px 6px;
  border-radius: 50%;
}

.comment-text {
  font-size: 14px;
  line-height: 1.6;
  color: var(--el-text-color-primary);
  word-break: break-word;
  white-space: pre-wrap;
  margin: 0;
}

/* 评论底部 */
.comment-footer {
  padding: 12px 20px 16px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.footer-actions {
  display: flex;
  gap: 8px;
}

.view-comic-btn {
  font-size: 13px;
  padding: 6px 12px;
  border-radius: 6px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
  }
}

/* 空状态 */
.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  padding: 40px 24px;
}

.empty-content {
  text-align: center;
  max-width: 320px;
}

.empty-icon {
  margin-bottom: 24px;
}

.icon-wrapper {
  display: inline-block;
}

.icon-wrapper .el-icon {
  color: var(--el-text-color-secondary);
  opacity: 0.6;
}

.empty-text {
  margin-bottom: 24px;

  h3 {
    font-size: 18px;
    font-weight: 500;
    color: var(--el-text-color-primary);
    margin: 0 0 8px 0;
  }

  p {
    font-size: 14px;
    color: var(--el-text-color-secondary);
    line-height: 1.5;
    margin: 0;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .comments-container {
    padding: 0 16px;
  }

  .page-header {
    padding: 16px;
    margin-bottom: 16px;
  }

  .header-content {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .comment-header {
    padding: 12px 16px;
  }

  .comment-body {
    padding: 12px 16px;
  }

  .comment-footer {
    padding: 8px 16px 12px;
  }

  .empty-state {
    padding: 32px 16px;
  }
}
</style>
