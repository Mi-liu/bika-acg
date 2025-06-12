<script setup lang="ts">
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { useRequestProvider } from 'vue-hooks-plus'
import layout from '@/layout/index.vue'

useRequestProvider({
  /** 延迟 loading 变成 true 的时间，有效防止闪烁 */
  loadingDelay: 500,
})

// 初始化本地存储
onMounted(() => {
  const localStore = useLocalStoreHook()
  localStore.initStorage()
})
</script>

<template>
  <el-config-provider :locale="zhCn" size="large">
    <layout />
  </el-config-provider>
</template>

<style scoped></style>
