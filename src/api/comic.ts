import alova from '@/services'
import { CATEGORIES } from '@/local/key'
import { storage } from '@/local'

interface Categories {
  categories: {
    title: string
  }[]
}

/**
 * 获取漫画分类
 */
export async function getCategories() {
  const res = await storage.getItem<Categories>(CATEGORIES)
  if (res) {
    return res
  } else {
    return alova.Get<Categories>('categories').then((res) => {
      storage.setItem(CATEGORIES, res)
      return res
    })
  }
}
