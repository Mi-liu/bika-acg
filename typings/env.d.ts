/// <reference types="vite/client" />
/// <reference types="unplugin-vue-router/client" />

interface ImportMetaEnv {
  /** 项目名称 */
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION?: string
}

interface AppVersionInfo {
  version: string
  commit: string
  buildTime: string
}

declare const __APP_VERSION_INFO__: AppVersionInfo
