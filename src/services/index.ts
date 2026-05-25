import type { AlovaCustomTypes } from 'alova'
import { createAlova } from 'alova'

import adapterFetch from 'alova/fetch'
import { ApiCode } from '@/enum/apiCode'
import router from '@/router'
import { createHeader } from '@/utils/crypto'
import { filterUndefined, objectToUrlParams } from '@/utils/object'

// 登出处理标志位，防止多个接口同时触发登出逻辑
let isLoggingOut = false
const loginPath = '/login/index'
const authFreeUrls = new Set(['auth/sign-in', 'auth/register'])

function getLogoutRedirect() {
  const currentRoute = router.currentRoute.value
  const redirect = currentRoute.query.redirect

  if (currentRoute.path.startsWith('/login')) {
    return typeof redirect === 'string' ? redirect : undefined
  }

  return encodeURIComponent(currentRoute.fullPath)
}

function replaceToLogin() {
  const redirect = getLogoutRedirect()

  return router.replace({
    path: loginPath,
    query: redirect ? { redirect } : undefined,
  })
}

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
    method.baseURL = settingStore.comic.apiProxy
    const requestPath = method.type === 'GET'
      ? objectToUrlParams(filterUndefined(method.config.params), method.url)
      : method.url

    // 设置请求头
    Object.assign(
      method.config.headers,
      createHeader(
        requestPath,
        method.type,
        { auth: !authFreeUrls.has(method.url) },
      ),
    )
  },
  responded: {
    onSuccess: async (response, method) => {
      const meta = Object.assign({}, defaultAlovaMeta, method.meta)
      try {
        const data: Response = await response.json()

        if (data.code === ApiCode.Logout && !isLoggingOut) {
          // 使用标志位防止多个接口同时触发登出逻辑
          isLoggingOut = true
          useUserStoreHook().clearUserProfile()
          replaceToLogin().finally(() => {
            // 路由跳转完成后重置标志位，允许下次登出
            isLoggingOut = false
          })
        }

        if (response.status >= 400 || data.code !== ApiCode.Success) {
          throw data
        }

        return data.data
      }
      catch (err) {
        const errorMessage = err instanceof Error ? err.message : (err as Response | undefined)?.message
        meta.message && ElMessage.error(errorMessage || '请求失败')
        return Promise.reject(err)
      }
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
