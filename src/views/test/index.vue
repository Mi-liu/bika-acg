<script setup lang="ts">
import type { CommonFormArrayItems, CommonFormObjectItems } from '@common/components/CommonForm/type'
import { useCommonDialog } from '@common/components/CommonDialog/hook'
import CommonDialog from '@common/components/CommonDialog/index.vue'
import CommonForm from '@common/components/CommonForm/index.vue'

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

const arrayItems: CommonFormArrayItems = [
  {
    is: 'CommonPagination',
    props: {
      total: 100,
    },
    formItemProps: {
      prop: 'aaa',
      label: '111',
    },
  },
  {
    is: 'CommonPagination',
    props: {
      total: 100,
    },
    formItemProps: {
      prop: 'bbb',
      label: '222',
    },
    visible(formData) {
      console.log(formData)
      return formData.aaa === '111'
    },
  },
]

const objectItems: CommonFormObjectItems = {
  aaa: {
    is: 'CommonPagination',
    props: {
      total: 100,
    },
    formItemProps: {
      label: '111',
    },
  },
  bbb: {
    is: 'CommonPagination',
    props: {
      total: 100,
    },
    formItemProps: {
      label: '222',
    },
  },
}
</script>

<template>
  <div class="">
    1
    <el-button @click="handleClick">1</el-button>

    <CommonForm :items="arrayItems" />
    <CommonForm :items="objectItems" />

    <CommonDialog>
      <template #aaa />
    </CommonDialog>
  </div>
</template>

<style lang="scss" scoped>

</style>
