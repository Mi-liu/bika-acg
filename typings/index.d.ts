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
   * //   click: [evt: MouseEvent]
   * //   change: [value: string]
   * // }
   */
  // type ConvertEmitsToTuple<T> = {
  //   [K in keyof T]: FunctionToTuple<T[K]>
  // }
}

export {}
