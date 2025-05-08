import { isExternal } from './string'

const settingStore = useSettingStoreHook()

/**
 * 获取文件名
 * @param path 文件路径
 * @returns 包含文件名信息的对象
 * @example
 * getFileName('/path/to/file.txt') // { fileName: 'file.txt', baseName: 'file' }
 */
export function getFileName(path: string) {
  const parts = path.split('/')
  const fileName = parts[parts.length - 1]
  const baseName = fileName?.split('.')[0]
  return {
    /** 文件名(带扩展名) */
    fileName,
    /** 文件名(不带扩展名) */
    baseName,
  }
}

/**
 * 获取 src/assets下path目录下的资源文件路径
 * @param path 文件路径
 * @returns 资源文件路径
 * @example
 * getAssetsFileUrl('no1.png') // /src/assets/no1.png
 */
export function getAssetsFileUrl(path: string) {
  return new URL(`/src/assets/${path}`, import.meta.url).href
}

/**
 * 获取图片的完整路径
 * @param {string} path 图片路径，支持本地路径或外部链接(http/https/data)
 * @returns {string} 图片的完整访问路径
 * @example
 * getImageUrl('avatar.png') // /src/assets/avatar.png
 * getImageUrl('https://example.com/avatar.png') // https://example.com/avatar.png
 * getImageUrl('data:image/png;base64,...') // data:image/png;base64,...
 */
export function getImageUrl(path: string) {
  if (isExternal(path)) {
    return path
  }
  return settingStore.comic.imageBaseUrl + path
  // return getAssetsFileUrl(path)
}
