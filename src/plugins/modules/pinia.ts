import type { App } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { Priority } from '@/enum/priority'

export default {
  index: Priority.High,
  name: 'pinia',
  install(app: App) {
    const pinia = createPinia()
    pinia.use(piniaPluginPersistedstate)
    app.use(pinia)
  },
}
