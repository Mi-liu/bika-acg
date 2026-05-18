import type { StateTree } from 'pinia'

declare module 'pinia' {
  // Generic names must match Pinia's declaration for module augmentation.
  // eslint-disable-next-line unused-imports/no-unused-vars, ts/no-unused-vars
  interface DefineStoreOptionsBase<S extends StateTree, Store> {
    /**
     * pinia-plugin-persistedstate 配置
     */
    persist?: boolean | Record<string, unknown> | Array<Record<string, unknown>>
    /**
     * 多窗口同步配置
     */
    multiWindowSync?: MultiWindowSyncConfig
  }

  interface PiniaCustomProperties {
    // 同步相关的内部属性
    _lastSyncTime?: number
    _isSyncing?: boolean
    _syncDisabled?: boolean
    _localChanges?: Record<string, number>
    _previousState?: any
    _syncConfig?: MultiWindowSyncConfig
  }
}

export {}
