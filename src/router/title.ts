import type { RouteLocationNormalized, RouteLocationNormalizedLoaded } from 'vue-router'

type RouteTitleSource = RouteLocationNormalized | RouteLocationNormalizedLoaded

function getQueryText(value: RouteTitleSource['query'][string]) {
  const normalizedValue = Array.isArray(value) ? value[0] : value

  if (typeof normalizedValue !== 'string') {
    return undefined
  }

  return normalizedValue.trim() || undefined
}

export function getRouteTitle(currentRoute: RouteTitleSource) {
  const title = getQueryText(currentRoute.query.title)

  if (title) {
    return title
  }

  if (currentRoute.path === '/comic/list') {
    const author = getQueryText(currentRoute.query.author)

    if (author) {
      return `作者：${author}`
    }

    const keywords = getQueryText(currentRoute.query.keywords)

    if (keywords) {
      return `关键词：${keywords}`
    }
  }

  const matchedWithTitle = currentRoute.matched.filter(record => record.meta?.title)
  const lastMatched = matchedWithTitle.at(-1)

  return String(lastMatched?.meta?.title || currentRoute.name || currentRoute.path || '未命名页面')
}
