<script setup lang="ts">
import type { ImageProps } from './type'
import { Hide } from '@element-plus/icons-vue'

const props = withDefaults(defineProps<ImageProps>(), {
  src: '',
  aspect: '3/4',
})

const uri = ref('');
watchEffect(() => {
  uri.value = props.src
})



/** 图片加载状态 */
const state = ref<'loading' | 'load' | 'error'>('loading')

const aspect = computed(() => {
  if (state.value === 'load') {
    return `aspect-${props.aspect}`
  }
  else {
    return 'aspect-3/4'
  }
})


function handleRefreshImage() {
  state.value = 'loading'
  uri.value = `${uri.value}?t=${Date.now()}`
}

</script>

<template>
  <div class="relative bg-[--el-fill-color]" :class="[aspect]">
    <el-image class="w-full vertical-top" :src="uri" fit="cover" loading="lazy" @load="state = 'load'"
      @error="state = 'error'" v-if="uri.length">
      <template #error>
        <div />
      </template>
    </el-image>
    <div class="absolute inset-0 flex-center" v-if="state === 'loading'">
      <el-skeleton class="size-full" :loading="true" animated>
        <template #template>
          <el-skeleton-item class="size-full!" variant="image" />
        </template>
      </el-skeleton>
    </div>

    <div class="absolute inset-0 flex flex-col flex-center cursor-pointer text-[--el-text-color-secondary]"
      @click="handleRefreshImage" v-if="state === 'error'">
      <div>加载失败</div>
      <div>点击重新加载</div>
    </div>

    <!-- <div class="absolute inset-0 flex-center bg-[--el-fill-color]">
      <el-icon>
        <Hide />
      </el-icon>
    </div> -->
  </div>
</template>

<style lang="scss" scoped></style>
