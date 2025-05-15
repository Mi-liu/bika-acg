<script setup lang="ts">
import type { ImageProps } from './type'

const props = defineProps<ImageProps>()

const uri = ref('');
watchEffect(() => {
  uri.value = props.src
})



/** 图片加载状态 */
const state = ref<'loading' | 'load' | 'error'>('loading')

function handleRefreshImage() {
  state.value = 'loading'
  uri.value = `${uri.value}?t=${Date.now()}`
}

</script>

<template>
  <div class="relative aspect-3/4 bg-[--el-fill-color]">
    <el-image class="size-full" :src="uri" fit="cover" loading="lazy" @load="state = 'load'" @error="state = 'error'">
      <template #error>
        <div class="size-full flex flex-col flex-center cursor-pointer text-[--el-text-color-secondary]"
          @click="handleRefreshImage">
          <div>加载失败</div>
          <div>点击重新加载</div>
        </div>
      </template>
    </el-image>
    <div class="absolute inset-0 flex-center" v-if="state === 'loading'">
      <img src="@/assets/image/app/loading.gif" alt="加载中...">
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
