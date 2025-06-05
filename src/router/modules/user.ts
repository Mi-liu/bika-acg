import { createRouterModule } from '../utils'

const name = 'user'

/**
 * 用户相关路由模块
 */
export default createRouterModule(name, {
  children: [
    {
      path: 'favorites',
      component: () => import('@/views/user/favorites.vue'),
    },
    {
      path: 'following',
      component: () => import('@/views/user/following.vue'),
    },
    {
      path: 'watch-later',
      component: () => import('@/views/user/watch-later.vue'),
    },
    {
      path: 'comments',
      component: () => import('@/views/user/comments.vue'),
    },
  ],
})
