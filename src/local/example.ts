import { storage } from './index'
import { FOLLOW_AUTHOR_LIST, WATCH_LATER_LIST, ACCOUNT_INFO } from './key'
import type { Comic } from '@/api/comic'

/**
 * 本地存储数组操作使用示例
 */
export class StorageArrayExample {
  /**
   * 类型约束测试 - 这些调用会在编译时进行类型检查
   */
  static async typeConstraintTest() {
    // ✅ 正确：FOLLOW_AUTHOR_LIST 是数组类型
    await storage.pushItem(FOLLOW_AUTHOR_LIST, 'author1')

    // ✅ 正确：WATCH_LATER_LIST 是数组类型
    await storage.pushItem(WATCH_LATER_LIST, {} as Comic)

    // ❌ 错误：ACCOUNT_INFO 不是数组类型，TypeScript 会在编译时报错
    // await storage.pushItem(ACCOUNT_INFO, 'some value')

    // ✅ 正确：CATEGORIES 也是数组类型
    await storage.pushItem(CATEGORIES, { title: 'new category' })

    console.log('类型约束测试通过')
  }
  /**
   * 关注作者示例
   */
  static async followAuthor(authorName: string) {
    try {
      // 检查是否已经关注
      const isAlreadyFollowing = await storage.hasInArray(
        FOLLOW_AUTHOR_LIST,
        (author) => author === authorName,
      )

      if (isAlreadyFollowing) {
        console.log(`已经关注了作者: ${authorName}`)
        return false
      }

      // 添加到关注列表
      const updatedList = await storage.pushItem(FOLLOW_AUTHOR_LIST, authorName)
      console.log(`成功关注作者: ${authorName}`, updatedList)
      return true
    } catch (error) {
      console.error('关注作者失败:', error)
      return false
    }
  }

  /**
   * 取消关注作者示例
   */
  static async unfollowAuthor(authorName: string) {
    try {
      const updatedList = await storage.removeFromArray(
        FOLLOW_AUTHOR_LIST,
        (author) => author === authorName,
      )
      console.log(`取消关注作者: ${authorName}`, updatedList)
      return updatedList
    } catch (error) {
      console.error('取消关注作者失败:', error)
      return []
    }
  }

  /**
   * 获取关注的作者列表
   */
  static async getFollowedAuthors() {
    try {
      const authors = await storage.getItem(FOLLOW_AUTHOR_LIST, [])
      return authors
    } catch (error) {
      console.error('获取关注作者列表失败:', error)
      return []
    }
  }

  /**
   * 添加漫画到稍后观看列表示例
   */
  static async addToWatchLater(comic: Comic) {
    try {
      // 检查是否已经在列表中
      const isAlreadyInList = await storage.hasInArray(
        WATCH_LATER_LIST,
        (item) => item._id === comic._id,
      )

      if (isAlreadyInList) {
        console.log(`漫画已在稍后观看列表中: ${comic.title}`)
        return false
      }

      // 添加到稍后观看列表
      const updatedList = await storage.pushItem(WATCH_LATER_LIST, comic)
      console.log(`添加到稍后观看: ${comic.title}`, updatedList)
      return true
    } catch (error) {
      console.error('添加到稍后观看失败:', error)
      return false
    }
  }

  /**
   * 从稍后观看列表移除漫画示例
   */
  static async removeFromWatchLater(comicId: string) {
    try {
      const updatedList = await storage.removeFromArray(
        WATCH_LATER_LIST,
        (comic) => comic._id === comicId,
      )
      console.log(`从稍后观看移除漫画: ${comicId}`, updatedList)
      return updatedList
    } catch (error) {
      console.error('从稍后观看移除失败:', error)
      return []
    }
  }

  /**
   * 更新稍后观看列表中的漫画信息示例
   */
  static async updateWatchLaterComic(comicId: string, updatedComic: Partial<Comic>) {
    try {
      const updatedList = await storage.updateInArray(
        WATCH_LATER_LIST,
        (comic) => comic._id === comicId,
        (comic) => ({ ...comic, ...updatedComic }),
      )
      console.log(`更新稍后观看漫画: ${comicId}`, updatedList)
      return updatedList
    } catch (error) {
      console.error('更新稍后观看漫画失败:', error)
      return []
    }
  }
}
