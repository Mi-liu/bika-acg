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
    // 分别处理每种类型的数据，避免类型问题
    try {
      // 加载分类数据
      const categoriesData = await storage.getItem(CATEGORIES, [])
      local[CATEGORIES] = categoriesData

      // 加载稍后观看列表
      const watchLaterData = await storage.getItem(WATCH_LATER_LIST, [])
      local[WATCH_LATER_LIST] = watchLaterData
    } catch (error) {
      console.error('初始化本地存储失败:', error)
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
