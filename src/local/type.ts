import { CATEGORIES, WATCH_LATER_LIST } from './key'
import type { Categories, Comic } from '@/api/comic'

// 定义稍后观看列表类型
export type WatchLaterList = Comic[]

// 定义本地存储类型
export interface Local {
  [CATEGORIES]: Categories['categories']
  [WATCH_LATER_LIST]: WatchLaterList
}
