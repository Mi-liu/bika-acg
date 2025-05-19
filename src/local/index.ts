import localforage from 'localforage'
import type { Local } from './type'

/**
 * 本地存储工具
 * @description 封装 localforage API,提供本地存储功能
 */
export const storage = {
  /**
   * 获取存储项
   */
  getItem<K extends keyof Local>(key: K, defaultValue: Local[K]) {
    return localforage.getItem<Local[K]>(key).then((res) => (res !== null ? res : defaultValue))
  },
  /**
   * 设置存储项
   */
  setItem<K extends keyof Local>(key: K, value: Local[K]) {
    return localforage.setItem(key, value)
  },
  /**
   * 删除存储项
   */
  removeItem: localforage.removeItem,
  /**
   * 清空所有存储
   */
  clear: localforage.clear,
  /**
   * 获取存储键名
   */
  key: localforage.key,
  /**
   * 获取存储长度
   */
  length: localforage.length,
}

// 测试类型推断
const a = storage.getItem('CATEGORIES', [])

a.then((res) => {
  // res 现在应该被正确推断为 Categories['categories'] 类型
  console.log(res)
})
