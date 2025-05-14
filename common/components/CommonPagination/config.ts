/**
 * @description: 默认配置项
 */
export const defaultProps = {
  /** 总数 */
  total: 0,
  /** 带有背景色的分页 */
  background: true,
  /** 是否将下拉菜单teleport至 body */
  teleported: true,
  /** 组件布局，子组件名用逗号分隔 */
  layout: 'slot, ->, sizes, prev, pager, next, jumper, total',
  /** 每页显示个数选择器的选项设置 */
  pageSizes: () => [10, 20, 30, 40, 50],
}

/** 定义分页器默认值 */
export const defaultPager = {
  /** 默认值起始页数 */
  pageNum: 1,
  /** 默认每页条数 */
  pageSize: 10,
}
