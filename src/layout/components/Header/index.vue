<script setup lang="ts">
import User from './User.vue'
import Logo from './Logo.vue'
import Weather from './weather.vue'
const layoutStore = useLayoutStoreHook()

</script>

<template>
  <header class="layout-header size-full flex justify-between items-center  pl-4 bg-[--el-bg-color]"
    :style="{ height: `${layoutStore.header.height}px` }">
    <Logo />
    <div class="flex items-center">
      <Weather />
      <User />
    </div>
  </header>
</template>

<style lang="scss" scoped></style>