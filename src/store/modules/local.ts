import { store } from '@/store'
import { storage } from '@/local'
import type { Local } from '@/local/type'
import { CATEGORIES, WATCH_LATER_LIST } from '@/local/key'

/**
 * 本地存储 Store
 * @description 将本地存储的数据映射到 store 中，实现响应式更新
 */
const useLocalStore = defineStore('local', () => {
  const local = reactive<Local>({
    [CATEGORIES]: [],
    [WATCH_LATER_LIST]: [],
  })

  /** 初始化本地local数据，将其同步到 useLocalStore.local中  */
  async function initStorage() {
    const keys = await storage.keys()

    for (const element of keys) {
      const store = await storage.getItem(element, local[element])
      // @ts-ignore
      local[element] = store
    }
  }
  function getLocalItem<K extends keyof Local>(key: K) {
    return local[key]
  }

  function setLocalItem<K extends keyof Local>(key: K, value: Local[K]) {
    local[key] = value
    storage.setItem(key, value)
  }

  return { initStorage, getLocalItem, setLocalItem }
})

/**
 * 本地存储 store hook
 */
export function useLocalStoreHook() {
  return useLocalStore(store)
}
