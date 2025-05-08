import { store } from '@/store'

const useLayoutStore = defineStore('layout', () => {
  const header = reactive({
    height: 50,
  })

  return { header }
})

export function useLayoutStoreHook() {
  return useLayoutStore(store)
}
