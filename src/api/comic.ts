import alova from '@/services'
import { CATEGORIES } from '@/local/key'
import { storage } from '@/local'
import { HIDDEN_CATEGORIES } from '@/config/categories'

interface Categories {
  categories: {
    title: string
  }[]
}

/**
 * 获取漫画分类
 */
export async function getCategories() {
  const res = await storage.getItem<Categories['categories']>(CATEGORIES)
  if (res) {
    return res
  } else {
    return alova.Get<Categories>('categories').then((res) => {
      const categories = res.categories.filter(
        (category) => !HIDDEN_CATEGORIES.includes(category.title),
      )
      storage.setItem(CATEGORIES, categories)
      return categories
    })
  }
}

interface Comics {
  comics: {
    title: string
  }[]
}
interface ComicsParams {
  /**
   * 页码
   */
  page: number
  /**
   * 分类
   */
  category?: string
  /**
   * 作者
   */
  a?: string
  /**
   * 排序
   */
  s?: string
}

/**
 * 获取漫画列表
 */
export async function getComics(params: ComicsParams) {
  return alova.Get<Comics>('comics', {
    params: params,
  })
}
