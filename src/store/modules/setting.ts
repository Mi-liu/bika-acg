import { store } from '@/store'

const useSettingStore = defineStore('setting', () => {
  const comic = reactive({
    imageQuality: 'aaaa',
  })

  return { comic }
})

/** 用户信息 store */
export function useSettingStoreHook() {
  return useSettingStore(store)
}
