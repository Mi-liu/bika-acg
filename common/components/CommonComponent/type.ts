import type { AnyObject } from '../../type/index'
import type { CommonPaginationProps } from '../index'

export type CommonComponentProps = /* @vue-ignore */CreateCustomComponentUnion<CommonComponentsPropsMap>

export interface CommonComponentsPropsMap {
  CommonPagination: CommonPaginationProps
}

/** 定义 CreateCustomComponentUnion 工具类型，用于生成联合类型 */
type CreateCustomComponentUnion<T extends AnyObject> = {
  [K in keyof T]: {
    is: K
    props?: T[K]
  }
}[keyof T]
