import { cloneDeep } from 'lodash-es'
import { pictureQuality } from '@/constants/options'
import { apiProxy, fileProxy } from '@/services/config'
import { store } from '@/store'

interface LegacyProxyConfig {
  api?: string
  file?: string
}

interface PersistedSettingState {
  appearance?: {
    themeMode?: ThemeMode
  }
  comic?: {
    apiProxy?: string
    fileProxy?: string
    proxy?: LegacyProxyConfig
  }
}

export type ThemeMode = 'system' | 'light' | 'dark'

function migrateLegacyProxyStorage() {
  const storageKey = 'setting'
  const raw = window.localStorage.getItem(storageKey)

  if (!raw)
    return

  const state = JSON.parse(raw) as PersistedSettingState
  const comic = state.comic
  const legacyProxy = comic?.proxy

  if (!comic || !legacyProxy)
    return

  let changed = false

  if (!comic.apiProxy && legacyProxy.api) {
    comic.apiProxy = legacyProxy.api
    changed = true
  }

  if (!comic.fileProxy && legacyProxy.file) {
    comic.fileProxy = legacyProxy.file
    changed = true
  }

  delete comic.proxy
  changed = true

  if (changed) {
    window.localStorage.setItem(storageKey, JSON.stringify(state))
  }
}

const useSettingStore = defineStore(
  'setting',
  () => {
    /** 漫画设置 */
    const appearance = reactive({
      themeMode: 'system' as ThemeMode,
    })

    const comic = reactive({
      /** 图片质量 */
      imageQuality: pictureQuality[2].value,
      /** API 请求代理 */
      apiProxy: cloneDeep(apiProxy[0].value),
      /** 文件资源代理 */
      fileProxy: cloneDeep(fileProxy[0].value),
      /** 漫画图片宽度 */
      comicImageWidth: 800,
      /** 自动阅读 */
      autoRead: false,
      /** 自动阅读速度 */
      autoReadSpeed: 20,
      /** 隐私模式 */
      privacyMode: true,
      /** R18 分类开关 */
      showR18Categories: false,
    })

    /** 过滤漫画设置 */
    const filter = reactive({
      /** 分类 */
      categories: [] as string[],
      /** 作者 */
      authors: [] as string[],
    })

    return { appearance, comic, filter }
  },
  {
    persist: {
      beforeHydrate: migrateLegacyProxyStorage,
    },
    multiWindowSync: {
      enabled: true,
      debounce: 200,
      conflictResolution: 'latest',
    },
  },
)

/** 用户信息 store */
export function useSettingStoreHook() {
  return useSettingStore(store)
}
