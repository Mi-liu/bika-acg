import localforage from 'localforage'
import type { Local } from './type'
import { isEqual, uniq } from 'lodash-es'

type LocalArrayKeys = ArrayKeys<Local>

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
   * 向存储的数组添加元素
   * @param key 存储键名（必须是数组类型的键）
   * @param value 要添加的元素
   * @returns 更新后的数组
   */
  async pushItem<K extends LocalArrayKeys, V extends Local[K][number]>(key: K, value: V) {
    const arr = await storage.getItem(key, [])
    arr.push(value as any)
    return storage.setItem<K>(key, uniq(arr as any) as unknown as Local[K])
  },
  /**
   * 从存储的数组中移除元素
   * @param key 存储键名（必须是数组类型的键）
   * @param predicate 用于查找要移除元素的谓词函数
   * @returns 更新后的数组
   */
  async removeFromArray<K extends LocalArrayKeys, V extends Local[K][number]>(key: K, value: V) {
    const arr = await storage.getItem(key, [])
    const index = arr.indexOf(value as any)
    if (index !== -1) {
      arr.splice(index, 1)
    }
    return storage.setItem<K>(key, uniq(arr as any) as unknown as Local[K])
  },

  /**
   * 检查数组中是否存在指定元素
   * @param key 存储键名（必须是数组类型的键）
   * @param predicate 用于查找元素的谓词函数
   * @returns 是否存在匹配的元素
   */
  async hasInArray<K extends LocalArrayKeys>(
    key: K,
    predicate: (item: Local[K] extends Array<infer T> ? T : never) => boolean,
  ): Promise<boolean> {
    // 获取当前存储的数组
    const currentArray = await storage.getItem(key, [] as unknown as Local[K])

    // 确保获取到的是数组类型
    if (!Array.isArray(currentArray)) {
      return false
    }

    // 检查是否存在匹配的元素
    return currentArray.some((item) =>
      predicate(item as Local[K] extends Array<infer T> ? T : never),
    )
  },

  /**
   * 更新数组中的元素
   * @param key 存储键名（必须是数组类型的键）
   * @param predicate 用于查找要更新元素的谓词函数
   * @param updater 更新函数
   * @returns 更新后的数组
   */
  async updateInArray<K extends LocalArrayKeys>(
    key: K,
    predicate: (item: Local[K] extends Array<infer T> ? T : never) => boolean,
    updater: (
      item: Local[K] extends Array<infer T> ? T : never,
    ) => Local[K] extends Array<infer T> ? T : never,
  ): Promise<Local[K]> {
    // 获取当前存储的数组
    const currentArray = await storage.getItem(key, [] as unknown as Local[K])

    // 确保获取到的是数组类型
    if (!Array.isArray(currentArray)) {
      throw new Error(`Storage key "${String(key)}" is not an array type`)
    }

    // 更新匹配的元素
    const newArray = currentArray.map((item) => {
      const typedItem = item as Local[K] extends Array<infer T> ? T : never
      return predicate(typedItem) ? updater(typedItem) : item
    }) as Local[K]

    // 保存更新后的数组到存储
    await localforage.setItem(key, newArray)

    // 返回新数组
    return newArray
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

  keys<T extends keyof Local>() {
    return localforage.keys() as Promise<Array<T>>
  },
}
