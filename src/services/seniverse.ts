import type { AlovaCustomTypes } from 'alova'
import { createAlova } from 'alova'
import { axiosRequestAdapter } from '@alova/adapter-axios'

const KEY = 'SjC_GJyODUxKoskYl'

const seniverseAlova = createAlova({
  baseURL: 'https://api.seniverse.com/v3/',
  requestAdapter: axiosRequestAdapter(),
  beforeRequest(method) {
    if (!Reflect.has(method.config.params, 'key')) {
      method.config.params.key = KEY
    }
  },
  responded: {
    onSuccess: async (response) => {
      if (response.status === 200) {
        return response.data
      } else {
        return Promise.reject(response)
      }
    },
  },
})

export default seniverseAlova
