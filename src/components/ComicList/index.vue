<script setup lang="ts">
import type { ComicsListProps } from './type'
import CommonPagination from '@common/components/CommonPagination/index.vue'
import { DEFAULT_PAGE_SIZE } from '@/config/pagination'
defineProps<ComicsListProps>()

const settingStore = useSettingStoreHook()

</script>

<template>
  <div class="comic-list size-full flex-1 flex flex-col">
    <div class="px-3">
      <CommonPagination :total="100" :pageSize="DEFAULT_PAGE_SIZE" layout="slot, ->, total, prev, pager, next, jumper">
        {{ title }}
      </CommonPagination>
    </div>
    <div class="comics-container h-full flex-1">
      <el-scrollbar height="100%">
        <div v-for="item in 100" :key="item">{{ item }}</div>
      </el-scrollbar>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
