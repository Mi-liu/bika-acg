import type { App } from 'vue'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { Priority } from '@/enum/priority'

export default {
  index: Priority.Low,
  name: 'day',
  install(_app: App) {
    dayjs.extend(utc)
  },
}
