<script setup lang="ts">
import { useCommonDialog } from '@common/components/CommonDialog/hooks'
import CommonDialog from '@common/components/CommonDialog/index.vue'

function handleClick() {
  useCommonDialog({
    // showFooter: false,
    confirmText: '111',
    onClosed() {
      console.log('onClosed')
    },
  }, {
    default() {
      return '1'
    },
  })
}
</script>

<template>
  <div class="">
    1
    <el-button @click="handleClick">1</el-button>
    <CommonDialog>
      <template #aaa />
    </CommonDialog>
  </div>
</template>

<style lang="scss" scoped>

</style>
