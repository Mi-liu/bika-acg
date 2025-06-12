<script setup lang="ts">
import type { CommonDialogProps, CommonDialogSlots } from './type'
import CommonButton from '../CommonButton/index.vue'

const props = withDefaults(defineProps<CommonDialogProps>(), {
  showFooter: true,
  confirmText: '确定',
  cancelText: '取消',
})

defineSlots<CommonDialogSlots>()

// 对话框可见性
const modelValue = defineModel<boolean>({ default: false })

function handleConfirm() {
  return Promise.resolve(props.beforeConfirm?.()).then(() => {
    modelValue.value = false
  })
}
</script>

<template>
  <el-dialog
    v-bind="props"
    v-model="modelValue"
  >
    <el-scrollbar>
      <slot />
    </el-scrollbar>
    <template #footer>
      <slot name="footer">
        <div v-if="showFooter" class="dialog-footer">
          <el-button @click="modelValue = false">{{ cancelText }}</el-button>
          <CommonButton type="primary" @click="handleConfirm">
            {{ confirmText }}
          </CommonButton>
        </div>
      </slot>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>

</style>
