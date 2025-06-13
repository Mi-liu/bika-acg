<script setup lang="ts">
import type { CommonComponentProps } from './type'
import { computed } from 'vue'
import { useMergePropsToAttrs } from '../../hooks/useComponents'

defineOptions({
  name: 'CommonComponent',
  inheritAttrs: false,
})

/** 此props只做类型提示，实际上是个空值 */
const props = defineProps<CommonComponentProps>()

const mergedAttrs = useMergePropsToAttrs(props)

/** 所有的组件 */
const componentMap: Record<string, Component>
 = Object.fromEntries(Object.entries(
   import.meta.glob<{
     default: Component
   }>(['@/common/src/components/*/index.vue', '@/components/*/index.vue'], {
     eager: true,
   }),
 ).map(([key, value]) => {
   const name = key.split('/').at(-2)!
   return [name, value.default]
 }))

const componentNode = computed(() => {
  const name = mergedAttrs.value.is
  const component = componentMap[name]
  if (!component) {
    console.warn(`${name}组件不存在于common/src/components或@/components/* 中`)
  }

  return component
})

const modelValue = defineModel<any>()
</script>

<template>
  <componentNode v-bind="mergedAttrs.props" v-model="modelValue">
    <template v-for="(_, name) in $slots" :key="name" #[name]="scoped">
      <slot :name="name" v-bind="scoped" />
    </template>
  </componentNode>
</template>

<style scoped>

</style>
