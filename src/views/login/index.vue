<script setup lang="ts">
import CommonButton from '@common/components/CommonButton/index.vue'
import { User } from '@element-plus/icons-vue'
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

const isLoading = ref(false)
async function handleLogin() {
  if (isLoading.value) {
    return
  }

  isLoading.value = true
  try {
    const res = await login(form)
    userStore.token = res.token
    if (remember.value) {
      localStore.local.ACCOUNT_INFO = { ...form }
      // 将账号添加到账号列表
      localStore.addOrUpdateAccount({ ...form })
    }
    else {
      localStore.local.ACCOUNT_INFO = { email: '', password: '' }
    }
    if (props.redirect) {
      await router.replace(decodeURIComponent(props.redirect))
    }
    else {
      await router.push('/')
    }
  }
  catch {
    // 请求层会统一展示错误消息，这里只负责收尾 loading 状态。
  }
  finally {
    isLoading.value = false
  }
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
              <CommonButton
                w-full type="primary"
                @click="handleLogin"
              >
                登录
              </CommonButton>
            </el-form-item>
            <el-form-item v-if="localStore.local.ACCOUNT_LIST.length > 0">
              <el-button
                w-full type="info" plain
                @click="router.replace('/login/account-list')"
              >
                <el-icon class="mr-1">
                  <User />
                </el-icon>
                选择其他账号 ({{ localStore.local.ACCOUNT_LIST.length }})
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login {
  .login-bg {
    background-image: url('@/assets/image/login/bg.webp');
    background-size: cover;
    background-position: center;
    // filter: blur(10px);
  }
}
</style>
