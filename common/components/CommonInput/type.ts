import type { InputEmits, InputProps } from 'element-plus'
import type { ExtractPropTypes } from 'vue'

/**
 * CommonInput 组件的 Props 类型定义
 * 继承 Element Plus Input 组件的所有属性
 */
export interface CommonInputProps extends ExtractPropTypes<InputProps> {

}

/**
 * CommonInput 组件的 Emits 类型定义
 * 继承 Element Plus Input 组件的所有事件
 */
export interface CommonInputEmits extends InputEmits {

}
