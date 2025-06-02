import { CATEGORIES, WATCH_LATER_LIST, ACCOUNT_INFO, FOLLOW_AUTHOR_LIST } from './key'
import type { Categories, Comic } from '@/api/comic'

/**
 * 稍后观看列表
 */
export type WatchLaterList = Comic[]

/**
 * 账号密码信息
 */
export type AccountInfo = {
  email: string
  password: string
}

/**
 * 本地存储类型
 */
export interface Local {
  [CATEGORIES]: Categories['categories']
  [WATCH_LATER_LIST]: WatchLaterList
  [ACCOUNT_INFO]: AccountInfo
  [FOLLOW_AUTHOR_LIST]: string[]
}

/**
 * 提取 Local 接口中数组类型的键
 */
export type LocalArrayKeys = {
  [K in keyof Local]: Local[K] extends Array<any> ? K : never
}[keyof Local]
