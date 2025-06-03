import type { App } from 'vue'
import { Priority } from '@/enum/priority'
import { store } from '@/store'

export default {
  index: Priority.High,
  name: 'pinia',
  install(app: App) {
    app.use(store)
  },
}
