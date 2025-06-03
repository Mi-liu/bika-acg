import type { ComicsParams, Comics } from '@/api/comic'

export interface ComicsListProps {
  /** 标题 */
  title?: string
  /** 作者 */
  author?: string
  /** 都在搜索的关键词 */
  keywords?: string
  /** 搜索的关键词 */
  keyword?: string
  /** 请求接口 */
  fetch: (params: ComicsParams) => Promise<Comics['comics']>
}
