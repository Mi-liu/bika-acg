<script setup lang="ts">
import type { ComicComment, ComicCommentsPage } from '@/api/comic'
import CommonPagination from '@common/components/CommonPagination/index.vue'
import { ArrowLeft, ChatLineRound, StarFilled } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import { createComicComment, createCommentReply, getComicComments, getCommentChildren } from '@/api/comic'
import { getImageUrl } from '@/utils/string'

const props = defineProps<{
  comicId: string
}>()

const emit = defineEmits<{
  submitted: []
}>()

const visible = defineModel<boolean>('visible', {
  default: false,
})

const commentContent = ref('')
const replyContent = ref('')
const submitting = ref(false)
const replySubmitting = ref(false)
const comments = ref<ComicComment[]>([])
const topComments = ref<ComicComment[]>([])
const activeComment = ref<ComicComment>()
const childComments = ref<ComicComment[]>([])
const expandedCommentIds = ref(new Set<string>())
const expandedChildCommentIds = ref(new Set<string>())
const loading = ref(false)
const initialized = ref(false)
const childLoading = ref(false)
const childInitialized = ref(false)

const pageInfo = reactive<Omit<ComicCommentsPage, 'docs'>>({
  page: 1,
  pages: 1,
  limit: 20,
  total: 0,
})
const childPageInfo = reactive<Omit<ComicCommentsPage, 'docs'>>({
  page: 1,
  pages: 1,
  limit: 5,
  total: 0,
})

const isViewingReplies = computed(() => Boolean(activeComment.value))
const topCommentIds = computed(() => new Set(topComments.value.map(comment => comment._id)))
const visibleComments = computed(() => {
  return comments.value.filter(comment => !topCommentIds.value.has(comment._id))
})
const hasComments = computed(() => topComments.value.length > 0 || visibleComments.value.length > 0)
const showSkeleton = computed(() => loading.value && (!initialized.value || !hasComments.value))
const showChildSkeleton = computed(() => childLoading.value && (!childInitialized.value || childComments.value.length === 0))
const canSubmitComment = computed(() => {
  return Boolean(props.comicId) && commentContent.value.trim().length > 0 && !submitting.value && !loading.value
})
const canSubmitReply = computed(() => {
  return Boolean(activeComment.value)
    && replyContent.value.trim().length > 0
    && !replySubmitting.value
    && !childLoading.value
})

function resetComments() {
  replyContent.value = ''
  comments.value = []
  topComments.value = []
  activeComment.value = undefined
  childComments.value = []
  expandedCommentIds.value = new Set()
  expandedChildCommentIds.value = new Set()
  Object.assign(pageInfo, {
    page: 1,
    pages: 1,
    limit: 20,
    total: 0,
  })
  Object.assign(childPageInfo, {
    page: 1,
    pages: 1,
    limit: 5,
    total: 0,
  })
}

async function fetchComments(page = 1) {
  if (loading.value) {
    return
  }

  loading.value = true

  try {
    const res = await getComicComments(props.comicId, page)
    topComments.value = res.topComments || []
    comments.value = res.comments.docs
    Object.assign(pageInfo, {
      page: Number(res.comments.page),
      pages: res.comments.pages,
      limit: res.comments.limit,
      total: res.comments.total,
    })
  }
  catch (error) {
    console.error('评论加载失败:', error)
    ElMessage.error('评论加载失败，请稍后重试')
  }
  finally {
    loading.value = false
    initialized.value = true
  }
}

async function submitComment() {
  const content = commentContent.value.trim()
  if (!props.comicId || !content || submitting.value) {
    return
  }

  submitting.value = true

  try {
    await createComicComment(props.comicId, content)
    ElMessage.success('评论发表成功')
    commentContent.value = ''
    backToComments()
    comments.value = []
    topComments.value = []
    expandedCommentIds.value = new Set()
    initialized.value = false
    emit('submitted')
    await fetchComments(1)
  }
  catch (error) {
    console.error('评论发表失败:', error)
    ElMessage.error('评论发表失败，请稍后重试')
  }
  finally {
    submitting.value = false
  }
}

