import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
// 导入由 unplugin-vue-router 生成的路由
import { routes, handleHotUpdate } from 'vue-router/auto-routes'
import { cloneDeep } from 'lodash-es'

const cloneRoutes = cloneDeep(routes)

function addPropsToRoutes(routes: RouteRecordRaw[]) {
  routes.forEach((route) => {
    route.props = (route) => ({ ...route.query, ...route.params })
    if (route.children && route.children.length > 0) {
      addPropsToRoutes(route.children)
    }
  })
}

addPropsToRoutes(cloneRoutes)

/**
 * 使用 unplugin-vue-router 创建路由实例
 *
 * unplugin-vue-router 会自动根据 src/views 目录结构生成路由
 * 不需要手动定义路由配置
 *
 * 文件命名约定:
 * - src/views/index.vue -> /
 * - src/views/about.vue -> /about
 * - src/views/users/[id].vue -> /users/:id (动态路由)
 * - src/views/posts/[...slug].vue -> /posts/* (捕获所有路由)
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: cloneRoutes,
})

// 热更新时保持当前路由状态
if (import.meta.hot) {
  // 使用专门的热更新助手

  // 执行原始的热更新处理
  handleHotUpdate(router)
}

export default router
