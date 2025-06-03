import { createPinia, type PiniaPluginContext } from 'pinia'

const store = createPinia()

// 使用 Vite 的 import.meta.globEager 一键导入pinia所有插件
const modules = import.meta.glob<{ default: (context: PiniaPluginContext) => void }>(
  './plugin/*.ts',
  { eager: true },
)

Object.entries(modules).forEach(([, value]) => {
  store.use(value.default)
})

export { store }
