import type { SortOptionValue } from '@/constants/options'
import { HIDDEN_CATEGORIES } from '@/config/categories'
import alova from '@/services'
/** 分页返回的数据 */
export interface PageData {
  /** 页码 */
  page: number
  /** 每页数量 */
  limit: number
  /** 总页数 */
  pages: number
  /** 总数量 */
  total: number
}

export interface Categories {
  categories: {
    title: string
  }[]
}

/**
 * 获取漫画分类
 */
export async function getCategories() {
  const localStore = useLocalStoreHook()
  const res = localStore.local.CATEGORIES
  if (res.length) {
    return res
  }
  else {
    return alova.Get<Categories>('categories').then((res) => {
      const categories = res.categories.filter(
        category => !HIDDEN_CATEGORIES.includes(category.title),
      )
      localStore.local.CATEGORIES = categories
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
   * 都在搜索的关键词
   */
  t?: string
  /**
   * 搜索的关键词
   */
  keyword?: string
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
  } & PageData
}

/**
 *  本子基本信息
 */
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
  _id: string
}

/**
 * 本子详情信息
 */
export interface ComicDetail extends Omit<Comic, 'id'> {
  _id: string
  /** 简介  */
  description: string
  /** 汉化团队  */
  chineseTeam: string
  /** 标签  */
  tags: string[]
  /** 是否允许下载  */
  allowDownload: boolean
  /** 是否允许评论  */
  allowComment: boolean
  /** 评论数量  */
  totalComments: number
  /** 喜欢的人数 */
  totalLikes: number
  /** 观看数 */
  totalViews: number
  /** 是否已收藏  */
  isFavourite: boolean
  /** 是否已喜欢  */
  isLiked: boolean
  /** 更新时间  */
  updated_at: string
  /** 上传人员 */
  _creator: {
    /** 资源路径 */
    avatar: Comic['thumb']
    /** 名字 */
    name: string
  }
}

/**
 * 获取漫画列表
 */
export function getComics(params: Omit<ComicsParams, 'keyword'>) {
  return alova
    .Get<Comics>('comics', {
      params,
      cacheFor: {
        expire: 0,
      },
    })
    .then((res) => {
      return res.comics
    })
}

/** 获取本子的详情信息 */
export function getComicDetail(id: string) {
  return alova
    .Get<{
    comic: ComicDetail
  }>(`comics/${id}`)
    .then(res => res.comic)
}

/** 收藏 or 取消收藏本子 */
export function favorites(id: string) {
  return alova
    .Post<{
    action: 'favourite' | 'un_favourite'
  }>(`comics/${id}/favourite`)
    .then(res => res.action)
}

/** 本子章节列表返回 */
export interface ComicEps extends PageData {
  /** 章节列表 */
  docs: ComicEpsItem[]
}

/** 本子章节列表返回 */
export interface ComicEpsItem {
  /** 章节标题 */
  title: string
  /** 章节id */
  id: string
}

/** 获取本子章节列表 */
export function getComicEps(id: string, page: number) {
  return alova
    .Get<{
    eps: ComicEps
  }>(`comics/${id}/eps`, { params: { page } })
    .then(res => res.eps)
}

/** 本子章节图片列表返回 */
export interface ComicOrderPage {
  ep: {
    /** 章节标题 */
    title: string
    /** 章节id */
    _id: string
  }
  /** 图片列表 */
  pages: {
    docs: {
      id: string
      media: {
        /** 图片路径 */
        path: string
        /** 图片名称 */
        originalName: string
        /** 图片服务器 */
        fileServer: string
      }
    }[]
  } & PageData
}

/** 获取本子章节图片列表 */
export function getComicPages(id: string, order: number, page: number, _forceRefresh = false) {
  const settingStore = useSettingStoreHook()
  return alova.Get<ComicOrderPage>(`comics/${id}/order/${order}/pages`, {
    params: {
      page,
      // 将画质作为请求参数，确保不同画质有不同的请求
      settingStore: settingStore.comic.imageQuality,
    },
  })
}

/** 输入框关键词搜索漫画 */
export function searchComics(params: Pick<ComicsParams, 'page' | 's' | 'keyword'>) {
  return alova
    .Post<Comics>(`comics/advanced-search?page=${params.page}&s=${params.s}`, {
      keyword: params.keyword,
      sort: params.s,
    })
    .then((res) => {
      return res.comics
    })
}

/** 获取随机漫画列表 */
export function getRandomComic() {
  // 禁用缓存，确保每次请求都获取最新数据
  return alova
    .Get<{
    comics: Comic[]
  }>('comics/random', {
      cacheFor: {
        expire: 0,
      },
    })
    .then(res => res.comics)
}
