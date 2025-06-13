import type { PaginationProps as ElPaginationProps } from 'element-plus'

/**
 * 分页组件组件props
 */
export interface CommonPaginationProps extends Partial<ElPaginationProps> {}

/** emit 事件传递的 event */
export interface CommonPaginationEmit {
  /** 页数条数变化 */
  change: [{ currentPage: number, pageSize: number }]
}
