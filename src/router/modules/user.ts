import { createRouterModule } from '../utils'

const name = 'user'

/**
 * 用户相关路由模块
 */
export default createRouterModule(name, {
  children: [
    {
      path: 'favorites',
      meta: {
        title: '收藏',
      },
      component: () => import('@/views/user/favorites.vue'),
    },
    {
      path: 'following',
      meta: {
        title: '关注',
      },
      component: () => import('@/views/user/following.vue'),
    },
    {
      path: 'watch-later',
      meta: {
        title: '稍后阅读',
      },
      component: () => import('@/views/user/watch-later.vue'),
    },
    {
      path: 'comments',
      meta: {
        title: '评论',
      },
      component: () => import('@/views/user/comments.vue'),
    },
  ],
})
