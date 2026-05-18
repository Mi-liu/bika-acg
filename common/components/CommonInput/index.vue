<script setup lang="ts">
import type { CommonInputEmits, CommonInputProps } from './type'
import { ElInput } from 'element-plus'

const props = defineProps<CommonInputProps>()

defineEmits<CommonInputEmits>()

const attrs = useAttrs()

const definModel = defineModel<string>()
</script>

<template>
  <ElInput
    v-bind="{
      ...attrs,
      ...props,
    }"
    v-model="definModel"
  >
    <template v-for="(_, name) in $slots" :key="name" #[name]="scoped">
      <slot :name="name" v-bind="scoped" />
    </template>
  </ElInput>
</template>

<style lang="scss" scoped></style>
