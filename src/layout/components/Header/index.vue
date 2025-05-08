<script setup lang="ts">
import User from './User.vue'
import Logo from './Logo.vue'
const layoutStore = useLayoutStoreHook()

</script>

<template>
  <header class="layout-header size-full flex items-center pl-4 bg-[--el-bg-color]"
    :style="{ height: `${layoutStore.header.height}px` }">
    <Logo />
    <User />
  </header>
</template>

<style lang="scss" scoped></style>