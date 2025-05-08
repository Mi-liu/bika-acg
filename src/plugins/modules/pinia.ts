import type { App } from 'vue'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { Priority } from '@/enum/priority'
import { store } from '@/store'

export default {
  index: Priority.High,
  name: 'pinia',
  install(app: App) {
    store.use(piniaPluginPersistedstate)
    app.use(store)
  },
}
