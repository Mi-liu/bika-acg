import type {
  RouteLocationNormalizedLoaded,
  RouteMeta,
  RouteRecordSingleViewWithChildren,
} from 'vue-router'
import { merge } from 'lodash-es'
import { upperFirst } from '@/utils/string'

const defaultMeta: RouteMeta = {
  layout: true,
}

/**
 * 创建路由模块
 * @param moduleName 模块名称，用于生成路径和名称
 * @param config 路由模块配置
 * @returns 路由模块
 */
export function createRouterModule(
  moduleName: string,
  config: PartialSomeFields<RouteRecordSingleViewWithChildren, 'path' | 'name'>,
) {
  return {
    path: `/${moduleName}`,
    name: upperFirst(moduleName),
    meta: merge(defaultMeta, config.meta),
    redirect: config.redirect || `/${moduleName}/${config.children?.[0]?.path}`,
    ...config,
    children: config.children?.map((child) => ({
      ...child,
      props: (route: RouteLocationNormalizedLoaded) => ({
        ...route.params,
        ...route.query,
      }),
      meta: merge({ ...defaultMeta }, child.meta),
    })),
  }
}
