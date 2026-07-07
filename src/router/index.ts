import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'
import { getRouteTitle } from './title'

const title = useTitle('首页', { titleTemplate: '%s | 哔咔漫画' })

// 使用 Vite 的 import.meta.globEager 一键导入所有路由模块
const modules = import.meta.glob<{ default: RouteRecordRaw }>('./modules/*.ts', { eager: true })

const routes = Object.entries(modules).map(([, value]) => value.default)

// console.log(routes)

/**
 * 创建路由实例
 *
 * 手动配置的路由系统，支持：
 * - 模块化路由管理
 * - 自动 props 传递
 * - 热更新URL参数保持
 */
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})

router.afterEach((to) => {
  title.value = getRouteTitle(to)
})

export default router
