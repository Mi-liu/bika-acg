import type { Router } from 'vue-router'

export {}

declare module 'vue-router' {
  interface RouteMeta {
    /** 标题 */
    title?: string
    /** 是否在 layout 中显示 默认为 true */
    layout?: boolean
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $router: Router
  }
}
