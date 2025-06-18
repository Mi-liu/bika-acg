<script setup lang="ts">
import { useCommonDialog } from '@common/components/CommonDialog/hook'
import CommonDialog from '@common/components/CommonDialog/index.vue'
import { useCommonFormProps } from '@common/components/CommonForm/hook'
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

const arrayItems = useCommonFormProps({
  columns: [
    {
      is: 'CommonPagination',
      props: {
        total: 100,
      },
      formItemProps: {
        label: '111',
        prop: 'aaa',
      },
      initValue: '11111111',
    },
    {
      is: 'CommonPagination',
      props: {
        total: 100,
      },
      formItemProps: {
        label: '222',
        prop: 'bbb',
      },
    },
  ],
})

const objectItems = useCommonFormProps({
  columns: {
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
  },
})
</script>

<template>
  <div class="">
    1
    <el-button @click="handleClick">1</el-button>

    <CommonForm v-bind="arrayItems" />
    <CommonForm v-bind="objectItems" />

    <CommonDialog>
      <template #aaa />
    </CommonDialog>
  </div>
</template>

<style lang="scss" scoped>

</style>
