<script setup lang="ts">
import CommonButton from '@common/components/CommonButton/index.vue'
import { merge } from 'lodash-es'
import { register } from '@/api/user'

const router = useRouter()
const localStore = useLocalStoreHook()

const formRef = useTemplateRef('formRef')

const form = reactive({
  name: '',
  email: '',
  password: '',
  gender: '',
})

const answer = merge({}, ...Array.from({ length: 3 }).map((_, index) => ({
  [`question${index + 1}`]: `答案是: ${index + 1}`,
  [`answer${index + 1}`]: `${index + 1}`,
})))

const rules = {
  name: [
    { required: true, message: '请输入昵称', trigger: ['blur', 'change'] },
    { min: 2, max: 50, message: '昵称长度在2到50个字符之间', trigger: ['blur', 'change'] },
  ],
  email: [
    { required: true, message: '请输入账号', trigger: ['blur', 'change'] },
    { pattern: /^[a-z0-9]+$/i, message: '账号只能包含数字和字母', trigger: ['blur', 'change'] },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: ['blur', 'change'] },
    { min: 8, message: '密码不少于8位', trigger: ['blur', 'change'] },
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: ['blur', 'change'] },
  ],
}

const gender = [
  {
    label: '男',
    value: 'm',
  },
  {
    label: '女',
    value: 'f',
  },
  {
    label: '机器人',
    value: 'bot',
  },
]

async function handleRegister() {
  await formRef.value?.validate()
  await register({
    ...form,
    ...answer,
    birthday: '2000-01-01',
  })
  await ElMessageBox.alert('注册成功, 是否前往登录?', '提示', {
    confirmButtonText: '确定',
    showCancelButton: true,
    showClose: false,
  })
  localStore.local.ACCOUNT_INFO = {
    email: form.email,
    password: form.password,
  }
  router.push('/login/index')
}
</script>

<template>
  <div class="login relative size-full flex-center">
    <div class="login-bg absolute inset-0" />
    <div class="container relative size-full flex-center">
      <div class="w-900px bg-white rounded-lg flex p-10 items-center">
        <img class="w-280px" src="@/assets/image/login/logo.png" alt="">
        <div class="flex-1 pt-15px ml-5 select-none">
          <el-form
            ref="formRef" autocomplete="off" :rules="rules"
            :model="form"
          >
            <el-form-item label="昵 称" prop="name">
              <el-input v-model="form.name" placeholder="2~50个字符" autocomplete="off" />
            </el-form-item>
            <el-form-item label="账 号" prop="email">
              <el-input v-model="form.email" placeholder="数字 字母 (0-9)[a-Z]" autocomplete="off" />
            </el-form-item>
            <el-form-item label="密 码" prop="password">
              <el-input
                v-model="form.password" placeholder="不少于8位" type="password"
                autocomplete="new-password"
                show-password
              />
            </el-form-item>
            <el-form-item label="性 别" prop="gender">
              <el-radio-group v-model="form.gender">
                <el-radio v-for="item in gender" :key="item.value" :value="item.value">
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <div class="w-full select-none flex justify-end">
                <div class="flex">
                  已有账号？<el-link
                    type="primary" href="https://www.baidu.com" target="_blank"
                    underline="never"
                  >
                    点击登录
                  </el-link>
                </div>
              </div>
            </el-form-item>
            <el-form-item>
              <CommonButton w-full type="primary" @click="handleRegister">注册</CommonButton>
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
