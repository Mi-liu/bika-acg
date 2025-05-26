import './assets/css/main.css'
// 导入 UnoCSS 样式
import 'virtual:uno.css'

import { createApp } from 'vue'
import App from './App.vue'

// 导入插件系统
import plugins from './plugins'

const app = createApp(App)

app.use(plugins)

// 初始化应用并挂载
app.mount('#app')
