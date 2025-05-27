import { getFileName } from '@/utils/file'
import { createRouterModule } from '../utils'

const name = getFileName(import.meta.url).baseName

export default createRouterModule(name, {
  redirect: '/login',
  children: [
    {
      path: 'login',
      meta: {
        title: '登录',
      },
      component: () => import('@/views/login/index.vue'),
    },
  ],
})
