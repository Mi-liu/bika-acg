<script setup lang="ts">
import { getComics } from '@/api/comic'
import { getImageUrl } from '@/utils/string'

const props = defineProps<{
  title: string
}>()

const { data } = useRequest(() =>
  getComics({
    page: 1,
    c: encodeURIComponent(props.title),
    s: 'dd',
  }),
)
</script>

<template>
  <div class="comics-list">
    <el-page-header class="my-3" @back="$router.back()">
      <template #content>
        <span class="text-large font-600 mr-3"> {{ title }} </span>
      </template>
    </el-page-header>
    <div class="scroll-container flex-1 overflow-hidden bg-[--el-bg-color-page]">
      <el-scrollbar height="100%">
        <div class="comics">
          <div class="cursor-pointer bg-[--el-bg-color]" v-for="item in data?.docs" :key="item.id">
            <el-image class="aspect-ratio-3/4" :src="getImageUrl(item.thumb.path)" fit="cover" />
            <div class="title line-clamp-2">
              {{ item.title }}
            </div>
            <div class="text-#a1a1a2">
              <template v-if="item.finished">
                [完结]
              </template>
              共 {{ item.epsCount }} 话 {{ item.pagesCount }}P
            </div>
            <div class="text-16px flex items-center">
              作者:
              <el-link class="text-size-inherit! ml-2" type="primary" v-for="a in item.author.split('，')">{{ a
              }}</el-link>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <!--  -->
  </div>
</template>

<style lang="scss" scoped>
.comics-list {
  display: flex;
  flex-direction: column;

  .comics {
    display: grid;
    grid-template-columns: repeat(auto-fill, 200px);
    gap: 20px;
  }
}
</style>
