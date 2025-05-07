import { store } from '@/store'

const useUserStore = defineStore(
  'user',
  () => {
    const token = ref('')

    return { token }
  },
  {
    persist: true,
  },
)

/** 用户信息 store */
export function useUserStoreHook() {
  return useUserStore(store)
}
