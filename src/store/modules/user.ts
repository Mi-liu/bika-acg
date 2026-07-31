import { getUserProfile as getUserProfileApi } from '@/api/user'
import { store } from '@/store'

const useUserStore = defineStore(
  'user',
  () => {
    const token = ref('')

    const user = ref<Awaited<ReturnType<typeof getUserProfileApi>>['user']>()

    /**
     * 获取用户信息
     */
    function getUserProfile() {
      getUserProfileApi().then((res) => {
        user.value = res.user
      })
    }

    /** 清空用户信息 */
    function clearUserProfile() {
      user.value = undefined
      token.value = ''
    }

    return { token, getUserProfile, user, clearUserProfile }
  },
  {
    persist: true,
  },
)

/** 用户信息 store */
export function useUserStoreHook() {
  return useUserStore(store)
}
