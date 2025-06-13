<script setup lang="ts">
import { useCommonDialog } from '@common/components/CommonDialog/hooks'
import CommonDialog from '@common/components/CommonDialog/index.vue'

async function handleClick() {
  await useCommonDialog({
    // showFooter: false,
    confirmText: '111',
    onClosed() {
      console.log('onClosed')
    },
    beforeConfirm() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(undefined)
          reject(new Error('错误'))
        }, 1000)
      })
    },
  }, {
    default() {
      return '1'
    },
  })
  console.log('成功')
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
