/**
 * 判断数组中是否已经存在对应的数据项
 * @param arr 要检查的数组
 * @param value 要查找的值（基本数据类型）
 * @param key 可选，如果数组元素是对象，指定要比较的属性名
 * @returns 如果存在返回true，否则返回false
 */
export function arrayContains<T, K extends string>(
  arr: T[],
  value: string | number | boolean,
  key?: K,
): boolean {
  if (key) {
    return arr.some(
      (item) =>
        typeof item === 'object' &&
        item !== null &&
        key in item &&
        (item as Record<K, unknown>)[key] === value,
    )
  } else {
    return arr.includes(value as unknown as T)
  }
}
