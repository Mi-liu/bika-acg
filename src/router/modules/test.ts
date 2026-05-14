import { createRouterModule } from '../utils'

const name = 'test'

/**
 * 测试路由模块 - 用于测试多级菜单
 */
export default createRouterModule(name, {
  meta: {
    title: '测试中心',
    menu: false,
  },
  children: [
    {
      path: 'basic',
      meta: {
        title: '基础测试',
      },
      component: () => import('@/views/test/index.vue'),
    },
    {
      path: 'advanced',
      meta: {
        title: '高级测试',
      },
      children: [
        {
          path: 'performance',
          meta: {
            title: '性能测试',
          },
          component: () => import('@/views/test/index.vue'),
        },
        {
          path: 'security',
          meta: {
            title: '安全测试',
          },
          children: [
            {
              path: 'auth',
              meta: {
                title: '认证测试',
              },
              component: () => import('@/views/test/index.vue'),
            },
            {
              path: 'permission',
              meta: {
                title: '权限测试',
              },
              component: () => import('@/views/test/index.vue'),
            },
          ],
        },
      ],
    },
    {
      path: 'hidden',
      meta: {
        title: '隐藏测试',
        menu: false, // 这个不会在菜单中显示
      },
      component: () => import('@/views/test/index.vue'),
    },

  ],
})
