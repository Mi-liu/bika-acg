import type { App } from 'vue'
import { Priority } from '@/enum/priority'

export default {
  index: Priority.Low,
  name: 'document',
  install(_app: App) {
    document.addEventListener(
      'click',
      (event) => {
        const selection = window.getSelection()
        // 有文本选中，已阻止点击
        if (selection && selection.toString().trim() !== '') {
          event.preventDefault()
          event.stopPropagation()
        }
      },
      true,
    )
  },
}
