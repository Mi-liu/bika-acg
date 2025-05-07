<script setup lang="ts">
import { login } from '@/api/user'
import CommonButton from '@common/components/CommonButton/index.vue'
const userStore = useUserStoreHook()

const form = reactive({
  email: '17608921776',
  password: 'a17608921776',
})

const handleLogin = () => {
  login(form).then((res) => {
    userStore.token = res.token
  })
}
</script>

<template>
  <div class="size-full flex-center">
    <div class="w-500px flex-center bg-white rounded-lg p-10">
      <CommonButton>111</CommonButton>
      <el-form w-full>
        <el-form-item>
          <el-input v-model="form.email" placeholder="用户名" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="form.password" placeholder="密码" />
        </el-form-item>
        <el-form-item>
          <el-button w-full type="primary" @click="handleLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped></style>
