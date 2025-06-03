import alova from '@/services'

/**
 * 获取关键词
 * @returns
 */
export function getKeywords() {
  return alova.Get<{ keywords: string[] }>('keywords').then((res) => {
    return res.keywords
  })
}
