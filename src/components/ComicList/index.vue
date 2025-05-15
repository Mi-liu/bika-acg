<script setup lang="ts">
import type { ComicsListProps } from './type'
import CommonPagination from '@common/components/CommonPagination/index.vue'
import Image from '@/components/Image/index.vue'
import { DEFAULT_PAGE_SIZE } from '@/config/pagination'
import { sort, defaultSort } from '@/constants/options'
import { getImageUrl } from '@/utils/string'
import type { Comics } from '@/api/comic'

const props = defineProps<ComicsListProps>()

const settingStore = useSettingStoreHook()

const loading = ref(false)

const data = ref<Comics['comics']>({
  docs: [],
  total: 0,
  page: 1,
  pages: 0,
  limit: DEFAULT_PAGE_SIZE,
})

const s = ref(defaultSort)

async function handelPageChange(event: { currentPage: number }) {
  loading.value = true
  try {
    const result = await props.fetch({
      page: event.currentPage,
      c: encodeURIComponent(props.title),
      s: s.value,
    })
    data.value = result
  } finally {
    await nextTick()
    loading.value = false
  }
}

const comics = computed(() => data.value.docs)


</script>

<template>
  <div class="comic-list size-full flex-1 flex flex-col">
    <div class="flex px-3">
      <div class="size-full flex justify-between">
        <div class="text-18px">{{ title }}</div>
        <el-select class="w-110px!" v-model="s">
          <el-option v-for="item in sort" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </div>
      <CommonPagination :total="data.total" v-model:currentPage="data.page" :pageSize="data.limit"
        layout="slot, ->, total, prev, pager, next, jumper" @change="handelPageChange">
      </CommonPagination>
    </div>
    <div class="comics-container h-full flex-1">
      <el-scrollbar height="100%">
        <div class="comics-grid grid">
          <div class="rounded-2 overflow-hidden" v-for="item in comics" :key="item.id">
            <!-- 封面图 -->
            <Image :src="getImageUrl(item.thumb.path)"></Image>
            <!-- <el-image class="aspect-3/4" :src="getImageUrl(item.thumb.path)" fit="cover" loading="lazy"></el-image> -->
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.comics-grid {
  gap: 20px;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
}
</style>
