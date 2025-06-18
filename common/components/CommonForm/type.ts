import type { FormItemProps, FormProps } from 'element-plus'
import type { ExtractPublicPropTypes } from 'vue'
import type { AnyObject, RequiredSomeFields } from '../../type'
import type { CommonComponentsPropsMap } from '../CommonComponent/type'

/**
 * CommonForm 组件的 Props 类型定义
 * @template T - 表单数据的类型，必须是对象类型
 */
export interface CommonFormProps<T extends AnyObject = AnyObject> extends ExtractPublicPropTypes<FormProps> {
  /** 表单项配置，支持数组和对象两种格式 */
  columns: CommonFormArrayColumns<T> | CommonFormObjectColumns<T>
  /**
   * TODO 正在考虑必要性，后续再实现or删除
   * form-item 占据的宽度
   * 会被 columns[width] 覆盖
   */
  // itemWidth?: string | number
}

/** CommonForm 表单项的 Props 类型定义 */
export interface CommonFormcolumnProps extends ExtractPublicPropTypes<FormItemProps> {}

/**
 * CommonForm 表单项的基础配置类型
 * @template O - 表单数据对象类型
 * @template V - 表单字段键类型
 * @template K - 组件类型键
 */
export interface CommonFormColumnBase<
  O extends AnyObject = AnyObject,
  V extends keyof O = keyof O,
  K extends keyof CommonComponentsPropsMap = keyof CommonComponentsPropsMap,
> {
  /** 组件类型标识 */
  is: K
  /** 组件属性配置 */
  props?: CommonComponentsPropsMap[K]
  /**
   * 数据格式化函数，在提交表单前执行
   * @param value - 当前字段值
   * @param formData - 完整表单数据
   * @returns 格式化后的值，如果有返回值则替换原值
   * @description 也可以在此函数中修改 formData 对象，比如将 formData.data: [] 转为 formData.startDate 和 formData.endDate
   */
  formatValue?: (value: O[V] | undefined, formData: O) => O[V] | undefined
  /**
   * 控制表单项是否显示的函数
   * @param formData - 当前表单数据对象
   * @returns 是否显示该表单项
   */
  visible?: (formData: O) => boolean

  /**
   * 初始化表单项的值
   */
  initValue?: O[V]
}

/**
 * CommonForm 数组格式表单项的类型定义
 * @template O - 表单数据对象类型
 * @template V - 表单字段键类型
 * @template K - 组件类型键
 */
export interface CommonFormArrayColumn<
  O extends AnyObject = AnyObject,
  V extends keyof O = keyof O,
  K extends keyof CommonComponentsPropsMap = keyof CommonComponentsPropsMap,
> extends CommonFormColumnBase<O, V, K> {
  /** 表单项属性配置，prop 字段为必填 */
  formItemProps: RequiredSomeFields<CommonFormcolumnProps, 'prop'> & {
    prop: V
  }
}

/**
 * CommonForm 数组格式表单项集合类型
 * @template T - 表单数据对象类型
 * @description 将表单数据对象的每个字段映射为对应的表单项配置数组
 */
export type CommonFormArrayColumns<T extends AnyObject = AnyObject> = {
  [K in keyof T]: CommonFormArrayColumn<T, K>
}[keyof T][]

/**
 * CommonForm 对象格式表单项的类型定义
 * @template O - 表单数据对象类型
 * @template V - 表单字段键类型
 * @template K - 组件类型键
 */
export interface CommonFormObjectColumn<
  O extends AnyObject = AnyObject,
  V extends keyof O = keyof O,
  K extends keyof CommonComponentsPropsMap = keyof CommonComponentsPropsMap,
> extends CommonFormColumnBase<O, V, K> {
  /** 表单项属性配置，prop 字段会自动设置为当前键名 */
  formItemProps?: Omit<CommonFormcolumnProps, 'prop'>
}

/**
 * CommonForm 对象格式表单项集合类型
 * @template O - 表单数据对象类型
 * @template V - 表单字段键类型，默认为对象的所有键
 * @template K - 组件类型键，默认为所有可用组件类型
 * @description 以对象形式配置表单项，键为字段名，值为表单项配置
 */
export type CommonFormObjectColumns<
  O extends AnyObject = AnyObject,
  V extends keyof O = keyof O,
  K extends keyof CommonComponentsPropsMap = keyof CommonComponentsPropsMap,
> = {
  [P in V]: CommonFormObjectColumn<O, P, K>
}
