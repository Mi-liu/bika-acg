<script setup lang="ts">
import { getLeaderboard } from '@/api/comic'
import ComicList from '@/components/ComicList/index.vue'
import { tt } from '@/constants/options'

const props = defineProps<{
  /** 标题 */
  title?: string
}>()

// 当前选择的时间范围
const selectedTt = ref(tt[0].value)

// 排行榜类型，这里固定为 VC (观看数排行)
const ct = 'VC'

const listTitle = computed(() => {
  if (props.title) {
    return props.title
  }
  const currentTt = tt.find(item => item.value === selectedTt.value)
  return `排行榜: ${currentTt?.label || ''}`
})

// 创建适配 ComicList 组件的 fetch 函数
// ComicList 期望的是分页数据格式，但排行榜 API 返回的是简单数组
// 所以我们需要将其转换为 ComicList 期望的格式
async function fetchLeaderboardData() {
  const comics = await getLeaderboard({ tt: selectedTt.value, ct })

  // 将排行榜数据转换为 ComicList 期望的分页格式
  return {
    docs: comics,
    total: comics.length,
    page: 1,
    pages: 1,
    limit: comics.length,
  }
}
</script>

<template>
  <div>
    <ComicList
      :title="listTitle"
      :params="{}"
      :fetch="fetchLeaderboardData"
      :is-blocked-categories="true"
      :page-size="40"
    >
      <template
        #filter="{
          handleReset,
        }"
      >
        <!-- 时间范围选择器 -->
        <el-select
          v-model="selectedTt"
          class="w-110px!"
          @change="handleReset"
        >
          <el-option
            v-for="item in tt"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </template>
    </ComicList>
  </div>
</template>

<style scoped></style>
