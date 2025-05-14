import type { ComicsParams, Comics } from '@/api/comic'

export interface ComicsListProps {
  title: string
  /** 请求接口 */
  fetch: (params: ComicsParams) => Promise<Comics['comics']>
}
