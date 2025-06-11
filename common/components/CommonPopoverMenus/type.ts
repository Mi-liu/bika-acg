import type { ButtonProps as ElButtonProps } from 'element-plus'
import type { ExtractPublicPropTypes } from 'vue'

export interface CommonPopoverMenuProps {
  menus: CommonPopoverMenu[]
}

interface CommonPopoverMenu extends ExtractPublicPropTypes<Omit<ElButtonProps, 'loading'>> {
  label: string
  id?: string
}
