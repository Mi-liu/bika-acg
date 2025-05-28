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
        layout: false,
      },
      component: () => import('@/views/auth/login.vue'),
    },
  ],
})
