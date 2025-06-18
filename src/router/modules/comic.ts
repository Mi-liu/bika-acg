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
      meta: {
        title: '搜索',
      },
      component: () => import('@/views/comic/search.vue'),
    },
    {
      path: 'detail/:id',
      meta: {
        title: '漫画详情',
      },
      component: () => import('@/views/comic/detail.vue'),
    },
    {
      path: 'chapter/:id',
      meta: {
        title: '章节阅读',
      },
      component: () => import('@/views/comic/chapter.vue'),
    },
    {
      path: 'ranking',
      meta: {
        title: '排行榜',
      },
      component: () => import('@/views/comic/ranking.vue'),
    },
  ],
})
