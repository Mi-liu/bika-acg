import type { CommonDialogOptions, CommonDialogSlots } from './type'
import { createApp, h } from 'vue'
import CommonDialog from './index.vue'
/**
 * 显示通用对话框
 * @param options 对话框配置选项
 */
export function useCommonDialog(options: CommonDialogOptions = {}, children?: CommonDialogSlots) {
  const { promise, resolve, reject } = Promise.withResolvers()

  // 创建容器元素
  const container = document.createElement('div')

  const app = createApp(() => {
    return h(CommonDialog, {
      ...options,
      beforeConfirm: () => {
        return Promise.resolve(options.beforeConfirm?.()).then(resolve).catch((error) => {
          reject(error)
          return Promise.reject(error)
        })
      },
      modelValue: true,
      onClosed() {
        options.onClosed?.()
        console.log('卸载元素')
        app.unmount()
        document.body.removeChild(container)
      },
    }, children)
  })
  document.body.appendChild(container)

  app.mount(container)

  return promise
}
