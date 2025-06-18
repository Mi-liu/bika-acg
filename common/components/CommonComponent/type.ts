import type { CommonDialogProps, CommonPaginationProps } from '../index'

export type CommonComponentProps = /* @vue-ignore */CommonComponentsComponentUnion

export interface CommonComponentsPropsMap {
  CommonPagination: CommonPaginationProps
  CommonDialog: CommonDialogProps
}

/** 定义 CreateCustomComponentUnion 工具类型，用于生成联合类型 */
export type CommonComponentsComponentUnion = {
  [K in keyof CommonComponentsPropsMap]: {
    is: K
    props: CommonComponentsPropsMap[K]
  }
}[keyof CommonComponentsPropsMap]
