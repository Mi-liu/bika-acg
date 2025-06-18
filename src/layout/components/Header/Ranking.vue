<script setup lang="ts">
const router = useRouter()

function handleClick() {
  const url = router.resolve({
    path: '/comic/ranking',
  }).href
  window.open(url, '_blank')
}
</script>

<template>
  <el-link @click="handleClick">
    排行榜
  </el-link>
</template>

<style lang="scss" scoped>

</style>
