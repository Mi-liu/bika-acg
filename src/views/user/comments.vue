<script setup lang="ts">
import CommonPagination from '@common/components/CommonPagination/index.vue'
import { ChatLineRound, Document } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import { cardAnimations } from '@/animations/cardAnimation'
import { getMyComments } from '@/api/user'
import { DEFAULT_PAGE_SIZE } from '@/config/pagination'
import '@/animations/cardAnimation.scss'

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

const CommonPaginationRef = useTemplateRef('CommonPaginationRef')

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
  const url = router.resolve(`/comic/detail/${comicId}`).href
  window.open(url, '_blank')
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

// 选择动画效果
const animation = cardAnimations.leftToRight
</script>

<template>
  <div class="comments-page size-full flex-1 flex flex-col">
    <!-- 页面头部 -->
    <div class="flex px py">
      <div class="size-full flex justify-between">
        <div class="text-18px flex items-center gap-2">
          <el-icon class="text-[--el-color-primary]">
            <ChatLineRound />
          </el-icon>
          我的评论
        </div>
      </div>
      <CommonPagination
        ref="CommonPaginationRef" :total="data?.total || 0"
        layout="slot, ->, total, prev, pager, next, jumper" :page-size="DEFAULT_PAGE_SIZE" :disabled="loading"
        @change="handlePageChange"
      />
    </div>

    <!-- 内容区域 -->
    <div class="h-full flex-1 overflow-hidden">
      <el-scrollbar height="100%">
        <div class="w-full h-6px" />

        <!-- 加载状态骨架屏 -->
        <div
          v-if="loading" class="card-animation-grid comment-grid"
          style="grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 20px;"
        >
          <el-skeleton
            v-for="i in 6" :key="i" class="comment-card"
            :loading="true"
          >
            <template #template>
              <div class="p-4">
                <div class="flex items-center gap-3 mb-3">
                  <el-skeleton-item variant="circle" class="w-8 h-8" />
                  <div class="flex-1">
                    <el-skeleton-item variant="h3" class="w-60% mb-1" />
                    <el-skeleton-item variant="text" class="w-40%" />
                  </div>
                </div>
                <el-skeleton-item variant="text" class="w-full mb-2" />
                <el-skeleton-item variant="text" class="w-80% mb-2" />
                <el-skeleton-item variant="text" class="w-60%" />
              </div>
            </template>
          </el-skeleton>
        </div>

        <!-- 评论列表 -->
        <TransitionGroup
          v-else-if="data?.docs && data.docs.length > 0" tag="div"
          class="card-animation-grid comment-grid"
          style="grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 20px;" :css="false"
          @before-enter="animation.onBeforeEnter" @enter="animation.onEnter" @leave="animation.onLeave"
          @move="animation.onMove"
        >
          <div v-for="item in data.docs" :key="item._id" class="comment-card">
            <!-- 评论头部 -->
            <div class="comment-header">
              <div class="flex items-center gap-3">
                <el-icon class="text-[--el-color-primary] text-20px">
                  <Document />
                </el-icon>
                <div class="flex-1">
                  <div class="comment-comic-title" @click="handleComicClick(item._comic._id)">
                    {{ item._comic.title }}
                  </div>
                  <div class="comment-time text-[--el-text-color-secondary]">
                    {{ formatCommentTime(item.created_at) }}
                  </div>
                </div>
              </div>
            </div>

            <!-- 评论内容 -->
            <div class="comment-content">
              <div class="comment-text">
                {{ item.content }}
              </div>
            </div>

            <!-- 评论底部操作 -->
            <div class="comment-footer">
              <el-button
                type="primary" link size="small"
                @click="handleComicClick(item._comic._id)"
              >
                查看漫画
              </el-button>
            </div>
          </div>
        </TransitionGroup>

        <!-- 空状态 -->
        <div v-else-if="!loading" class="empty-state">
          <el-empty description="暂无评论记录">
            <template #image>
              <el-icon class="text-60px text-[--el-text-color-secondary]">
                <ChatLineRound />
              </el-icon>
            </template>
            <el-button type="primary" @click="router.push('/')">
              去看看漫画
            </el-button>
          </el-empty>
        </div>

        <div class="w-full h-6px" />
      </el-scrollbar>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.comments-page {
  background-color: var(--el-bg-color-page);
}

.comment-grid {
  padding: 0 20px;
  justify-content: center;
}

.comment-card {
  background: var(--el-bg-color);
  border-radius: 12px;
  border: 1px solid var(--el-border-color-light);
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    border-color: var(--el-color-primary-light-7);
  }
}

.comment-header {
  padding: 16px 20px 12px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  background: linear-gradient(135deg, var(--el-color-primary-light-9) 0%, var(--el-bg-color) 100%);
}

.comment-comic-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  cursor: pointer;
  transition: color 0.3s ease;
  line-height: 1.4;
  margin-bottom: 4px;

  &:hover {
    color: var(--el-color-primary);
  }
}

.comment-time {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--el-text-color-regular);

  span:last-child {
    margin-left: 8px;
  }
}

.comment-content {
  padding: 16px 20px;
}

.comment-text {
  font-size: 14px;
  line-height: 1.6;
  color: var(--el-text-color-primary);
  word-break: break-word;
  white-space: pre-wrap;
  background: var(--el-fill-color-lighter);
  padding: 12px 16px;
  border-radius: 8px;
  border-left: 3px solid var(--el-color-primary);
  position: relative;

  &::before {
    content: '"';
    position: absolute;
    top: -2px;
    left: 8px;
    font-size: 20px;
    color: var(--el-color-primary);
    font-weight: bold;
  }

  &::after {
    content: '"';
    position: absolute;
    bottom: -8px;
    right: 8px;
    font-size: 20px;
    color: var(--el-color-primary);
    font-weight: bold;
  }
}

.comment-footer {
  padding: 12px 20px 16px;
  display: flex;
  justify-content: flex-end;
  background: var(--el-fill-color-extra-light);
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  padding: 40px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .comment-grid {
    padding: 0 12px;
    grid-template-columns: 1fr !important;
  }

  .comment-card {
    border-radius: 8px;
  }

  .comment-header,
  .comment-content,
  .comment-footer {
    padding-left: 16px;
    padding-right: 16px;
  }

  .comment-comic-title {
    font-size: 15px;
  }

  .comment-text {
    font-size: 13px;
    padding: 10px 12px;
  }
}

/* 暗色主题适配 */
@media (prefers-color-scheme: dark) {
  .comment-card {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

    &:hover {
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    }
  }

  .comment-header {
    background: linear-gradient(135deg, var(--el-color-primary-dark-2) 0%, var(--el-bg-color) 100%);
  }
}
</style>
