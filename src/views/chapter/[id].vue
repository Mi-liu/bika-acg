<script setup lang="ts">
import { getComicPages } from '@/api/comic'
import { Setting } from '@element-plus/icons-vue'
import type { ComicOrderPage } from '@/api/comic'

const props = defineProps<{
  id: string
  chapter: string
  maxChapter: string
}>()


const currentChapter = Number(props.chapter)

const comics = ref<ComicOrderPage['pages']['docs']>([])

function getChapterPages() {
  return getComicPages(props.id, currentChapter, 1).then((res) => {
    console.log(res);
  })
}

getChapterPages()

definePage({
  meta: {
    layout: false,
  },
})

</script>

<template>
  <div class="flex flex-col bg-[--el-text-color-primary]">
    <div class="h-50px flex justify-between items-center p-3 bg-[--el-color-black] color-[--el-color-white]">
      111
      <el-icon>
        <Setting />
      </el-icon>
    </div>
    <div class="h-1"></div>
    <el-scrollbar>
      <div v-for="item in 100">{{ item }}</div>
    </el-scrollbar>
  </div>
</template>
