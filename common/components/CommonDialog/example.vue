<script setup lang="ts">
import {
  useCommonDialog,
  useConfirmDialog,
  useInfoDialog,
  useWarningDialog,
} from './hooks'

const lastResult = ref<boolean | null>(null)

/**
 * 显示基础对话框
 */
async function showBasicDialog() {
  try {
    const result = await useCommonDialog({
      title: '基础对话框',
      content: '这是一个基础的对话框示例。',
    })
    lastResult.value = result
  }
  catch (error) {
    console.log('对话框被关闭')
    lastResult.value = false
  }
}

/**
 * 显示确认对话框
 */
async function showConfirmDialog() {
  try {
    const result = await useConfirmDialog(
      '您确定要执行此操作吗？此操作不可撤销。',
      '确认操作',
    )
    lastResult.value = result
  }
  catch (error) {
    console.log('对话框被关闭')
    lastResult.value = false
  }
}

/**
 * 显示信息对话框
 */
async function showInfoDialog() {
  try {
    const result = await useInfoDialog(
      '操作已成功完成！',
      '操作成功',
    )
    lastResult.value = result
  }
  catch (error) {
    console.log('对话框被关闭')
    lastResult.value = false
  }
}

/**
 * 显示警告对话框
 */
async function showWarningDialog() {
  try {
    const result = await useWarningDialog(
      '请注意：此功能正在维护中，可能会影响正常使用。',
      '系统维护提醒',
    )
    lastResult.value = result
  }
  catch (error) {
    console.log('对话框被关闭')
    lastResult.value = false
  }
}

/**
 * 显示自定义对话框
 */
async function showCustomDialog() {
  try {
    const result = await useCommonDialog({
      title: '自定义对话框',
      content: '这是一个自定义样式的对话框。',
      width: '600px',
      cancelButtonText: '稍后再说',
      confirmButtonText: '立即处理',
      closeOnClickModal: false,
      closeOnPressEscape: false,
    })
    lastResult.value = result
  }
  catch (error) {
    console.log('对话框被关闭')
    lastResult.value = false
  }
}

/**
 * 显示插槽对话框
 */
async function showSlotDialog() {
  try {
    const result = await useCommonDialog({
      title: '插槽对话框',
      content: '这是一个可以使用插槽自定义内容的对话框。',
      width: '700px',
    })
    lastResult.value = result
  }
  catch (error) {
    console.log('对话框被关闭')
    lastResult.value = false
  }
}
</script>

<template>
  <div class="dialog-example">
    <h2>CommonDialog 使用示例</h2>

    <div class="button-group">
      <el-button @click="showBasicDialog">基础对话框</el-button>
      <el-button @click="showConfirmDialog">确认对话框</el-button>
      <el-button @click="showInfoDialog">信息对话框</el-button>
      <el-button @click="showWarningDialog">警告对话框</el-button>
      <el-button @click="showCustomDialog">自定义对话框</el-button>
      <el-button @click="showSlotDialog">插槽对话框</el-button>
    </div>

    <div v-if="lastResult !== null" class="result">
      <h3>上次操作结果：</h3>
      <p>{{ lastResult ? '确认' : '取消' }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dialog-example {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;

  h2 {
    color: var(--el-text-color-primary);
    margin-bottom: 20px;
  }

  .button-group {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 20px;
  }

  .result {
    padding: 16px;
    background-color: var(--el-bg-color-page);
    border-radius: 8px;
    border: 1px solid var(--el-border-color);

    h3 {
      margin: 0 0 8px 0;
      color: var(--el-text-color-primary);
      font-size: 16px;
    }

    p {
      margin: 0;
      color: var(--el-text-color-regular);
      font-size: 14px;
    }
  }
}
</style>
