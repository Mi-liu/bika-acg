<script setup lang="ts">
import Header from './components/Header/index.vue'
import Main from './components/Main/index.vue'
import { useRoute } from 'vue-router'
const userStore = useUserStoreHook()

const settingStore = useSettingStoreHook()

userStore.getUserProfile()

</script>

<template>
  <main class="size-full flex flex-col bg-[--el-bg-color-page]">
    <template v-if="$route.meta.layout">
      <Header />
      <Main class="mt-2" />
    </template>
    <template v-else>
      <Main />
    </template>
  </main>
</template>

<style lang="scss" scoped></style>
