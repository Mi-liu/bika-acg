import { createRouterModule } from '../utils'

const name = 'login'

/**
 * 登录路由模块
 */
export default createRouterModule(name, {
  children: [
    {
      path: 'index',
      meta: {
        title: '登录',
        layout: false,
      },
      component: () => import('@/views/login/index.vue'),
    },
    {
      path: 'register',
      meta: {
        title: '注册',
        layout: false,
      },
      component: () => import('@/views/login/register.vue'),
    },
    {
      path: 'account-list',
      meta: {
        title: '账号列表',
        layout: false,
      },
      component: () => import('@/views/login/account-list.vue'),
    },
  ],
})
