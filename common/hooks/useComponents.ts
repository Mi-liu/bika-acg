import { merge } from 'lodash-es'
import { computed, useAttrs } from 'vue'

/** 合并组件的 Props 至 Attrs */
export function useMergePropsToAttrs<P>(props: P) {
  const attrs = useAttrs()
  return computed(() => merge({}, props, attrs))
}
