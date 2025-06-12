import { createRouterModule } from '../utils'

const name = 'test'

/**
 * 登录路由模块
 */
export default createRouterModule(name, {
  children: [
    {
      path: 'index',
      meta: {
        title: '测试',
        layout: false,
      },
      component: () => import('@/views/test/index.vue'),
    },
  ],
})
