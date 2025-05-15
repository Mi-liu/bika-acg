<script setup lang="ts">
import type { CommonPaginationProps } from './type'
import { watch, watchEffect } from 'vue'
import { CommonPaginationConfig } from './config'

defineOptions({
  name: 'CommonPagination',
})
const props = withDefaults(defineProps<CommonPaginationProps>(), {
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
})

const emit = defineEmits<{
  change: [{
    currentPage: number
    pageSize: number
  }]
}>()

const currentPage = defineModel('currentPage', {
  type: Number,
  default: CommonPaginationConfig.defaultCurrentPage,
})
const pageSize = defineModel('pageSize', {
  type: Number,
  default: CommonPaginationConfig.defaultPageSize,
})

watch(() => pageSize.value, () => {
  currentPage.value = 1
})

watchEffect(() => {
  emit('change', {
    currentPage: currentPage.value,
    pageSize: pageSize.value,
  })
})
</script>

<template>
  <el-pagination
    v-bind="props"
    v-model:page-size="pageSize"
    v-model:current-page="currentPage"
  >
    <slot />
  </el-pagination>
</template>

<style scoped>

</style>
