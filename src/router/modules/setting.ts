import { createRouterModule } from '../utils'

const name = 'setting'

export default createRouterModule(name, {
  path: '/setting',
  children: [
    {
      path: 'index',
      meta: {
        title: '设置',
      },
      component: () => import('@/views/setting/index.vue'),
    },
  ],
})
