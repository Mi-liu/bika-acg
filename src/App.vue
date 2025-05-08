<script setup lang="ts">
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import layout from '@/layout/index.vue'

</script>

<template>
  <el-config-provider :locale="zhCn" size="large">
    <layout />
  </el-config-provider>
</template>

<style scoped></style>