async function submitReply() {
  const comment = activeComment.value
  const content = replyContent.value.trim()
  if (!comment || !content || replySubmitting.value) {
    return
  }

  replySubmitting.value = true

  try {
    await createCommentReply(comment._id, content)
    ElMessage.success('回复发表成功')
    replyContent.value = ''
    increaseReplyCount(comment)
    childComments.value = []
    expandedChildCommentIds.value = new Set()
    childInitialized.value = false
    await fetchCommentChildren(comment._id, 1)
  }
  catch (error) {
    console.error('回复发表失败:', error)
    ElMessage.error('回复发表失败，请稍后重试')
  }
  finally {
    replySubmitting.value = false
  }
}

function handlePageChange(event: { currentPage: number }) {
  comments.value = []
  topComments.value = []
  expandedCommentIds.value = new Set()
  fetchComments(event.currentPage)
}

async function fetchCommentChildren(commentId: string, page = 1) {
  if (childLoading.value) {
    return
  }

  childLoading.value = true

  try {
    const res = await getCommentChildren(commentId, page)
    childComments.value = res.comments.docs
    Object.assign(childPageInfo, {
      page: Number(res.comments.page),
      pages: res.comments.pages,
      limit: res.comments.limit,
      total: res.comments.total,
    })
  }
  catch (error) {
    console.error('回复加载失败:', error)
    ElMessage.error('回复加载失败，请稍后重试')
  }
  finally {
    childLoading.value = false
    childInitialized.value = true
  }
}

function handleReplyPageChange(event: { currentPage: number }) {
  if (!activeComment.value) {
    return
  }

  childComments.value = []
  expandedChildCommentIds.value = new Set()
  fetchCommentChildren(activeComment.value._id, event.currentPage)
}

function openReplies(comment: ComicComment) {
  activeComment.value = comment
  replyContent.value = ''
  childComments.value = []
  expandedChildCommentIds.value = new Set()
  childInitialized.value = false
  Object.assign(childPageInfo, {
    page: 1,
    pages: 1,
    limit: 5,
    total: getReplyCount(comment),
  })
  fetchCommentChildren(comment._id, 1)
}

function backToComments() {
  activeComment.value = undefined
  replyContent.value = ''
  childComments.value = []
  expandedChildCommentIds.value = new Set()
  childInitialized.value = false
}

function toggleCommentExpanded(commentId: string) {
  const next = new Set(expandedCommentIds.value)
  if (next.has(commentId)) {
    next.delete(commentId)
  }
  else {
    next.add(commentId)
  }

  expandedCommentIds.value = next
}

function isCommentExpanded(commentId: string) {
  return expandedCommentIds.value.has(commentId)
}

function toggleChildCommentExpanded(commentId: string) {
  const next = new Set(expandedChildCommentIds.value)
  if (next.has(commentId)) {
    next.delete(commentId)
  }
  else {
    next.add(commentId)
  }

  expandedChildCommentIds.value = next
}

function isChildCommentExpanded(commentId: string) {
  return expandedChildCommentIds.value.has(commentId)
}

function getReplyCount(comment: ComicComment) {
  return comment.commentsCount ?? comment.totalComments ?? 0
}

function increaseReplyCount(comment: ComicComment) {
  if (comment.commentsCount !== undefined) {
    comment.commentsCount += 1
    return
  }

  comment.totalComments += 1
}

function shouldShowExpand(content: string) {
  return content.length > 120 || content.includes('\n')
}

function formatCommentTime(dateString: string) {
  return dayjs(dateString).format('YYYY-MM-DD HH:mm')
}

function getAvatarUrl(comment: ComicComment) {
  const path = comment._user.avatar?.path
  return path ? getImageUrl(path) : ''
}

watch(
  () => props.comicId,
  () => {
    resetComments()
    initialized.value = false
    if (visible.value) {
      fetchComments(1)
    }
  },
)

watch(visible, (isVisible) => {
  if (isVisible && !initialized.value) {
    fetchComments(1)
  }
  if (!isVisible) {
    backToComments()
  }
})
</script>

