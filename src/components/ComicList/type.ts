import type { ComicsParams, Comics } from '@/api/comic'

export interface ComicsListProps<T extends Partial<ComicsParams> = Partial<ComicsParams>> {
  /** 标题 */
  title?: string
  /** 是否屏蔽分类 */
  isBlockedCategories?: boolean
  /** 请求参数 */
  params?: Omit<T, 'page' | 's'>
  /** 请求接口 */
  fetch: (params: T & { page: number; s: string }) => Promise<Comics['comics']>
}
