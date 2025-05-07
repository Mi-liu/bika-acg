import alova from '@/services'

export const login = (params: { email: string; password: string }) =>
  alova.Post<{
    token: string
  }>('auth/sign-in', params)
