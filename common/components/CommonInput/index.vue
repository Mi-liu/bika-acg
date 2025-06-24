<script setup lang="ts">
import type { CommonInputEmits, CommonInputProps } from './type'
import { ElInput } from 'element-plus'
import { h } from 'vue'

const props = defineProps<CommonInputProps>()

const emit = defineEmits<CommonInputEmits>()

const attrs = useAttrs()

const definModel = defineModel<string>()

console.log('props', props)
console.log('attrs', attrs)
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

<style lang="scss" scoped>

</style>
