/** 任意类型的对象 */
export type AnyObject = Record<string, any>

/** 任意类型的数组 */
export type AnyArray = any[]

/** 任意类型的函数 */
export type AnyFunction = (...args: any[]) => any

/**
 * 工具类型：将对象的每个 key 转换为 onXxx 格式
 * 例如：{ click: Function } => { onClick: Function }
 */
export type ToOnHandlers<T> = {
  [K in keyof T as `on${Capitalize<string & K>}`]: T[K]
}

/**
 * 工具类型：将对象的每个 key 转换为 onXxx 格式, 并且要求返回值为 void
 * 例如：{ click: Function } => { onClick: Function }
 */
export type ToOnVoidHandlers<T> = {
  [K in keyof T as `on${Capitalize<string & K>}`]: () => void
}


/**
 * 指定的字段变为必填，其他字段保持不变。
 * @example
 * type User = { id: number; name?: string; age?: number };
 * type UserWithRequiredName = RequiredSomeFields<User, 'name'>; // { id: number; name: string; age?: number }
 */
export type RequiredSomeFields<T extends object, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: T[P];
}