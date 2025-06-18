import type { AlovaCustomTypes } from 'alova'
import { createAlova } from 'alova'

import adapterFetch from 'alova/fetch'
import { ApiCode } from '@/enum/apiCode'
import router from '@/router'
import { createHeader } from '@/utils/crypto'
import { filterUndefined, objectToUrlParams } from '@/utils/object'

// 登出处理标志位，防止多个接口同时触发登出逻辑
let isLoggingOut = false

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
        if (data.code === ApiCode.Logout && !isLoggingOut) {
          // 使用标志位防止多个接口同时触发登出逻辑
          isLoggingOut = true
          useUserStoreHook().clearUserProfile()
          router.replace({
            path: '/login/index',
            query: {
              redirect: encodeURIComponent(router.currentRoute.value.fullPath),
            },
          }).finally(() => {
            // 路由跳转完成后重置标志位，允许下次登出
            isLoggingOut = false
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
