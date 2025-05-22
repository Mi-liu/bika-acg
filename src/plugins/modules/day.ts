import type { App } from 'vue'
import { Priority } from '@/enum/priority'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

export default {
  index: Priority.Low,
  name: 'day',
  install(app: App) {
    dayjs.extend(utc)
  },
}
