/**
 * 将对象转换为 URL 参数（查询字符串），兼容大部分浏览器。
 *
 * @param {Record<string, any>} obj - 需要转换的对象。
 * @returns {string} 返回转换后的 URL 参数。
 *
 * @example
 * // 返回 "name=John&age=30"
 * objectToUrlParams({ name: 'John', age: 30 });
 *
 * @example
 * // 返回 "colors[]=red&colors[]=green&colors[]=blue"
 * objectToUrlParams({ colors: ['red', 'green', 'blue'] });
 *
 * @example
 * // 返回 "filters[name]=John&filters[age]=30"
 * objectToUrlParams({ filters: { name: 'John', age: 30 } });
 */
export function objectToUrlParams(obj: Record<string, any>, url = ''): string {
  const params: string[] = []

  /**
   * 递归处理对象，将其键值对添加到 params 数组中。
   *
   * @param {string} prefix - 当前键的前缀（用于嵌套对象）。
   * @param {any} value - 当前值。
   */
  const processValue = (prefix: string, value: any) => {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      // 如果是对象，递归处理
      for (const key in value) {
        processValue(`${prefix}[${key}]`, value[key])
      }
    } else if (Array.isArray(value)) {
      // 如果是数组，遍历数组
      value.forEach((item, index) => {
        processValue(`${prefix}[${index}]`, item)
      })
    } else {
      // 如果是基本类型，直接添加到 params 数组
      params.push(`${prefix}=${value}`)
    }
  }

  // 遍历对象的键值对
  for (const key in obj) {
    processValue(key, obj[key])
  }
  if (url && params.length > 0) {
    return `${url}?${params.join('&')}`
  }
  if (url && params.length === 0) {
    return url
  }
  // 返回拼接后的 URL 参数
  return params.join('&')
}
