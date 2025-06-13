<script setup lang="ts">
import type { CommonButtonProps } from './type'
import { omit } from 'lodash-es'
import { ref } from 'vue'

defineOptions({
  name: 'CommonButton',
})

const props = defineProps<CommonButtonProps>()

const buttonProps = omit(props, 'onClick')

const modelValue = defineModel({ default: false })


// 移除调试日志
function handleClick(evt: MouseEvent) {
  if (props.onClick) {
    modelValue.value = true
    Promise.resolve(props.onClick(evt)).finally(() => {
      modelValue.value = false
    })
  }
}
</script>

<template>
  <el-button v-bind="buttonProps" :loading="modelValue" @click="handleClick">
    <template v-for="(_, name) in $slots" :key="name" #[name]="scoped">
      <slot :name="name" v-bind="scoped || {}" />
    </template>
  </el-button>
</template>

<style lang="scss" scoped></style>
