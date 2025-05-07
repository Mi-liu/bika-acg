<script setup lang="ts">
import { RouterView } from 'vue-router'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
</script>

<template>
  <el-config-provider :locale="zhCn" size="large">
    <RouterView />
  </el-config-provider>
</template>

<style scoped></style>
