// 可以在这里添加项目特定的类型定义

declare global {
  /**
   * 将类型部分字段设置为可选
   */
  type PartialSomeFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

  /**
   * 提取 T 类型中数组类型的键
   */
  export type ArrayKeys<T> = {
    [K in keyof T]: T[K] extends Array<any> ? K : never
  }[keyof T]

  // 添加 ES2023 数组方法的类型声明
  interface Array<T> {
    /**
     * 返回数组的反转副本，不修改原数组
     * ES2023 新增方法
     */
    toReversed(): T[]

    /**
     * 返回数组的排序副本，不修改原数组
     * ES2023 新增方法
     */
    toSorted(compareFn?: (a: T, b: T) => number): T[]

    /**
     * 返回数组的副本，其中指定位置的元素被替换为新值，不修改原数组
     * ES2023 新增方法
     */
    with(index: number, value: T): T[]

    /**
     * 返回数组的副本，其中指定范围的元素被删除和/或替换，不修改原数组
     * ES2023 新增方法
     */
    toSpliced(start: number, deleteCount?: number, ...items: T[]): T[]
  }
}

export {}
