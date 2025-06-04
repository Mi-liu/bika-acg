import { Priority } from '@/enum/priority'
import { useRequestProvider } from 'vue-hooks-plus'

export default {
  index: Priority.Low,
  name: 'vue-hooks-plus',
  install() {
    useRequestProvider({
      /** 延迟 loading 变成 true 的时间，有效防止闪烁 */
      loadingDelay: 500,
    })
  },
}
