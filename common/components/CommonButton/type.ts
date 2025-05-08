import type { ButtonProps } from 'element-plus/es/components/button'
import type { ExtractPublicPropTypes } from 'vue'

export interface CommonButtonProps extends ExtractPublicPropTypes<Omit<ButtonProps, 'loading'>> {
  test?: string
  /**
   * 点击事件, 点击后自动进行loading，函数执行完毕，或者返回的promise执行完毕后，loading结束
   */
  onClick?: (evt: MouseEvent) => void
}
