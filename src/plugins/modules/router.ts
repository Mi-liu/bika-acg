import type { App } from 'vue'
import { Priority } from '@/enum/priority'
import router from '@/router'

export default {
  index: Priority.Highest,
  name: 'router',
  install(app: App) {
    app.use(router)
  },
}
