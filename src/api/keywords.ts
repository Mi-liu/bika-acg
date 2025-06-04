import alova from '@/services'

/**
 * 获取关键词
 * @returns 关键词列表
 */
export function getKeywords() {
  return alova.Get<{ keywords: string[] }>('keywords').then((res) => {
    return res.keywords
  })
}
