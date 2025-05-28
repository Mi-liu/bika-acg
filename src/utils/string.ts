/** 首字母大写 */
export function upperFirst(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * 判断是否是外部链接或base64
 *
 * @param {string} path
 * @return {boolean}
 */
export function isExternal(path: string) {
  const isExternal = /^(?:https?:|http?:|mailto:|tel:|data:)/.test(path)
  return isExternal
}

/**
 * 获取图片的完整路径
 * @param {string} path 图片路径，支持本地路径或外部链接(http/https/data)
 * @returns {string} 图片的完整访问路径
 * @example
 * getImageUrl('avatar.png') // settingStore.comic.imageBaseUrl + avatar.png
 * getImageUrl('https://example.com/avatar.png') // https://example.com/avatar.png
 * getImageUrl('data:image/png;base64,...') // data:image/png;base64,...
 */
export function getImageUrl(path: string) {
  if (isExternal(path)) {
    return path
  }
  const settingStore = useSettingStoreHook()
  return settingStore.comic.proxy.file + path
}
