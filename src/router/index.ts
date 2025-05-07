import { createRouter, createWebHistory } from 'vue-router'
// 导入由 unplugin-vue-router 生成的路由
import { routes, handleHotUpdate } from 'vue-router/auto-routes'

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
  routes,
})

if (import.meta.hot) {
  handleHotUpdate(router)
}

export default router
