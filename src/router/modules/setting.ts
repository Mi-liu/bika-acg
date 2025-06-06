import { createRouterModule } from '../utils'

const name = 'setting'

export default createRouterModule(name, {
  path: '/setting',
  children: [
    {
      path: 'index',
      component: () => import('@/views/setting/index.vue'),
    },
  ],
})
