/**
 * 工具类型：将对象的每个 key 转换为 onXxx 格式
 * 例如：{ click: Function } => { onClick: Function }
 */
export type ToOnEmits<T> = {
  [K in keyof T as `on${Capitalize<string & K>}`]: T[K]
}
