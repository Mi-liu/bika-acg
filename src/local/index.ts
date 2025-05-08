import localforage from 'localforage'

/**
 * 本地存储工具
 * @description 封装 localforage API,提供本地存储功能
 */
export const storage = {
  /**
   * 获取存储项
   */
  getItem: localforage.getItem,
  /**
   * 设置存储项
   */
  setItem: localforage.setItem,
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
