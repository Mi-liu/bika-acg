/**
 * 插件系统类型声明
 */
import type { LoggerService } from '@/plugins/modules/logger'

// 扩展 Vue 全局属性
declare module 'vue' {
  interface ComponentCustomProperties {
    // 日志服务
    $logger: LoggerService
  }
}
