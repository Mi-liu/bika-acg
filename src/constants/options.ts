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

/** 图片代理链接 */
export const imageBaseUrl = <const>[
  {
    label: '线路一，无需VPN，速度略慢',
    // value: 'https://s3.manhuabika.com/static/',
    value: 'https://s3.picacomic.com/static/',
  },
  {
    label: '线路二，需要VPN，速度较快',
    value: 'https://storage-b.picacomic.com/static/',
  },
]
