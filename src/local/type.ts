import { CATEGORIES, WATCH_LATER_LIST } from './key'
import type { Categories } from '@/api/comic'

export interface Local {
  [CATEGORIES]: Categories['categories']
  [WATCH_LATER_LIST]: Categories['categories']
}
