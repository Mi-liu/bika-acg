<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import { getKeywords } from '@/api/keywords'

const { data: keywords } = useRequest(getKeywords)

const router = useRouter()

const inputValue = ref('')

const isFocus = ref(false)

function handleFocus() {
  isFocus.value = true
}

function handleBlur() {
  // 延迟隐藏，允许点击关键词
  setTimeout(() => {
    isFocus.value = false
  }, 150)
}

function handleSearch() {
  const url = router.resolve({
    path: '/comic/search',
    query: {
      keyword: inputValue.value,
    },
  }).href
  window.open(url, '_blank')
}

function handleKeywordClick(keyword: string) {
  inputValue.value = keyword

  const url = router.resolve({
    path: '/comic/list',
    query: {
      keywords: keyword,
    },
  }).href
  window.open(url, '_blank')
}
</script>

<template>
  <div class="w-400px h-40px relative">
    <el-input
      v-model="inputValue" :prefix-icon="Search" placeholder="关键词请勿太长，标题可以部分搜索"
      @focus="handleFocus"
      @blur="handleBlur" @keyup.enter="handleSearch"
    />
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      leave-active-class="transition-all duration-150 ease-in"
      enter-from-class="opacity-0 transform scale-95 translate-y-[-8px]"
      enter-to-class="opacity-100 transform scale-100 translate-y-0"
      leave-from-class="opacity-100 transform scale-100 translate-y-0"
      leave-to-class="opacity-0 transform scale-95 translate-y-[-8px]"
    >
      <div
        v-show="isFocus"
        class="absolute w-full right-0 p-4 top-[calc(100%+12px)] bg-[--el-bg-color] shadow-lg rounded-lg border border-[--el-border-color-light] z-50 backdrop-blur-sm"
      >
        <div class="space-y-3">
          <div class="text-sm font-medium text-[--el-text-color-regular] mb-3">
            热门搜索
          </div>
          <div class="flex flex-wrap gap-2">
            <el-link
              v-for="keyword in keywords" :key="keyword" type="primary"
              class="cursor-pointer select-none"
              underline="never" @click="handleKeywordClick(keyword)"
            >
              {{ keyword }}
            </el-link>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped></style>
