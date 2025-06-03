<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import { getKeywords } from '@/api/keywords'
const { data: keywords } = useRequest(getKeywords)


const inputValue = ref('')

const isFocus = ref(false)

const handleFocus = () => {
  isFocus.value = true
}

const handleBlur = () => {
  isFocus.value = false
}
</script>

<template>
  <div class="w-400px h-40px relative">
    <el-input v-model="inputValue" :prefix-icon="Search" placeholder="关键词请勿太长，标题可以部分搜索" @focus="handleFocus"
      @blur="handleBlur" />
    <div class="absolute w-full right-0 p-3 top-[calc(100%+10px)] bg-[--el-bg-color] shadow-[--el-box-shadow-light]"
      v-show="isFocus">
      <div>
        <div>
          热门搜索
        </div>
        <div class="flex flex-wrap gap-x-2 gap-y-1">
          <el-link type="primary" v-for="keyword in keywords" :key="keyword">
            {{ keyword }}
          </el-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>