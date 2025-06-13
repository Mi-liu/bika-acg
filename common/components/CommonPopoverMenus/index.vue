<script setup lang="ts">
import type { CommonPopoverMenuProps } from './type'
import { CommonButton } from '../CommonButton'

defineProps<CommonPopoverMenuProps>()
</script>

<template>
  <el-popover>
    <template #reference>
      <slot />
    </template>
    <div class="w-full flex flex-col gap-y-1">
      <CommonButton
        v-for="menu in menus"
        :key="menu.label"
        class="w-full ml-0!" size="default"
        v-bind="menu"
      >
        {{ menu.label }}
      </CommonButton>
    </div>
  </el-popover>
</template>

<style lang="scss" scoped>

</style>
