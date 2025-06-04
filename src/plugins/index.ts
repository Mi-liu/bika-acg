import type { App } from 'vue'

export default function (app: App) {
  // 导入 modules 下的所有依赖
  const modules = Object.entries(
    import.meta.glob<{
      default: {
        index: number
        name: string
        install: (app: App) => void
      }
    }>('./modules/**/*.ts', {
            eager: true,
          }),
  )
    .map(([, value]) => value.default)
    .sort((a, b) => a.index - b.index)

  // 安装所有模块
  modules.forEach((module) => {
    module.install(app)
  })
}
