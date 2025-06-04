import { ref } from 'vue'

/**
 * 循环请求列表数据，并按照指定的键名返回结果，同时保留其他属性
 * @param callback 请求函数，接收页码参数
 * @param options 配置选项
 * @param options.key 要合并的数组键名
 * @param options.beforeRequest 请求前的判断函数
 * @returns 返回包含所有属性的响应式对象，其中指定键名对应的数组会被合并
 */
export function loopRequestList<K extends string, Item, R extends Record<K, Item[]>>(
  callback: (page: number) => Promise<R>,
  options: {
    key: K
    beforeRequest: (page: number, res?: R) => boolean
  },
) {
  let page = 1

  // 创建一个初始对象，只包含空数组
  const initialData = { [options.key]: [] } as unknown as R

  // 使用ref包装初始对象
  const data = ref<R>(initialData)

  function recursion() {
    if (options.beforeRequest(page, page === 1 ? undefined : data.value)) {
      callback(page++).then((res) => {
        // 获取当前项目数组和新项目数组
        const currentItems = data.value[options.key] || []
        const newItems = res[options.key] || []
        data.value = {
          ...res,
          [options.key]: [...currentItems, ...newItems],
        } as R
        recursion()
      })
    }
  }

  recursion()
  return {
    data,
  }
}

/**
 * 使用示例:
 *
 * ```typescript
 * // 定义请求函数
 * function fetchPageData(page: number) {
 *   return Promise.resolve({
 *     items: [page, page + 1, page + 2],
 *     total: 100,
 *     page: page,
 *     pageSize: 10,
 *     hasMore: page < 10,
 *     metadata: { lastUpdated: new Date() }
 *   })
 * }
 *
 * // 使用loopRequestList获取所有数据
 * const { data } = loopRequestList(fetchPageData, {
 *   key: 'items',
 *   beforeRequest: (page) => page < 3, // 只请求前3页
 * })
 *
 * // data.value 现在是包含所有属性的对象:
 * // {
 * //   items: [1, 2, 3, 2, 3, 4, 3, 4, 5], // 合并后的数组
 * //   total: 100,                         // 保留的其他属性
 * //   page: 3,                            // 最后一页的页码
 * //   pageSize: 10,
 * //   hasMore: false,
 * //   metadata: { lastUpdated: Date }
 * // }
 * ```
 */
