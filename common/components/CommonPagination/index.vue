<script setup lang="ts">
import type { CommonPaginationProps } from './type'
import { ref, watch } from 'vue'
import { CommonConfig } from '../../config'

defineOptions({
  name: 'CommonPagination',
})

const props = withDefaults(defineProps<CommonPaginationProps & {
  /** 当前页码 */
  currentPage?: number
  /** 每页条数 */
  pageSize?: number
}>(), {
  /** 总数 */
  total: 0,
  /** 带有背景色的分页 */
  background: true,
  /** 是否将下拉菜单teleport至 body */
  teleported: true,
  /** 组件布局，子组件名用逗号分隔 */
  layout: 'slot, ->, total, sizes, prev, pager, next, jumper',
  /** 每页显示个数选择器的选项设置 */
  pageSizes: () => [10, 20, 30, 40, 50],
  /** 当前页码 */
  currentPage: CommonConfig.components.pagination.defaultCurrentPage,
  /** 每页条数 */
  pageSize: CommonConfig.components.pagination.defaultPageSize,
})

const emit = defineEmits<{
  /** 页码变化 */
  'update:currentPage': [number]
  /** 每页条数变化 */
  'update:pageSize': [number]
  /** 分页变化 */
  'change': [{
    currentPage: number
    pageSize: number
  }]
}>()

/**
 * 内部当前页码
 */
const innerCurrentPage = ref(props.currentPage)

/**
 * 内部每页条数
 */
const innerPageSize = ref(props.pageSize)

/**
 * 监听属性变化
 */
watch(() => props.currentPage, (val) => {
  if (val !== innerCurrentPage.value) {
    innerCurrentPage.value = val
  }
})

watch(() => props.pageSize, (val) => {
  if (val !== innerPageSize.value) {
    innerPageSize.value = val
  }
})

/**
 * 处理页码变化
 */
function handleCurrentPageChange(page: number) {
  innerCurrentPage.value = page
  emit('update:currentPage', page)
  emitChange()
}

/**
 * 处理每页条数变化
 */
function handlePageSizeChange(size: number) {
  innerPageSize.value = size
  // 当每页条数变化时，重置为第一页
  innerCurrentPage.value = 1
  emit('update:pageSize', size)
  emit('update:currentPage', 1)
  emitChange()
}

/**
 * 触发变化事件
 */
function emitChange() {
  emit('change', {
    currentPage: innerCurrentPage.value,
    pageSize: innerPageSize.value,
  })
}

/**
 * 重置分页
 */
function reset() {
  innerCurrentPage.value = CommonConfig.components.pagination.defaultCurrentPage
  innerPageSize.value = CommonConfig.components.pagination.defaultPageSize
  emit('update:currentPage', CommonConfig.components.pagination.defaultCurrentPage)
  emit('update:pageSize', CommonConfig.components.pagination.defaultPageSize)
  emitChange()
}

// 暴露方法
defineExpose({
  reset,
})
</script>

<template>
  <el-pagination
    v-bind="props" :page-size="innerPageSize" :current-page="innerCurrentPage"
    @update:current-page="handleCurrentPageChange" @update:page-size="handlePageSizeChange"
  >
    <slot />
  </el-pagination>
</template>

<style scoped></style>
