import type { App } from 'vue'
import router from '@/router'
import { Priority } from '@/enum/priority'

export default {
  index: Priority.Highest,
  name: 'router',
  install(app: App) {
    app.use(router)
  },
}
