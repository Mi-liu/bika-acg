<script setup lang="ts">
import Header from './components/Header/index.vue'
import Main from './components/Main/index.vue'
const userStore = useUserStoreHook()

const settingStore = useSettingStoreHook()

userStore.getUserProfile()

</script>

<template>
  <main class="size-full flex flex-col bg-[--el-bg-color-page]">
    <Header />
    <Main class="mt-2" />
  </main>
</template>

<style lang="scss" scoped></style>
