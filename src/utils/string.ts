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
