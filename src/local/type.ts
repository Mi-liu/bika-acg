import { CATEGORIES } from './key'
import type { Categories } from '@/api/comic'

export interface Local {
  [CATEGORIES]: Categories['categories']
}
