<script setup lang="ts">
import type { ComicsListProps } from './type'
import CommonPagination from '@common/components/CommonPagination/index.vue'
import Image from '@/components/Image/index.vue'
import { DEFAULT_PAGE_SIZE } from '@/config/pagination'
import { sort, defaultSort } from '@/constants/options'
import { getImageUrl } from '@/utils/string'
import type { SortOptionValue } from '@/constants/options'
import type { Comics } from '@/api/comic'
import { Timer } from '@element-plus/icons-vue'

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

const s = ref<SortOptionValue>(defaultSort);

function handelSelectChange(_event: SortOptionValue) {
  // 当排序选项变化时，重新加载当前页面的数据
  data.value.page = 1
  // handelPageChange({ currentPage: data.value.page || 1 });
}

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


const comics = computed(() => data.value.docs.filter(item => {
  return !item.categories.some(tag => settingStore.comic.blockedCategories.includes(tag))
}))

</script>

<template>
  <div class="comic-list size-full flex-1 flex flex-col">
    <div class="flex px py">
      <div class="size-full flex justify-between">
        <div class="text-18px">{{ title }}</div>
        <el-select class="w-110px!" v-model="s" @change="handelSelectChange">
          <el-option v-for="item in sort" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </div>
      <CommonPagination v-model:current-page="data.page" :total="data.total"
        layout="slot, ->, total, prev, pager, next, jumper" @change="handelPageChange">
      </CommonPagination>
    </div>
    <div class="comics-container h-full flex-1">
      <el-scrollbar height="100%">
        <div class="comics-grid grid px">
          <div class="rounded-2 overflow-hidden cursor-pointer" v-for="item in comics" :key="item.id">
            <!-- 封面图 -->
            <div class="relative">
              <Image :src="getImageUrl(item.thumb.path)"></Image>

              <el-tooltip class="box-item" effect="dark" content="添加到稍后再看" placement="top-start">
                <div class="absolute top-2 right-2 w-30px h-30px bg-[--el-color-info] rounded-1 flex-center">
                  <el-icon class="text-[--el-color-white]!">
                    <Timer></Timer>
                  </el-icon>
                </div>
              </el-tooltip>
            </div>
            <!-- 标题 -->
            <div class="line-clamp-2">
              {{ item.title }}
            </div>
            <!-- 章节信息 -->
            <div class="text-14px">
              <el-text class="mx-1" type="primary" v-if="item.finished">[完结]</el-text> 共 {{ item.epsCount }}P
            </div>
            <div class="text-14px space-x-2 flex items-center">
              <div>作者:</div>
              <el-link type="primary" underline="always" v-for="author in item.author.split(',')">{{ author }}</el-link>
            </div>
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
