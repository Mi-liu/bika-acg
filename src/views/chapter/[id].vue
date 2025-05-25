<script setup lang="ts">
const props = defineProps<{
  id: string
  chapter: string
  maxChapter: string
}>()

console.log(props);

definePage({
  meta: {
    layout: false,
  },
})

</script>

<template>
  <div class="bg-[--el-text-color-primary]">1</div>
</template>
