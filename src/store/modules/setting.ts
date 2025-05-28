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
      /** 屏蔽的分类 */
      blockedCategories: [] as string[],
      /** 漫画图片宽度 */
      comicImageWidth: 800,
      /** 自动阅读 */
      autoRead: false,
      /** 自动阅读速度 */
      autoReadSpeed: 10,
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
