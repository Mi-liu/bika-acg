// 可以在这里添加项目特定的类型定义

declare global {
  /** 将函数类型转换为参数元组
   * @example
   * type Fn = (a: string, b: number) => void
   * type Result = FunctionToTuple<Fn> // [a: string, b: number]
   */
  // type FunctionToTuple<T> = T extends (...args: infer Args) => any ? Args : never
  /** 转换整个对象类型
   * @example
   * type Emits = {
   *   click: (evt: MouseEvent) => void
   *   change: (value: string) => void
   * }
   * type Result = ConvertEmitsToTuple<Emits>
   * // {
   *   click: [evt: MouseEvent]
   *   change: [value: string]
   * }
   */
  // type ConvertEmitsToTuple<T> = {
  //   [K in keyof T]: FunctionToTuple<T[K]>
  // }

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
