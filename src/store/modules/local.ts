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
   * 账号列表
   */
  ACCOUNT_LIST: Array<{
    email: string
    password: string
    lastLoginTime?: number
  }>
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
    /**
     * 账号列表
     */
    ACCOUNT_LIST: [],
  })

  /** 将本地local数据，同步到 useLocalStore.local中  */
  async function initStorage() {
    for (const key in local) {
      if (Object.prototype.hasOwnProperty.call(local, key)) {
        await localforage.getItem<Local[keyof Local]>(key).then((res) => {
          // @ts-expect-error - 动态键访问需要忽略类型检查
          local[key] = res || local[key]
        })
      }
    }
    watch(local, (newVal) => {
      for (const key in newVal) {
        if (Object.prototype.hasOwnProperty.call(newVal, key)) {
          // @ts-expect-error - 动态键访问需要忽略类型检查
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
    // @ts-expect-error - 数组类型操作需要忽略类型检查
    local[key].push(value)
    // 使用类型断言来处理 uniq 函数的类型问题
    const uniqueArray = uniq(local[key] as any[]) as Local[K]
    return localforage.setItem(key, cloneDeep(uniqueArray))
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
    const array = local[key] as V[]

    // 使用智能查找策略
    const index = smartIndexOf(array, value, uniqueKey)

    if (index !== -1) {
      local[key].splice(index, 1)
      return localforage.setItem(key, cloneDeep(local[key]))
    }
  }

  /**
   * 添加或更新账号到账号列表
   * @param account 账号信息
   */
  function addOrUpdateAccount(account: { email: string, password: string }) {
    const existingIndex = local.ACCOUNT_LIST.findIndex(item => item.email === account.email)

    const accountWithTime = {
      ...account,
      lastLoginTime: Date.now(),
    }

    if (existingIndex !== -1) {
      // 更新现有账号
      local.ACCOUNT_LIST[existingIndex] = accountWithTime
    }
    else {
      // 添加新账号
      local.ACCOUNT_LIST.push(accountWithTime)
    }

    // 按最后登录时间排序，最近登录的在前面
    local.ACCOUNT_LIST.sort((a, b) => (b.lastLoginTime || 0) - (a.lastLoginTime || 0))

    return localforage.setItem('ACCOUNT_LIST', cloneDeep(local.ACCOUNT_LIST))
  }

  /**
   * 从账号列表中移除账号
   * @param email 邮箱地址
   */
  function removeAccount(email: string) {
    const index = local.ACCOUNT_LIST.findIndex(item => item.email === email)
    if (index !== -1) {
      local.ACCOUNT_LIST.splice(index, 1)
      return localforage.setItem('ACCOUNT_LIST', cloneDeep(local.ACCOUNT_LIST))
    }
  }

  return { local, initStorage, pushItem, removeItem, addOrUpdateAccount, removeAccount }
}, {
  // 本地存储不需要持久化到 localStorage（已经使用 localforage）
  persist: false,
  multiWindowSync: {
    enabled: true,
    debounce: 300,
    conflictResolution: 'merge',
    // 同步关注作者和稍后观看列表
    include: ['local'],
  },
})

/**
 * 本地存储 store hook
 */
export function useLocalStoreHook() {
  return useLocalStore(store)
}
