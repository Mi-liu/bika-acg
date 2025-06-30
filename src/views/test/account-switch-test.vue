<script setup lang="ts">
const localStore = useLocalStoreHook()

// 测试数据
const testAccounts = [
  { email: 'test1@example.com', password: 'password1' },
  { email: 'test2@example.com', password: 'password2' },
  { email: 'test3@example.com', password: 'password3' },
]

/**
 * 添加测试账号
 */
function addTestAccounts() {
  testAccounts.forEach(account => {
    localStore.addOrUpdateAccount(account)
  })
  ElMessage.success('测试账号已添加')
}

/**
 * 清空账号列表
 */
function clearAccounts() {
  localStore.local.ACCOUNT_LIST = []
  ElMessage.success('账号列表已清空')
}

/**
 * 查看账号列表
 */
function viewAccountList() {
  console.log('当前账号列表:', localStore.local.ACCOUNT_LIST)
  ElMessage.info(`当前有 ${localStore.local.ACCOUNT_LIST.length} 个账号`)
}
</script>

<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-6">账号切换功能测试</h2>
    
    <div class="space-y-4 mb-8">
      <el-button type="primary" @click="addTestAccounts">
        添加测试账号
      </el-button>
      <el-button type="warning" @click="clearAccounts">
        清空账号列表
      </el-button>
      <el-button type="info" @click="viewAccountList">
        查看账号列表
      </el-button>
    </div>
    
    <div class="bg-gray-50 p-4 rounded-lg">
      <h3 class="font-bold mb-4">当前账号列表 ({{ localStore.local.ACCOUNT_LIST.length }})</h3>
      <div v-if="localStore.local.ACCOUNT_LIST.length === 0" class="text-gray-500">
        暂无账号
      </div>
      <div v-else class="space-y-2">
        <div
          v-for="(account, index) in localStore.local.ACCOUNT_LIST"
          :key="account.email"
          class="flex items-center justify-between p-3 bg-white rounded border"
        >
          <div>
            <div class="font-medium">{{ account.email }}</div>
            <div class="text-sm text-gray-500">
              最后登录: {{ account.lastLoginTime ? new Date(account.lastLoginTime).toLocaleString() : '从未登录' }}
            </div>
          </div>
          <el-button
            type="danger"
            size="small"
            @click="localStore.removeAccount(account.email)"
          >
            删除
          </el-button>
        </div>
      </div>
    </div>
    
    <div class="mt-8">
      <h3 class="font-bold mb-4">功能说明</h3>
      <ul class="list-disc list-inside space-y-2 text-sm text-gray-600">
        <li>点击"添加测试账号"会添加3个测试账号到列表中</li>
        <li>账号会按最后登录时间排序，最近的在前面</li>
        <li>在登录页面会显示"选择其他账号"按钮（如果有保存的账号）</li>
        <li>在用户头像下拉菜单中会有"切换账号"选项</li>
        <li>账号列表页面支持选择账号登录和删除账号</li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>
