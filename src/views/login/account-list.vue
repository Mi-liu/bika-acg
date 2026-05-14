<script setup lang="ts">
import CommonButton from '@common/components/CommonButton/index.vue'
import { login } from '@/api/user'

const userStore = useUserStoreHook()
const localStore = useLocalStoreHook()
const router = useRouter()

const props = defineProps<{
  redirect?: string
}>()

/**
 * 处理账号登录
 * @param account 账号信息
 */
function handleAccountLogin(account: { email: string, password: string }) {
  const form = { ...account }
  
  login(form).then((res) => {
    userStore.token = res.token
    
    // 更新当前账号信息
    localStore.local.ACCOUNT_INFO = { ...form }
    // 更新账号列表中的最后登录时间
    localStore.addOrUpdateAccount({ ...form })
    
    ElMessage.success(`欢迎回来，${account.email}`)
    
    if (props.redirect) {
      router.replace(decodeURIComponent(props.redirect))
    }
    else {
      router.push('/')
    }
  }).catch((error) => {
    ElMessage.error(error.message || '登录失败')
  })
}

/**
 * 删除账号
 * @param email 邮箱地址
 */
function handleDeleteAccount(email: string) {
  ElMessageBox.confirm(`确定要删除账号 ${email} 吗？`, '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    localStore.removeAccount(email)
    ElMessage.success('账号已删除')
  }).catch(() => {
    // 用户取消删除
  })
}

/**
 * 返回登录页面
 */
function handleBackToLogin() {
  router.replace('/login/index')
}

/**
 * 格式化最后登录时间
 * @param timestamp 时间戳
 */
function formatLastLoginTime(timestamp?: number): string {
  if (!timestamp) return '从未登录'
  
  const now = Date.now()
  const diff = now - timestamp
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 30) return `${days}天前`
  
  return new Date(timestamp).toLocaleDateString()
}
</script>

<template>
  <div class="account-list relative size-full flex-center">
    <div class="account-list-bg absolute inset-0" />
    <div class="container relative size-full flex-center">
      <div class="w-600px bg-white rounded-lg p-8">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-800">选择账号</h2>
          <el-button type="primary" link @click="handleBackToLogin">
            <i class="i-ep-back mr-1" />
            返回登录
          </el-button>
        </div>
        
        <div v-if="localStore.local.ACCOUNT_LIST.length === 0" class="text-center py-12">
          <div class="text-gray-400 text-lg mb-4">
            <i class="i-ep-user text-4xl mb-2" />
            <div>暂无保存的账号</div>
          </div>
          <CommonButton type="primary" @click="handleBackToLogin">
            去登录
          </CommonButton>
        </div>
        
        <div v-else class="space-y-3">
          <div
            v-for="account in localStore.local.ACCOUNT_LIST"
            :key="account.email"
            class="account-item flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer"
            @click="handleAccountLogin(account)"
          >
            <div class="flex items-center flex-1">
              <div class="w-12 h-12 bg-blue-100 rounded-full flex-center mr-4">
                <i class="i-ep-user text-blue-600 text-xl" />
              </div>
              <div class="flex-1">
                <div class="font-medium text-gray-800 mb-1">{{ account.email }}</div>
                <div class="text-sm text-gray-500">
                  最后登录：{{ formatLastLoginTime(account.lastLoginTime) }}
                </div>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <el-button
                type="danger"
                size="small"
                link
                @click.stop="handleDeleteAccount(account.email)"
              >
                <i class="i-ep-delete" />
              </el-button>
            </div>
          </div>
        </div>
        
        <div class="mt-6 pt-4 border-t border-gray-200">
          <CommonButton w-full type="primary" plain @click="handleBackToLogin">
            <i class="i-ep-plus mr-1" />
            添加新账号
          </CommonButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.account-list {
  .account-list-bg {
    background-image: url('@/assets/image/login/bg.png');
    background-size: cover;
    background-position: center;
  }
  
  .account-item {
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  }
}
</style>
