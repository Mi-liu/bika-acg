import type { RouteRecordRaw } from 'vue-router'

/**
 * 首页路由模块
 */
export default {
  path: '/',
  name: 'Home',
  component: () => import('@/views/home/index.vue'),
  meta: {
    title: '首页',
  },
} as RouteRecordRaw
