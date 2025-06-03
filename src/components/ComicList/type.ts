import type { ComicsParams, Comics } from '@/api/comic'

export interface ComicsListProps<T extends Partial<ComicsParams> = Partial<ComicsParams>> {
  /** 标题 */
  title?: string
  /** 请求参数 */
  params?: Omit<T, 'page' | 's'>
  /** 作者 */
  author?: string
  /** 都在搜索的关键词 */
  keywords?: string
  /** 搜索的关键词 */
  keyword?: string
  /** 请求接口 */
  fetch: (params: T & { page: number; s: string }) => Promise<Comics['comics']>
}
