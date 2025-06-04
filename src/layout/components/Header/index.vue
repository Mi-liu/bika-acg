<script setup lang="ts">
import Logo from './Logo.vue'
import Search from './Search.vue'
import User from './User.vue'
import Weather from './Weather.vue'

const layoutStore = useLayoutStoreHook()
</script>

<template>
  <header
    class="layout-header size-full flex justify-between items-center  pl-4 bg-[--el-bg-color]"
    :style="{ height: `${layoutStore.header.height}px` }"
  >
    <Logo />
    <div class="flex items-center gap-10px">
      <Search />
      <Weather />
      <User />
    </div>
  </header>
</template>

<style lang="scss" scoped></style>
