import { store } from '@/store'

interface PageNavTab {
  title: string
  baseTitle?: string
  subtitle?: string
  fullPath: string
  path: string
}

const useLayoutStore = defineStore('layout', () => {
  const header = reactive({
    height: 50,
  })

  const pageTabs = ref<PageNavTab[]>([])

  function formatPageTabTitle(baseTitle: string, subtitle?: string) {
    return subtitle ? `${baseTitle}-${subtitle}` : baseTitle
  }

  function upsertPageTab(tab: PageNavTab) {
    const existingTab = pageTabs.value.find(item => item.fullPath === tab.fullPath)
    const baseTitle = tab.baseTitle || tab.title
    const subtitle = tab.subtitle ?? existingTab?.subtitle
    const nextTab = {
      title: formatPageTabTitle(baseTitle, subtitle),
      baseTitle,
      subtitle,
      fullPath: tab.fullPath,
      path: tab.path,
    }
    const existingIndex = pageTabs.value.findIndex(item => item.fullPath === nextTab.fullPath)

    if (existingIndex === -1) {
      pageTabs.value.push(nextTab)
      return
    }

    pageTabs.value.splice(existingIndex, 1, nextTab)
  }

  function updatePageTabSubtitle(fullPath: string, subtitle?: string) {
    const existingIndex = pageTabs.value.findIndex(item => item.fullPath === fullPath)

    if (existingIndex === -1) {
      return
    }

    const existingTab = pageTabs.value[existingIndex]
    const baseTitle = existingTab.baseTitle || existingTab.title
    const nextSubtitle = subtitle?.trim() || undefined

    pageTabs.value.splice(existingIndex, 1, {
      ...existingTab,
      title: formatPageTabTitle(baseTitle, nextSubtitle),
      baseTitle,
      subtitle: nextSubtitle,
    })
  }

  function removePageTab(fullPath: string) {
    if (pageTabs.value.length <= 1) {
      return
    }

    const existingIndex = pageTabs.value.findIndex(item => item.fullPath === fullPath)

    if (existingIndex === -1) {
      return
    }

    pageTabs.value.splice(existingIndex, 1)
  }

  return { header, pageTabs, upsertPageTab, updatePageTabSubtitle, removePageTab }
}, {
  persist: true,
  multiWindowSync: {
    enabled: true,
    debounce: 150,
    conflictResolution: 'latest',
    include: ['pageTabs'],
  },
})

export function useLayoutStoreHook() {
  return useLayoutStore(store)
}
