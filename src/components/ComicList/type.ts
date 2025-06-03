import type { ComicsParams, Comics } from '@/api/comic'

export interface ComicsListProps {
  /** 标题 */
  title?: string
  /** 作者 */
  author?: string
  /** 请求接口 */
  fetch: (params: ComicsParams) => Promise<Comics['comics']>
}
