/**
 * 接口返回状态码枚举
 * 包含API请求返回的各种状态码及其含义
 */
export enum ApiCode {
  /**
   * 成功
   */
  Success = 200,

  /**
   * 未授权（登出状态）
   */
  Logout = 401,
}
