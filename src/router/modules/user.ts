import { getFileName } from '@/utils/file'
import { createRouterModule } from '../utils'

const name = getFileName(import.meta.url).baseName

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
  ],
})
