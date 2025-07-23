<script setup lang="ts">
/**
 * 递归菜单树组件
 * 用于渲染多级菜单结构
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

interface Props {
  /** 菜单项数据 */
  menuItems: MenuItem[]
  /** 当前激活的菜单路径 */
  activePath?: string
}

const props = defineProps<Props>()

/**
 * 判断菜单项是否有子菜单
 * @param item 菜单项
 * @returns 是否有子菜单
 */
function hasChildren(item: MenuItem): boolean {
  return !!(item.children && item.children.length > 0)
}

/**
 * 判断菜单项是否为当前激活项
 * @param item 菜单项
 * @returns 是否为激活项
 */
function isActive(item: MenuItem): boolean {
  return props.activePath === item.path
}
</script>

<template>
  <template v-for="item in menuItems" :key="item.path">
    <!-- 有子菜单的项 -->
    <el-sub-menu
      v-if="hasChildren(item)"
      :index="item.path"
    >
      <template #title>
        <span>{{ item.title }}</span>
      </template>

      <!-- 递归渲染子菜单 -->
      <MenuTree
        :menu-items="item.children!"
        :active-path="activePath"
      />
    </el-sub-menu>

    <!-- 没有子菜单的项 -->
    <el-menu-item
      v-else
      :index="item.path"
      :class="{ 'is-active': isActive(item) }"
    >
      <span>{{ item.title }}</span>
    </el-menu-item>
  </template>
</template>

<style scoped lang="scss">
// 自定义菜单项样式
.el-menu-item {
  &.is-active {
    background-color: var(--el-color-primary-light-9);
    color: var(--el-color-primary);

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background-color: var(--el-color-primary);
    }
  }
}

// 子菜单缩进样式
:deep(.el-sub-menu .el-menu-item) {
  padding-left: 40px !important;
}

:deep(.el-sub-menu .el-sub-menu .el-menu-item) {
  padding-left: 60px !important;
}

:deep(.el-sub-menu .el-sub-menu .el-sub-menu .el-menu-item) {
  padding-left: 80px !important;
}
</style>
