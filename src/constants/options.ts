/**
 * 排序选项
 */
export const sort = <const>[
  {
    label: '从新到旧',
    value: 'dd',
  },
  {
    label: '从旧到新',
    value: 'da',
  },
  {
    label: '最多爱心',
    value: 'ld',
  },
  {
    label: '最多指名',
    value: 'vd',
  },
]

/** 默认排序 */
export const defaultSort = sort[0].value

/** 排序选项的值类型 */
export type SortOptionValue = (typeof sort)[number]['value']

/** 图片质量列表  */
export const pictureQuality = <const>[
  {
    label: '原画',
    value: 'original',
  },
  {
    label: '高清',
    value: 'high',
  },
  {
    label: '中等',
    value: 'medium',
  },
  {
    label: '压缩',
    value: 'low',
  },
]
