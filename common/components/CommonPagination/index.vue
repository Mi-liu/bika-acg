<script setup lang="ts">
import type { PaginationProps } from './type'
import { omit } from 'lodash-es'
import { computed } from 'vue'

import { defaultPager, defaultProps } from './config'

const props = withDefaults(defineProps<PaginationProps>(), defaultProps)
const emits = defineEmits<{
  change: [{
    pageNum: number
    pageSize: number
  }]
}>()
const Props = computed(() => omit(props, ['pageSize', 'currentPage']))

const pageSize = defineModel<number>('pageSize', {
  default: defaultPager.pageSize,
})
const currentPage = defineModel<number>('currentPage', {
  default: defaultPager.pageNum,
})

/** 条数改变 */
function handleSizeChange(nextPageSize: number) {
  currentPage.value = 1
  pageSize.value = nextPageSize
  emitsChange({
    pageNum: 1,
    pageSize: nextPageSize,
  })
}

/** 页数改变 */
function handleCurrentChange(nextCurrentPage: number) {
  currentPage.value = nextCurrentPage
  emitsChange({
    pageNum: nextCurrentPage,
    pageSize: pageSize.value,
  })
}

function emitsChange(event: {
  pageNum: number
  pageSize: number
}) {
  emits('change', event)
}
</script>

<template>
  <el-pagination
    v-bind="Props"
    v-model:page-size="pageSize"
    v-model:current-page="currentPage"
    :total="Number(total)"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  >
    <slot />
  </el-pagination>
</template>

<style scoped>
.el-pagination {
  padding: 10px 0;
}
</style>
