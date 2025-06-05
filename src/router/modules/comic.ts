import { createRouterModule } from '../utils'

const name = 'comic'

/**
 * 漫画相关路由模块
 */
export default createRouterModule(name, {
  children: [
    {
      path: 'list',
      component: () => import('@/views/comic/list.vue'),
    },
    {
      path: 'search',
      component: () => import('@/views/comic/search.vue'),
    },
    {
      path: 'detail/:id',
      component: () => import('@/views/comic/detail.vue'),
      meta: {
        title: '漫画详情',
      },
    },
    {
      path: 'chapter/:id',
      component: () => import('@/views/comic/chapter.vue'),
      meta: {
        title: '章节阅读',
        layout: false,
      },
    },
  ],
})
