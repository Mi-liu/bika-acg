<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

// Form data
const loginForm = reactive({
  username: '',
  password: '',
  rememberMe: false
})

// Form validation rules
const rules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
})

// Form instance for validation
const formRef = ref<FormInstance>()

// Loading state for login button
const loading = ref(false)

// Login handler
const handleLogin = async (formEl: FormInstance | undefined) => {
  if (!formEl) return

  await formEl.validate((valid, fields) => {
    if (valid) {
      loading.value = true

      // Simulate API call
      setTimeout(() => {
        ElMessage.success('登录成功')
        loading.value = false
      }, 1500)
    } else {
      ElMessage.error('请正确填写登录信息')
      console.log('验证失败:', fields)
    }
  })
}
</script>

<template>
  <div class="login-form flex-1 flex flex-col">
    <h2 class="text-xl mb-6">登录</h2>

    <el-form ref="formRef" :model="loginForm" :rules="rules" class="w-full">
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" placeholder="用户名" class="h-12 mb-4" />
      </el-form-item>

      <el-form-item prop="password">
        <el-input v-model="loginForm.password" type="password" placeholder="密码" class="h-12 mb-2" show-password />
      </el-form-item>

      <div class="flex justify-between items-center mb-6">
        <el-checkbox v-model="loginForm.rememberMe">记住我</el-checkbox>
      </div>

      <el-button type="primary"
        class="w-full h-12 text-lg font-normal rounded-md transition-all duration-300 hover:opacity-90"
        :loading="loading" @click="handleLogin(formRef)">
        <i class="i-ep-right mr-2"></i>
        登录
      </el-button>
    </el-form>

    <div class="links mt-auto pt-8 text-sm text-gray-600">
      <div class="mb-1">
        <a href="#" class="text-primary hover:underline">创建账号</a>
      </div>
      <div>
        <a href="#" class="text-primary hover:underline">忘记密码?</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-form :deep(.el-input__wrapper) {
  background-color: #f5f5f5 !important;
  border-radius: 4px;
  padding: 0 12px;
}

.login-form :deep(.el-input__inner) {
  height: 48px !important;
}

.login-form :deep(.el-button) {
  font-weight: 400;
  letter-spacing: 1px;
}

.login-form :deep(.el-form-item__error) {
  margin-top: -4px;
}

/* Field animations */
.login-form :deep(.el-form-item) {
  transition: transform 0.3s ease-in-out;
}

.login-form :deep(.el-form-item:focus-within) {
  transform: translateY(-2px);
}
</style>
