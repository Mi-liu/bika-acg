import { store } from '@/store'
import { pictureQuality, imageBaseUrl } from '@/constants/options'

const useSettingStore = defineStore(
  'setting',
  () => {
    /** 漫画设置 */
    const comic = reactive({
      /** 图片质量 */
      imageQuality: pictureQuality[2].value,
      /** 图片代理链接 */
      imageBaseUrl: imageBaseUrl[0].value,
    })

    return { comic }
  },
  {
    persist: true,
  },
)

/** 用户信息 store */
export function useSettingStoreHook() {
  return useSettingStore(store)
}
