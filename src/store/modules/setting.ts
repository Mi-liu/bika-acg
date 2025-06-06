import { cloneDeep } from 'lodash-es'
import { pictureQuality } from '@/constants/options'
import { proxy } from '@/services/config'
import { store } from '@/store'

const useSettingStore = defineStore(
  'setting',
  () => {
    /** 漫画设置 */
    const comic = reactive({
      /** 图片质量 */
      imageQuality: pictureQuality[2].value,
      /** 请求代理 */
      proxy: cloneDeep(proxy[0].value),
      /** 屏蔽的分类 */
      blockedCategories: [] as string[],
      /** 漫画图片宽度 */
      comicImageWidth: 800,
      /** 自动阅读 */
      autoRead: false,
      /** 自动阅读速度 */
      autoReadSpeed: 20,
    })

    return { comic }
  },
  {
    persist: true,
    multiWindowSync: {
      enabled: true,
      debounce: 200,
      conflictResolution: 'latest',
      // 同步所有漫画设置
      include: ['comic'],
    },
  },
)

/** 用户信息 store */
export function useSettingStoreHook() {
  return useSettingStore(store)
}
