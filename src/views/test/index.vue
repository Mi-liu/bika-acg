<script setup lang="ts">
import { useCommonDialog } from '@common/components/CommonDialog/hook'
import CommonInput from '@common/components/CommonInput/index.vue'

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
        }, 4000)
      })
    },
  }, {
    default() {
      return '1'
    },
  })
  console.log('成功')
}

const aaa = ref('test')

function handleInputClick() {
  console.log('handleInputClick')
}
</script>

<template>
  <div class="">
    {{ aaa }}
    <CommonInput v-model="aaa" @click="handleInputClick" />
    122
    <el-button @click="handleClick">1</el-button>

    <!-- <CommonForm :items="arrayItems" /> -->
  </div>
</template>

<style lang="scss" scoped></style>
