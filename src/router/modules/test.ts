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
    {
      path: 'account-switch',
      meta: {
        title: '账号切换测试',
      },
      component: () => import('@/views/test/account-switch-test.vue'),
    },
  ],
})