<template>
  <el-drawer
    v-model="visible"
    class="comic-comments-drawer"
    direction="rtl"
    size="min(560px, 92vw)"
  >
    <template #header>
      <div class="flex items-center gap-2">
        <el-icon>
          <ChatLineRound />
        </el-icon>
        <span class="text-18px font-bold">{{ isViewingReplies ? '回复' : '评论' }}</span>
        <span class="text-13px font-normal color-[--el-text-color-secondary]">
          {{ isViewingReplies ? childPageInfo.total : pageInfo.total }}
        </span>
      </div>
    </template>

    <div class="comment-drawer-body">
      <form v-if="!isViewingReplies" class="comment-compose" @submit.prevent="submitComment">
        <el-input
          v-model="commentContent"
          type="textarea"
          maxlength="500"
          show-word-limit
          resize="none"
          placeholder="说点什么..."
          :autosize="{ minRows: 3, maxRows: 5 }"
          :disabled="submitting"
          @keydown.ctrl.enter.prevent="submitComment"
        />
        <div class="comment-compose-actions">
          <span class="comment-compose-tip">Ctrl + Enter 发表</span>
          <el-button
            type="primary"
            native-type="submit"
            :loading="submitting"
            :disabled="!canSubmitComment"
          >
            发表评论
          </el-button>
        </div>
      </form>

      <form v-else-if="activeComment" class="comment-compose" @submit.prevent="submitReply">
        <el-input
          v-model="replyContent"
          type="textarea"
          maxlength="500"
          show-word-limit
          resize="none"
          :placeholder="`回复 @${activeComment._user.name}`"
          :autosize="{ minRows: 3, maxRows: 5 }"
          :disabled="replySubmitting"
          @keydown.ctrl.enter.prevent="submitReply"
        />
        <div class="comment-compose-actions">
          <span class="comment-compose-tip">Ctrl + Enter 回复</span>
          <el-button
            type="primary"
            native-type="submit"
            :loading="replySubmitting"
            :disabled="!canSubmitReply"
          >
            发表回复
          </el-button>
        </div>
      </form>

      <el-scrollbar class="comment-drawer-scrollbar">
        <div v-if="isViewingReplies" class="reply-panel">
          <button type="button" class="back-button" @click="backToComments">
            <el-icon>
              <ArrowLeft />
            </el-icon>
            返回评论列表
          </button>

          <article v-if="activeComment" class="comment-item active-parent">
            <div class="comment-main">
              <el-avatar :size="42" :src="getAvatarUrl(activeComment)" />
              <div class="comment-content">
                <div class="comment-header">
                  <div class="min-w-0">
                    <div class="flex items-center gap-2">
                      <span class="comment-user-name truncate">{{ activeComment._user.name }}</span>
                      <el-tag
                        v-if="activeComment._user.title" size="small" type="info"
                        effect="plain"
                      >
                        {{ activeComment._user.title }}
                      </el-tag>
                    </div>
                    <div class="comment-meta">
                      Lv.{{ activeComment._user.level }} · {{ formatCommentTime(activeComment.created_at) }}
                    </div>
                  </div>
                </div>

                <p
                  class="comment-text"
                  :class="{ 'is-collapsed': !isCommentExpanded(activeComment._id) && shouldShowExpand(activeComment.content) }"
                >
                  {{ activeComment.content }}
                </p>

                <button
                  v-if="shouldShowExpand(activeComment.content)"
                  type="button"
                  class="comment-text-button"
                  @click="toggleCommentExpanded(activeComment._id)"
                >
                  {{ isCommentExpanded(activeComment._id) ? '收起' : '展开' }}
                </button>
              </div>
            </div>
          </article>

          <div v-if="showChildSkeleton" class="comment-list" aria-busy="true">
            <div v-for="item in 5" :key="item" class="comment-item">
              <el-skeleton animated>
                <template #template>
                  <div class="flex gap-3">
                    <el-skeleton-item variant="circle" class="size-36px!" />
                    <div class="flex-1 min-w-0">
                      <el-skeleton-item variant="h3" class="w-150px! mb-2" />
                      <el-skeleton-item variant="text" class="w-full! mb-1" />
                      <el-skeleton-item variant="text" class="w-68%!" />
                    </div>
                  </div>
                </template>
              </el-skeleton>
            </div>
          </div>

          <div v-else-if="childComments.length" class="comment-list">
            <article
              v-for="comment in childComments"
              :key="comment._id"
              class="comment-item child-comment"
            >
              <div class="comment-main">
                <el-avatar :size="36" :src="getAvatarUrl(comment)" />
                <div class="comment-content">
                  <div class="comment-header">
                    <div class="min-w-0">
                      <div class="flex items-center gap-2">
                        <span class="comment-user-name truncate">{{ comment._user.name }}</span>
                        <el-tag
                          v-if="comment._user.title" size="small" type="info"
                          effect="plain"
                        >
                          {{ comment._user.title }}
                        </el-tag>
                      </div>
                      <div class="comment-meta">
                        Lv.{{ comment._user.level }} · {{ formatCommentTime(comment.created_at) }}
                      </div>
                    </div>
                  </div>

                  <p
                    class="comment-text"
                    :class="{ 'is-collapsed': !isChildCommentExpanded(comment._id) && shouldShowExpand(comment.content) }"
                  >
                    {{ comment.content }}
                  </p>

                  <button
                    v-if="shouldShowExpand(comment.content)"
                    type="button"
                    class="comment-text-button"
                    @click="toggleChildCommentExpanded(comment._id)"
                  >
                    {{ isChildCommentExpanded(comment._id) ? '收起' : '展开' }}
                  </button>

                  <div class="comment-actions">
                    <span>{{ comment.likesCount }} 喜欢</span>
                  </div>
                </div>
              </div>
            </article>
          </div>

          <el-empty v-else description="暂无回复" :image-size="88" />
        </div>

        <div v-else-if="showSkeleton" class="comment-list" aria-busy="true">
          <div v-for="item in 6" :key="item" class="comment-item">
            <el-skeleton animated>
              <template #template>
                <div class="flex gap-3">
                  <el-skeleton-item variant="circle" class="size-42px!" />
                  <div class="flex-1 min-w-0">
                    <el-skeleton-item variant="h3" class="w-160px! mb-2" />
                    <el-skeleton-item variant="text" class="w-full! mb-1" />
                    <el-skeleton-item variant="text" class="w-70%!" />
                  </div>
                </div>
              </template>
            </el-skeleton>
          </div>
        </div>

        <template v-else-if="hasComments">
          <div v-if="topComments.length" class="comment-list mb-3">
            <article
              v-for="comment in topComments"
              :key="comment._id"
              class="comment-item is-top"
            >
              <div class="comment-main">
                <el-avatar :size="42" :src="getAvatarUrl(comment)" />
                <div class="comment-content">
                  <div class="comment-header">
                    <div class="min-w-0">
                      <div class="flex items-center gap-2">
                        <span class="comment-user-name truncate">{{ comment._user.name }}</span>
                        <el-tag size="small" type="warning" effect="plain">
                          <el-icon class="mr-1">
                            <StarFilled />
                          </el-icon>
                          置顶
                        </el-tag>
                        <el-tag
                          v-if="comment._user.title" size="small" type="info"
                          effect="plain"
                        >
                          {{ comment._user.title }}
                        </el-tag>
                      </div>
                      <div class="comment-meta">
                        Lv.{{ comment._user.level }} · {{ formatCommentTime(comment.created_at) }}
                      </div>
                    </div>
                  </div>

                  <p
                    class="comment-text"
                    :class="{ 'is-collapsed': !isCommentExpanded(comment._id) && shouldShowExpand(comment.content) }"
                  >
                    {{ comment.content }}
                  </p>

                  <button
                    v-if="shouldShowExpand(comment.content)"
                    type="button"
                    class="comment-text-button"
                    @click="toggleCommentExpanded(comment._id)"
                  >
                    {{ isCommentExpanded(comment._id) ? '收起' : '展开' }}
                  </button>

                  <div class="comment-actions">
                    <span>{{ comment.likesCount }} 喜欢</span>
                    <button
                      type="button"
                      class="comment-action-button"
                      @click="openReplies(comment)"
                    >
                      {{ getReplyCount(comment) }} 回复
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </div>

          <div class="comment-list">
            <article
              v-for="comment in visibleComments"
              :key="comment._id"
              class="comment-item"
            >
              <div class="comment-main">
                <el-avatar :size="42" :src="getAvatarUrl(comment)" />
                <div class="comment-content">
                  <div class="comment-header">
                    <div class="min-w-0">
                      <div class="flex items-center gap-2">
                        <span class="comment-user-name truncate">{{ comment._user.name }}</span>
                        <el-tag
                          v-if="comment._user.title" size="small" type="info"
                          effect="plain"
                        >
                          {{ comment._user.title }}
                        </el-tag>
                      </div>
                      <div class="comment-meta">
                        Lv.{{ comment._user.level }} · {{ formatCommentTime(comment.created_at) }}
                      </div>
                    </div>
                  </div>

                  <p
                    class="comment-text"
                    :class="{ 'is-collapsed': !isCommentExpanded(comment._id) && shouldShowExpand(comment.content) }"
                  >
                    {{ comment.content }}
                  </p>

                  <button
                    v-if="shouldShowExpand(comment.content)"
                    type="button"
                    class="comment-text-button"
                    @click="toggleCommentExpanded(comment._id)"
                  >
                    {{ isCommentExpanded(comment._id) ? '收起' : '展开' }}
                  </button>

                  <div class="comment-actions">
                    <span>{{ comment.likesCount }} 喜欢</span>
                    <button
                      type="button"
                      class="comment-action-button"
                      @click="openReplies(comment)"
                    >
                      {{ getReplyCount(comment) }} 回复
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </template>

        <el-empty v-else description="暂无评论" :image-size="88" />
      </el-scrollbar>

      <div v-if="isViewingReplies && childPageInfo.total > childPageInfo.limit" class="comment-pagination">
        <CommonPagination
          :total="childPageInfo.total"
          :current-page="Number(childPageInfo.page)"
          :page-size="childPageInfo.limit"
          :disabled="childLoading"
          layout="total, prev, pager, next"
          @change="handleReplyPageChange"
        />
      </div>

      <div v-else-if="!isViewingReplies && pageInfo.total > pageInfo.limit" class="comment-pagination">
        <CommonPagination
          :total="pageInfo.total"
          :current-page="Number(pageInfo.page)"
          :page-size="pageInfo.limit"
          :disabled="loading"
          layout="total, prev, pager, next"
          @change="handlePageChange"
        />
      </div>
    </div>
  </el-drawer>
