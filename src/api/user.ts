import type { Comics, ComicsParams, PageData } from './comic'
import alova from '@/services'

/**
 * 登录
 * @param params 登录参数
 * @param params.email 邮箱
 * @param params.password 密码
 * @returns 登录结果
 */
export function login(params: { email: string, password: string }) {
  return alova.Post<{
    token: string
  }>('auth/sign-in', params)
}

interface RegisterParams {
  name: string
  email: string
  password: string
  gender: string
  birthday: string
}

/**
 * 注册
 * @param params 注册参数
 * @returns 注册结果
 */
export function register(params: RegisterParams) {
  return alova.Post<{
    token: string
  }>('auth/register', params)
}

/**
 * 头像
 */
export interface Avatar {
  /**
   * 原始名称
   */
  originalName: string
  /**
   * 路径
   */
  path: string
  /**
   * 文件服务器
   */
  fileServer: string
}

export interface UserProfile {
  _id: string
  birthday: string
  /**
   * 邮箱
   */
  email: string
  /**
   * 性别
   */
  gender: string
  /**
   * 昵称
   */
  name: string
  /**
   * 个性签名
   */
  slogan: string
  /**
   * 头衔
   */
  title: string
  /**
   * 是否验证
   */
  verified: boolean
  /**
   * 经验值
   */
  exp: number
  /**
   * 等级
   */
  level: number
  /**
   * 角色
   */
  characters: any[]
  /**
   * 创建时间
   */
  created_at: string
  /**
   * 头像
   */
  avatar: Avatar
  /**
   * 是否打卡
   */
  isPunched: boolean
}

/**
 * 获取用户信息
 * @returns 用户信息
 */
export function getUserProfile() {
  return alova.Get<{
    user: UserProfile
  }>('users/profile', {
    cacheFor: {
      mode: 'restore',
      expire: 60 * 10 * 1000,
    },
  })
}

/**
 * 获取用户收藏
 * @returns 用户收藏
 */
export function getUserFavourite(params: ComicsParams) {
  return alova
    .Get<Comics>('users/favourite', {
      params,
    })
    .then((res) => {
      return res.comics
    })
}

interface Comments {
  comments: {
    docs: {
      /** 评论id */
      _id: string
      /** 评论内容 */
      content: string
      /** 评论时间 */
      created_at: string
      /** 评论的漫画 */
      _comic: {
        /** 漫画id */
        _id: string
        /** 漫画标题 */
        title: string
      }
    }[]
  } & PageData
}

/**
 * 获取用户评论历史
 * @returns 评论历史
 */
export function getMyComments(params: { page: number }) {
  return alova
    .Get<Comments>('users/my-comments', {
      params,
    })
    .then((res) => {
      return res.comments
    })
}
