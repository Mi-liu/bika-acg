import alova from '@/services'
import { CATEGORIES } from '@/local/key'
import { storage } from '@/local'
import { HIDDEN_CATEGORIES } from '@/config/categories'
import type { SortOptionValue } from '@/constants/options'

export interface Categories {
  categories: {
    title: string
  }[]
}

/**
 * 获取漫画分类
 */
export async function getCategories() {
  const res = await storage.getItem(CATEGORIES, [])
  if (res.length) {
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

/** 漫画列表入参格式 */
export interface ComicsParams {
  /**
   * 页码
   */
  page: number
  /**
   * 分类
   */
  c?: string
  /**
   * 作者
   */
  a?: string
  /**
   * 排序选项
   */
  s?: SortOptionValue
}

/**
 * 漫画列表返回
 */
export interface Comics {
  comics: {
    /** 漫画列表 */
    docs: Comic[]
    /** 页码 */
    page: number
    /** 每页数量 */
    limit: number
    /** 总页数 */
    pages: number
    /** 总数量 */
    total: number
  }
}

/**
 *  本子基本信息
 * */
export interface Comic {
  /** 作者 */
  author: string
  /** 分类 */
  categories: string[]
  /** 章节数 */
  epsCount: number
  /** 是否完结 */
  finished: boolean
  /** 图片数量 */
  pagesCount: number
  /** 资源路径 */
  thumb: {
    /** baseUrl */
    fileServer: string
    /** 图片名字 */
    originalName: string
    /** 资源路径 */
    path: string
  }
  /** 标题 */
  title: string
  /** 喜欢的人数 */
  totalLikes: number
  /** 观看数 */
  totalViews: number
  /** id */
  id: string
}

/**
 * 获取漫画列表
 */
export async function getComics(params: ComicsParams) {
  return alova
    .Get<Comics>('comics', {
      params: params,
    })
    .then((res) => {
      return res.comics
    })
}
