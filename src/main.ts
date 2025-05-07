import './assets/main.css'
// 导入 UnoCSS 样式
import 'uno.css'

import { createApp } from 'vue'
import App from './App.vue'

// 导入插件系统
import plugins from './plugins'
// 导入 Pinia 存储

const app = createApp(App)

app.use(plugins)

// 初始化应用并挂载
app.mount('#app')
