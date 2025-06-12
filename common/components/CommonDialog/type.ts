import type { DialogEmits, DialogProps } from 'element-plus'
import type { ExtractPublicPropTypes, VNodeNormalizedChildren } from 'vue'

/**
 * 通用对话框组件属性接口
 */
export interface CommonDialogProps extends ExtractPublicPropTypes<DialogProps> {
  /**
   * 是否需要显示默认footer
   */
  showFooter?: boolean
  /**
   * 确定按钮的文本
   */
  confirmText?: string
  /**
   * 取消按钮的文本
   */
  cancelText?: string

  /**
   * 确定按钮前的回调
   */
  beforeConfirm?: () => any
}

/**
 * 通用对话框组件事件接口
 */
export interface CommonDialogEmits extends DialogEmits {}

export interface CommonDialogOptions extends Partial<CommonDialogProps & ConvertEmits<CommonDialogEmits>> {}

type BaseSlots<T extends string = string> = {
  [K in T]?: (() => VNodeNormalizedChildren) | undefined
}

/**
 * 通用对话框组件插槽类型
 */
export interface CommonDialogSlots extends BaseSlots {
  default?: () => VNodeNormalizedChildren
  header?: () => VNodeNormalizedChildren
  footer?: () => VNodeNormalizedChildren
  [key: string]: (() => VNodeNormalizedChildren) | undefined
}

/**
 * 工具类型：将对象的每个 key 转换为 onXxx 格式
 * 例如：{ click: Function } => { onClick: Function }
 */
export type ConvertEmits<T> = {
  [K in keyof T as `on${Capitalize<string & K>}`]: () => void
}
