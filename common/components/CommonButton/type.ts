import type { ButtonProps } from 'element-plus'
import type { ExtractPublicPropTypes } from 'vue'

export interface CommonButtonProps extends ExtractPublicPropTypes<ButtonProps> {
  test?: string
}
