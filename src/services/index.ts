import type { AlovaCustomTypes } from 'alova'
import { createAlova } from 'alova'

import adapterFetch from 'alova/fetch'
import { createHeader } from '@/utils/crypto'
import { objectToUrlParams, filterUndefined } from '@/utils/object'
import { ApiCode } from '@/enum/apiCode'
import router from '@/router'
export interface Response<T = unknown> {
  code: number
  data: T
  message: string
}

/** 默认的alova元数据 */
const defaultAlovaMeta: AlovaCustomTypes['meta'] = {
  /** 默认显示错误信息 */
  message: true,
}

const alova = createAlova({
  requestAdapter: adapterFetch(),
  beforeRequest(method) {
    const settingStore = useSettingStoreHook()
    method.baseURL = settingStore.comic.proxy.api
    // 设置请求头
    Object.assign(
      method.config.headers,
      createHeader(
        method.type === 'GET'
          ? objectToUrlParams(filterUndefined(method.config.params), method.url)
          : method.url,
        method.type,
      ),
    )
  },
  responded: {
    onSuccess: async (response, method) => {
      const meta = Object.assign({}, defaultAlovaMeta, method.meta)
      return new Promise(async (resolve, reject) => {
        const data: Response = await response.json()
        if (response.status >= 400) {
          reject(data)
        }
        if (data.code !== ApiCode.Success) {
          reject(data)
        }
        if (data.code === ApiCode.Logout) {
          useUserStoreHook().clearUserProfile()
          router.replace({
            path: '/auth/login',
            query: {
              redirect: encodeURIComponent(router.currentRoute.value.fullPath),
            },
          })
        }
        resolve(data.data)
      }).catch((err) => {
        meta.message && ElMessage.error(err.message || '请求失败')
        return Promise.reject(err)
      })
    },
    /** 使用alova/fetch请求适配器时, 只有在连接超时或连接中断时才会触发 */
    onError: async (error) => {
      ElMessage.error(error.message)
      return Promise.reject(error)
    },
    // onComplete: async (res) => {},
  },
})

export default alova
