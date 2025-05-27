import { getFileName } from '@/utils/file'
import { createRouterModule } from '../utils'

const name = getFileName(import.meta.url).baseName

/**
 * 漫画相关路由模块
 */
export default createRouterModule(name, {
  redirect: '/list',
  children: [
    {
      path: 'list',
      component: () => import('@/views/list/index.vue'),
    },
    {
      path: 'detail/:id',
      component: () => import('@/views/detail/[id].vue'),
      props: true,
      meta: {
        title: '漫画详情',
      },
    },
    {
      path: 'chapter/:id/:chapter/:maxChapter',
      component: () => import('@/views/chapter.vue'),
      props: true,
      meta: {
        title: '章节阅读',
        layout: false,
      },
    },
  ],
})
