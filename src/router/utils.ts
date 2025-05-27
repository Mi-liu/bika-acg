import type { RouteRecordRedirect, RouteMeta } from 'vue-router'
import { upperFirst } from '@/utils/string'
import { merge } from 'lodash-es'

/**
 * 创建路由模块
 * @param moduleName 模块名称，用于生成路径和名称
 * @param config 路由模块配置
 * @returns 路由模块
 */
export function createRouterModule(
  moduleName: string,
  config: PartialSomeFields<RouteRecordRedirect, 'path' | 'name'>,
): RouteRecordRedirect {
  const defaultMeta: RouteMeta = {
    layout: true,
  }
  return {
    path: `/${moduleName}`,
    name: upperFirst(moduleName),
    meta: merge(defaultMeta, config.meta),
    ...config,
  }
}
