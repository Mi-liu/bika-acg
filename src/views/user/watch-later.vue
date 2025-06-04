<script setup lang="ts">
import type { Comics, ComicsParams } from '@/api/comic'
import ComicList from '@/components/ComicList/index.vue'

/**
 * 稍后再看页面
 * 显示用户保存在本地的稍后再看漫画列表
 */

const localStore = useLocalStoreHook()

/**
 * 获取稍后再看列表的适配器函数
 * 将本地存储的数据转换为 ComicList 组件期望的格式
 * @param params 查询参数（包含分页信息）
 * @returns 符合 Comics['comics'] 格式的数据
 */
async function getWatchLaterList(params: Partial<ComicsParams> & { page: number, s: string }): Promise<Comics['comics']> {
  const { page = 1, s = 'dd' } = params
  const pageSize = 20 // 每页显示数量

  // 获取本地存储的稍后再看列表
  let watchLaterList = [...localStore.local.WATCH_LATER_LIST]

  // 根据排序参数进行排序
  if (s === 'dd') {
    // 按添加时间倒序（最新添加的在前面）
    watchLaterList = watchLaterList.reverse()
  }
  else if (s === 'da') {
    // 按添加时间正序（最早添加的在前面）
    // 保持原顺序
  }
  else if (s === 'ld') {
    // 按点赞数倒序
    watchLaterList.sort((a, b) => b.totalLikes - a.totalLikes)
  }
  else if (s === 'vd') {
    // 按浏览量倒序
    watchLaterList.sort((a, b) => b.totalViews - a.totalViews)
  }

  // 计算分页
  const total = watchLaterList.length
  const pages = Math.ceil(total / pageSize)
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const docs = watchLaterList.slice(startIndex, endIndex)

  // 返回符合 Comics['comics'] 格式的数据
  return {
    docs,
    total,
    page,
    pages,
    limit: pageSize,
  }
}
</script>

<template>
  <div class="watch-later-page">
    <ComicList title="稍后再看" :params="{}" :fetch="getWatchLaterList" />
  </div>
</template>

<style scoped></style>
