<script setup lang="ts">
import type { CommonButtonProps } from './type'

defineOptions({
  name: 'CommonButton',
})

const props = defineProps<CommonButtonProps>()

const slots = useSlots()

console.log(slots);


</script>

<template>
  <el-button v-bind="props">
    <template v-for="(_, name) in $slots" :key="name" #[name]="scoped">
      <slot :name="name" v-bind="scoped || {}" />
    </template>
  </el-button>
</template>

<style lang="scss" scoped></style>