</template>

<style scoped lang="scss">
.comment-drawer-body {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.comment-drawer-scrollbar {
  flex: 1;
  min-height: 0;
}

.comment-compose {
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.comment-compose-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-top: 10px;
}

.comment-compose-tip {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.comment-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 4px;
}

.reply-panel {
  padding: 0 4px;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-height: 32px;
  margin-bottom: 10px;
  border: 0;
  padding: 0;
  background: transparent;
  color: var(--el-color-primary);
  cursor: pointer;
  font: inherit;
}

.comment-item {
  padding: 14px 0;
  border-bottom: 1px solid var(--el-border-color-lighter);

  &:last-child {
    border-bottom: 0;
  }

  &.is-top {
    padding: 14px;
    border: 1px solid var(--el-color-warning-light-7);
    border-radius: 8px;
    background: var(--el-color-warning-light-9);
  }

  &.active-parent {
    margin-bottom: 12px;
    padding: 14px;
    border: 1px solid var(--el-border-color-light);
    border-radius: 8px;
    background: var(--el-fill-color-extra-light);
  }

  &.child-comment {
    padding-left: 10px;
    border-left: 2px solid var(--el-border-color-lighter);
  }
}

.comment-main {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.comment-content {
  min-width: 0;
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.comment-user-name {
  max-width: 220px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.comment-meta,
.comment-actions {
  margin-top: 4px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.comment-text {
  margin: 10px 0 0;
  color: var(--el-text-color-primary);
  line-height: 1.7;
  white-space: pre-wrap;
  overflow-wrap: break-word;

  &.is-collapsed {
    display: -webkit-box;
    -webkit-line-clamp: 4;
    line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

.comment-text-button {
  margin-top: 6px;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--el-color-primary);
  cursor: pointer;
  font: inherit;
}

.comment-actions {
  display: flex;
  gap: 14px;
}

.comment-action-button {
  border: 0;
  padding: 0;
  background: transparent;
  color: var(--el-text-color-secondary);
  cursor: pointer;
  font: inherit;

  &:hover,
  &:focus-visible {
    color: var(--el-color-primary);
    outline: none;
  }
}

.comment-pagination {
  display: flex;
  justify-content: center;
  padding-top: 12px;
  border-top: 1px solid var(--el-border-color-lighter);
}
</style>
