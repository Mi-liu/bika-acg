<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router'
import { cloneDeep } from 'lodash-es'
import MenuTree from './MenuTree.vue'

const router = useRouter()
const route = useRoute()

/**
 * 菜单项接口
 */
interface MenuItem {
  /** 路由路径 */
  path: string
  /** 菜单名称 */
  title: string
  /** 子菜单 */
  children?: MenuItem[]
  /** 路由名称 */
  name?: string
}

/**
 * 过滤并转换路由为菜单项
 * @param routes 路由配置
 * @param parentPath 父级路径
 * @returns 菜单项数组
 */
function filterAndTransformRoutes(routes: RouteRecordRaw[], parentPath = ''): MenuItem[] {
  return routes
    .filter((route) => {
      // 过滤掉 meta.menu = false 的路由
      return route.meta?.menu !== false
    })
    .map((route) => {
      // 正确处理路径拼接
      let fullPath: string
      if (parentPath === '') {
        // 根级路由
        fullPath = route.path
      }
      else if (parentPath === '/') {
        // 父路径是根路径
        fullPath = `/${route.path}`
      }
      else {
        // 普通子路径
        fullPath = `${parentPath}/${route.path}`
      }

      const menuItem: MenuItem = {
        path: fullPath,
        title: route.meta?.title || route.name?.toString() || route.path,
        name: route.name?.toString(),
      }

      // 递归处理子路由
      if (route.children && route.children.length > 0) {
        const childMenus = filterAndTransformRoutes(route.children, fullPath)
        if (childMenus.length > 0) {
          menuItem.children = childMenus
        }
      }

      return menuItem
    })
    .filter((item) => {
      // 如果有子菜单但子菜单为空，则过滤掉该项
      return !item.children || item.children.length > 0
    })
}

// 生成菜单数据
const menuItems = computed(() => {
  return filterAndTransformRoutes(cloneDeep([...router.options.routes]))
})

// 当前激活的菜单项
const activeMenu = computed(() => {
  return route.path
})
</script>

<template>
  <div class="sidebar w-200px bg-[--el-bg-color] border-r border-[--el-border-color] overflow-hidden rounded-2">
    <el-menu
      :default-active="activeMenu"
      class="h-full border-none"
      router
    >
      <!-- 使用递归菜单树组件 -->
      <MenuTree
        :menu-items="menuItems"
        :active-path="activeMenu"
      />
    </el-menu>
  </div>
</template>

<style lang="scss" scoped>

</style>
