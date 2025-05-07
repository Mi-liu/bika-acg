import 'alova'

declare module 'alova' {
  export interface AlovaCustomTypes {
    meta: {
      /** 是否显示错误信息 */
      message?: boolean
    }
  }
}
