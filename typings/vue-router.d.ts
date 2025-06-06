import type { RouteLocationNormalizedLoaded, Router } from 'vue-router'

export {}
declare module 'vue-router' {
  /** 这里仅作类型提示，若 类型为必填类型，则需要在 vite.config VueRouter.extendRoute 中显示声明 */
  interface RouteMeta {
    /** 标题 */
    title?: string
    /** 是否在 layout 中显示 默认为 true */
    layout?: boolean
  }
}

declare module '@vue/runtime-core' {
}
