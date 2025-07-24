<script setup lang="ts">
import Header from './components/Header/index.vue'
import Main from './components/Main/index.vue'
import Sidebar from './components/Sidebar/index.vue'

const route = useRoute()
</script>

<template>
  <main class="size-full flex bg-[--el-bg-color-page] gap-2 p-1 rounded-2">
    <template v-if="route.meta.layout">
      <Sidebar />
      <div class="flex-1 flex flex-col gap-2 rounded-2">
        <Header />
        <Main />
      </div>
    </template>
    <template v-else>
      <Main />
    </template>
  </main>
</template>

<style lang="scss" scoped></style>
