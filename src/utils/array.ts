import { isEqual } from 'lodash-es'

/**
 * 判断数组中是否存在指定的数据
 * @param arr 要检查的数组
 * @param value 要查找的值
 * @param key 可选，如果数组元素是对象/数组类型，指定要比较的属性名或索引
 * @returns 如果存在返回true，否则返回false
 *
 * @example
 * // 简单数据类型
 * arrayContains([1, 2, 3], 2) // true
 * arrayContains(['a', 'b', 'c'], 'd') // false
 *
 * // 对象数组
 * arrayContains([{id: 1, name: 'John'}, {id: 2, name: 'Jane'}], 1, 'id') // true
 * arrayContains([{id: 1, name: 'John'}, {id: 2, name: 'Jane'}], 'Bob', 'name') // false
 *
 * // 嵌套数组
 * arrayContains([[1, 2], [3, 4]], 2, 1) // true (检查每个子数组的索引1位置)
 */
export function arrayContains<T>(arr: T[], value: unknown, key?: keyof T | number): boolean {
  // 参数验证
  if (!Array.isArray(arr)) {
    throw new TypeError('第一个参数必须是数组')
  }

  // 如果没有指定key，直接在数组中查找值
  if (key === undefined) {
    return arr.includes(value as T)
  }

  // 如果指定了key，遍历数组元素进行比较
  return arr.some((item) => {
    // 检查数组元素是否为对象或数组
    if (typeof item === 'object' && item !== null) {
      // 如果是数组类型且key是数字索引
      if (Array.isArray(item) && typeof key === 'number') {
        return item[key] === value
      }
      // 如果是对象类型且key是字符串属性名
      if (!Array.isArray(item) && typeof key === 'string') {
        return (item as Record<string, unknown>)[key] === value
      }
      // 通用处理：使用keyof T
      return (item as any)[key] === value
    }
    return false
  })
}

/**
 * 在数组中查找指定值的索引
 * @param arr 要检查的数组
 * @param value 要查找的值
 * @param key 可选，如果数组元素是对象/数组类型，指定要比较的属性名或索引
 * @returns 如果找到返回索引，否则返回-1
 *
 * @example
 * // 简单数据类型
 * arrayIndexOf([1, 2, 3], 2) // 1
 * arrayIndexOf(['a', 'b', 'c'], 'd') // -1
 *
 * // 对象数组
 * arrayIndexOf([{id: 1, name: 'John'}, {id: 2, name: 'Jane'}], 2, 'id') // 1
 */
export function arrayIndexOf<T>(arr: T[], value: unknown, key?: keyof T | number): number {
  if (!Array.isArray(arr)) {
    throw new TypeError('第一个参数必须是数组')
  }

  if (key === undefined) {
    return arr.indexOf(value as T)
  }

  return arr.findIndex((item) => {
    if (typeof item === 'object' && item !== null) {
      if (Array.isArray(item) && typeof key === 'number') {
        return item[key] === value
      }
      if (!Array.isArray(item) && typeof key === 'string') {
        return (item as Record<string, unknown>)[key] === value
      }
      return (item as any)[key] === value
    }
    return false
  })
}

/**
 * 从数组中移除指定的值
 * @param arr 要操作的数组
 * @param value 要移除的值
 * @param key 可选，如果数组元素是对象/数组类型，指定要比较的属性名或索引
 * @returns 移除元素后的新数组
 *
 * @example
 * // 简单数据类型
 * arrayRemove([1, 2, 3, 2], 2) // [1, 3]
 *
 * // 对象数组
 * arrayRemove([{id: 1, name: 'John'}, {id: 2, name: 'Jane'}], 1, 'id') // [{id: 2, name: 'Jane'}]
 */
export function arrayRemove<T>(arr: T[], value: unknown, key?: keyof T | number): T[] {
  if (!Array.isArray(arr)) {
    throw new TypeError('第一个参数必须是数组')
  }

  if (key === undefined) {
    return arr.filter(item => item !== value)
  }

  return arr.filter((item) => {
    if (typeof item === 'object' && item !== null) {
      if (Array.isArray(item) && typeof key === 'number') {
        return item[key] !== value
      }
      if (!Array.isArray(item) && typeof key === 'string') {
        return (item as Record<string, unknown>)[key] !== value
      }
      return (item as any)[key] !== value
    }
    return true
  })
}

/**
 * 智能查找数组中对象的索引
 * 优先使用指定的唯一标识符，如果没有则使用深度比较
 * @param arr 要检查的数组
 * @param value 要查找的值
 * @param uniqueKey 可选，对象的唯一标识符属性名（如 'id', '_id' 等）
 * @returns 如果找到返回索引，否则返回-1
 *
 * @example
 * const users = [{id: 1, name: 'John'}, {id: 2, name: 'Jane'}]
 * smartIndexOf(users, {id: 2, name: 'Jane'}, 'id') // 1 (使用id比较)
 * smartIndexOf(users, {id: 2, name: 'Jane'}) // 1 (使用深度比较)
 */
export function smartIndexOf<T>(arr: T[], value: T, uniqueKey?: keyof T): number {
  if (!Array.isArray(arr)) {
    throw new TypeError('第一个参数必须是数组')
  }

  // 如果指定了唯一标识符，优先使用
  if (uniqueKey !== undefined && value && typeof value === 'object') {
    const targetValue = (value as any)[uniqueKey]
    if (targetValue !== undefined) {
      return arr.findIndex((item) => {
        if (typeof item === 'object' && item !== null) {
          return (item as any)[uniqueKey] === targetValue
        }
        return false
      })
    }
  }

  // 对于简单类型，直接使用 indexOf
  if (typeof value !== 'object' || value === null) {
    return arr.indexOf(value)
  }

  // 对于复杂对象，使用深度比较作为后备方案
  return arr.findIndex(item => isEqual(item, value))
}
