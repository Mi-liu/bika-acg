<script setup lang="ts">
import type { CommonFormArrayItems, CommonFormObjectItems } from '@common/components/CommonForm/type'
import { useCommonDialog } from '@common/components/CommonDialog/hook'
import CommonDialog from '@common/components/CommonDialog/index.vue'
import CommonForm from '@common/components/CommonForm/index.vue'
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

const arrayItems: CommonFormArrayItems = [
  {
    is: 'CommonInput',
    props: {
      placeholder: '111',
    },
    formItemProps: {
      prop: 'aaa',
      label: '111',
    },
  },
  {
    is: 'CommonInput',
    props: {
      placeholder: '222',
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

<style lang="scss" scoped>

</style>
