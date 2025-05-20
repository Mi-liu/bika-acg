<script setup lang="ts">
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import layout from '@/layout/index.vue'

const localStore = useLocalStoreHook()
localStore.initStorage();
</script>

<template>
  <el-config-provider :locale="zhCn" size="default">
    <layout />
  </el-config-provider>
</template>

<style scoped></style>
