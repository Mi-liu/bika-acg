<script setup lang="ts">
import type { CommonDialogProps, CommonDialogSlots } from './type'
import CommonButton from '../CommonButton/index.vue'

// TODO 是否拦截关闭按钮，button的 关闭回调

const props = withDefaults(defineProps<CommonDialogProps>(), {
  showFooter: true,
  confirmText: '确定',
  cancelText: '取消',
})

defineSlots<CommonDialogSlots>()

// 对话框可见性
const modelValue = defineModel<boolean>({ default: false })

// 按钮 loading
const loading = ref(false)

/** 关闭对话框前执行 */
function handleBeforeClose(done: () => void) {
  if (loading.value) {
    return
  }
  else if (props.beforeClose) {
    return props.beforeClose(done)
  }
  done()
}

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
    :before-close="handleBeforeClose"
  >
    <el-scrollbar>
      <slot />
    </el-scrollbar>
    <template #footer>
      <slot name="footer">
        <div v-if="showFooter" class="dialog-footer">
          <el-button :disabled="loading" @click="modelValue = false">{{ cancelText }}</el-button>
          <CommonButton v-model="loading" type="primary" @click="handleConfirm">
            {{ confirmText }}
          </CommonButton>
        </div>
      </slot>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>

</style>
