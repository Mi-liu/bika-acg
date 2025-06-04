import type { Categories, Comic } from '@/api/comic'
import localforage from 'localforage'

import { cloneDeep, uniq } from 'lodash-es'
import { store } from '@/store'

import { smartIndexOf } from '@/utils/array'

/**
 * 本地存储类型
 */
export interface Local {
  /**
   * 分类
   */
  CATEGORIES: Categories['categories']
  /**
   * 稍后观看列表
   */
  WATCH_LATER_LIST: Comic[]
  /**
   * 账号密码信息
   */
  ACCOUNT_INFO: {
    email: string
    password: string
  }
  /**
   * 关注作者列表
   */
  FOLLOW_AUTHOR_LIST: string[]
}

/**
 * 本地存储 Store
 * @description 将本地存储的数据映射到 store 中，实现响应式更新
 */
const useLocalStore = defineStore('local', () => {
  const local = reactive<Local>({
    /**
     * 分类
     */
    CATEGORIES: [],
    /**
     * 稍后观看列表
     */
    WATCH_LATER_LIST: [],
    /**
     * 关注作者列表
     */
    FOLLOW_AUTHOR_LIST: [],
    /**
     * 账号密码信息
     */
    ACCOUNT_INFO: {
      email: '',
      password: '',
    },
  })

  /** 将本地local数据，同步到 useLocalStore.local中  */
  async function initStorage() {
    for (const key in local) {
      if (Object.prototype.hasOwnProperty.call(local, key)) {
        await localforage.getItem<Local[keyof Local]>(key).then((res) => {
          // @ts-ignore
          local[key] = res || local[key]
        })
      }
    }
    watch(local, (newVal) => {
      for (const key in newVal) {
        if (Object.prototype.hasOwnProperty.call(newVal, key)) {
          // @ts-ignore
          localforage.setItem(key, cloneDeep(newVal[key]))
        }
      }
    })
  }

  /**
   * 向存储的数组添加元素
   * @param key 存储键名（必须是数组类型的键）
   * @param value 要添加的元素
   */
  function pushItem<K extends ArrayKeys<Local>, V extends Local[K][number]>(key: K, value: V) {
    // @ts-ignore
    local[key].push(value)
    // @ts-ignore
    return localforage.setItem(key, cloneDeep(uniq(local[key])))
  }

  /**
   * 从存储的数组中移除元素
   * @param key 存储键名（必须是数组类型的键）
   * @param value 要移除的元素
   * @param uniqueKey 可选，对象的唯一标识符属性名（如 'id', '_id', 'title' 等）
   */
  function removeItem<K extends ArrayKeys<Local>, V extends Local[K][number]>(
    key: K,
    value: V,
    uniqueKey?: keyof V,
  ) {
    // @ts-ignore
    const array = local[key] as V[]

    // 使用智能查找策略
    const index = smartIndexOf(array, value, uniqueKey)

    if (index !== -1) {
      // @ts-ignore
      local[key].splice(index, 1)
      // @ts-ignore
      return localforage.setItem(key, cloneDeep(local[key]))
    }
  }

  return { local, initStorage, pushItem, removeItem }
})

/**
 * 本地存储 store hook
 */
export function useLocalStoreHook() {
  return useLocalStore(store)
}
