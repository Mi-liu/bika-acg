<script setup lang="ts">
import CommonButton from '@common/components/CommonButton/index.vue'
import { login } from '@/api/user'

const props = defineProps<{
  redirect?: string
}>()

const userStore = useUserStoreHook()
const localStore = useLocalStoreHook()

const router = useRouter()

const form = reactive({
  email: '',
  password: '',
})
const remember = ref(true)

// 从 localStore 获取账号信息
form.email = localStore.local.ACCOUNT_INFO.email
form.password = localStore.local.ACCOUNT_INFO.password

function handleLogin() {
  login(form).then((res) => {
    userStore.token = res.token
    if (remember.value) {
      localStore.local.ACCOUNT_INFO = { ...form }
    }
    else {
      localStore.local.ACCOUNT_INFO = { email: '', password: '' }
    }
    if (props.redirect) {
      router.replace(decodeURIComponent(props.redirect))
    }
    else {
      router.push('/')
    }
  })
}
</script>

<template>
  <div class="login relative size-full flex-center">
    <div class="login-bg absolute inset-0" />
    <div class="container relative size-full flex-center">
      <div class="w-700px bg-white rounded-lg flex p-10 items-center">
        <img class="w-200px" src="@/assets/image/login/logo.png" alt="">
        <div class="flex-1 pt-15px ml-5">
          <el-form>
            <el-form-item>
              <el-input v-model="form.email" placeholder="账号" />
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="form.password" placeholder="密码" type="password"
                show-password
              />
            </el-form-item>
            <el-form-item>
              <div class="w-full select-none flex justify-between">
                <el-checkbox v-model="remember">
                  记住密码
                </el-checkbox>
                <div class="flex">
                  还没有账号？<el-link
                    type="primary" underline="never"
                    @click="router.replace('/login/register')"
                  >
                    点击注册
                  </el-link>
                </div>
              </div>
            </el-form-item>
            <el-form-item>
              <CommonButton w-full type="primary" @click="handleLogin">登录</CommonButton>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <!-- <div class="w-500px flex-center bg-white rounded-lg p-10">
      <el-form w-full>
        <el-form-item>
          <el-input v-model="form.email" placeholder="用户名" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="form.password" placeholder="密码" />
        </el-form-item>
        <el-form-item>
          <CommonButton w-full type="primary" @click="handleLogin">登录</CommonButton>
        </el-form-item>
      </el-form>
    </div> -->
  </div>
</template>

<style scoped lang="scss">
.login {
  .login-bg {
    background-image: url('@/assets/image/login/bg.png');
    background-size: cover;
    background-position: center;
    // filter: blur(10px);
  }
}
</style>
