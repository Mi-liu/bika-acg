import { createApp } from 'vue'
import { logAppVersion } from '@/utils/appVersion'
import App from './App.vue'

// 导入插件系统
import plugins from './plugins'
import 'element-plus/theme-chalk/dark/css-vars.css'
import './assets/css/main.css'

// 导入 UnoCSS 样式
import 'virtual:uno.css'

async function bootstrap() {
  const app = createApp(App)

  app.use(plugins)

  const localStore = useLocalStoreHook()

  await localStore.initStorage().catch((error) => {
    console.warn('本地存储初始化失败:', error)
  })

  // 初始化应用并挂载
  app.mount('#app')
  void logAppVersion()
}

bootstrap()
