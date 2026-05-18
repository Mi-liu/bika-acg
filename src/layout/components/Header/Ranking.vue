<script setup lang="ts">
const router = useRouter()

function handleClick() {
  router.push({
    path: '/comic/ranking',
  })
}
</script>

<template>
  <el-link @click="handleClick">
    排行榜
  </el-link>
</template>

<style lang="scss" scoped>

</style>
