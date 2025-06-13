import type { DialogEmits, DialogProps } from 'element-plus'
import type { ExtractPublicPropTypes, VNodeNormalizedChildren } from 'vue'
import type { ToOnVoidHandlers } from '../../type'

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

export interface CommonDialogOptions extends Partial<CommonDialogProps & ToOnVoidHandlers<CommonDialogEmits>> {}

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
