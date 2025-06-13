import type { FormItemProps, FormProps } from 'element-plus'
import type { ExtractPublicPropTypes } from 'vue'
import type { AnyObject, RequiredSomeFields } from '../../type'
import type { CommonComponentsPropsMap } from '../CommonComponent/type'

export interface CommonFormProps<T extends AnyObject = { [key: string]: any }> extends ExtractPublicPropTypes<FormProps> {
  items: CommonFormArrayItems<T> | CommonFormObjectItems<T>
  /**
   * TODO 正在考虑必要性，后续再实现or删除
   * form-item 占据的宽度
   * 会被 items[width] 覆盖
   */
  // itemWidth?: string | number

}

export interface CommonFormItemProps extends ExtractPublicPropTypes<FormItemProps> {}

// props 类型没有生效，原因是 CommonFormArrayItem 没有实现 is 与 props 的强关联
// 需要通过条件类型实现 is 与 props 的强绑定
export interface CommonFormArrayItem<
  O extends AnyObject = { [key: string]: any },
  V extends keyof O = keyof O,
  K extends keyof CommonComponentsPropsMap = keyof CommonComponentsPropsMap,
> {
  is: K
  props?: CommonComponentsPropsMap[K]
  formItemProps: RequiredSomeFields<CommonFormItemProps, 'prop'> & {
    prop: V
  }
  /** 初始值 */
  defaultValue?: O[V]
  /**
   * 数据格式化函数，在提交表单前执行 如果有返回值，则将返回值作为提交对象[key]的值
   * 也可以在 formatValue 修改传进来的 formData 对象, 比如 将 formData.data: []  转为=> formData.startDate 和 formData.endDate
   */
  formatValue?: (value: O[V] | undefined, formData: Partial<O>) => O[V] | undefined
}

export type CommonFormArrayItems<T extends AnyObject = { [key: string]: any }> = {
  [K in keyof T]: CommonFormArrayItem<T, K>
}[keyof T][]

export type CommonFormObjectItems<O extends AnyObject = { [key: string]: any }, V extends keyof O = keyof O, K extends keyof CommonComponentsPropsMap = keyof CommonComponentsPropsMap> = {
  [I in V]: {
    is: K
    props?: CommonComponentsPropsMap[K]
    formItemProps?: Omit<CommonFormItemProps, 'prop'>
    /** 初始值 */
    defaultValue?: O[V]
    /**
     * 数据格式化函数，在提交表单前执行 如果有返回值，则将返回值作为提交对象[key]的值
     * 也可以在 formatValue 修改传进来的 formData 对象, 比如 将 formData.data: []  转为=> formData.startDate 和 formData.endDate
     */
    formatValue?: (value: O[V] | undefined, formData: Partial<O>) => O[V] | undefined
  }
}
