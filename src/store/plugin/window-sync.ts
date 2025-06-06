import type { PiniaPluginContext } from 'pinia'

/**
 * 简化版多窗口同步插件
 * 专为哔咔漫画项目设计，实现跨标签页状态同步
 */

/**
 * 多窗口同步配置接口
 */
interface MultiWindowSyncConfig {
  /** 是否启用多窗口同步 */
  enabled?: boolean
  /** 需要同步的字段，如果不指定则同步所有字段 */
  include?: string[]
  /** 不需要同步的字段 */
  exclude?: string[]
  /** 同步延迟（毫秒） */
  debounce?: number
  /** 冲突解决策略 */
  conflictResolution?: 'latest' | 'merge' | 'ignore'
}

interface WindowSyncMessage {
  type: 'PINIA_WINDOW_SYNC'
  storeId: string
  state: Record<string, unknown>
  timestamp: number
  windowId: string
}

interface SyncEnabledStore {
  $id: string
  $state: Record<string, unknown>
  $patch: (partialState: Record<string, unknown>) => void
  $subscribe: (callback: (mutation: any, state: any) => void, options?: any) => void
  $dispose?: () => void
  _lastSyncTime?: number
  _isSyncing?: boolean
  _syncConfig?: MultiWindowSyncConfig
}

// 当前窗口唯一标识
const CURRENT_WINDOW_ID = `window_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`

// 存储需要同步的 store 实例
const syncEnabledStores = new Map<string, SyncEnabledStore>()

// 防抖延迟
const DEBOUNCE_DELAY = 150

/**
 * 防抖函数
 */
function debounce<T extends (...args: any[]) => void>(func: T, delay: number): T {
  let timeoutId: number
  return ((...args: any[]) => {
    clearTimeout(timeoutId)
    timeoutId = window.setTimeout(() => func(...args), delay)
  }) as T
}

/**
 * 广播状态到其他窗口
 */
const broadcastState = debounce((storeId: string, state: Record<string, unknown>, syncConfig?: MultiWindowSyncConfig) => {
  const store = syncEnabledStores.get(storeId)
  if (!store || store._isSyncing) {
    return // 如果正在同步中，跳过广播
  }

  // 根据 include 配置过滤状态
  let filteredState = state
  if (syncConfig?.include && Array.isArray(syncConfig.include)) {
    filteredState = {}
    for (const key of syncConfig.include) {
      if (key in state) {
        filteredState[key] = state[key]
      }
    }
  }

  const message: WindowSyncMessage = {
    type: 'PINIA_WINDOW_SYNC',
    storeId,
    state: JSON.parse(JSON.stringify(filteredState)), // 深拷贝
    timestamp: Date.now(),
    windowId: CURRENT_WINDOW_ID,
  }

  try {
    // 优先使用 BroadcastChannel API
    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel('pinia-window-sync')
      channel.postMessage(message)
    }
    else {
      // 备用方案：localStorage 事件
      const storageKey = `pinia-sync-${storeId}`
      localStorage.setItem(storageKey, JSON.stringify(message))
      // 立即清除，触发 storage 事件
      setTimeout(() => localStorage.removeItem(storageKey), 50)
    }
  }
  catch (error) {
    console.warn(`[WindowSync] 广播状态失败 - Store: ${storeId}:`, error)
  }
}, DEBOUNCE_DELAY)

/**
 * 处理接收到的同步消息
 */
async function handleSyncMessage(message: WindowSyncMessage) {
  // 验证消息格式
  if (!message || message.type !== 'PINIA_WINDOW_SYNC') {
    return
  }

  // 忽略自己发送的消息
  if (message.windowId === CURRENT_WINDOW_ID) {
    return
  }

  const store = syncEnabledStores.get(message.storeId)
  if (!store) {
    console.warn(`[WindowSync] 未找到 store: ${message.storeId}`)
    return
  }

  // 如果正在同步中，跳过
  if (store._isSyncing) {
    return
  }

  // 防止循环同步 - 检查时间戳
  const lastSyncTime = store._lastSyncTime || 0
  if (message.timestamp <= lastSyncTime) {
    return
  }

  // 更新同步时间戳
  store._lastSyncTime = message.timestamp

  try {
    // 根据 include 配置更新状态
    const syncConfig = store._syncConfig

    // 临时禁用状态监听，避免触发新的同步
    store._isSyncing = true

    // 准备要更新的数据
    let updateData: Record<string, unknown> = {}

    if (syncConfig?.include && Array.isArray(syncConfig.include)) {
      // 只更新指定的字段
      for (const key of syncConfig.include) {
        if (key in message.state) {
          updateData[key] = message.state[key]
        }
      }
    }
    else {
      // 更新整个状态
      updateData = message.state
    }

    // 使用 $patch 方法强制更新状态
    store.$patch(updateData)

    console.log(`[WindowSync] 状态同步成功 - Store: ${message.storeId}`, message.state)
  }
  catch (error) {
    console.warn(`[WindowSync] 状态同步失败 - Store: ${message.storeId}:`, error)
  }
  finally {
    // 延迟重新启用监听，确保状态更新完成
    setTimeout(() => {
      store._isSyncing = false
    }, 200)
  }
}

/**
 * 初始化消息监听器
 */
function initializeMessageListeners() {
  // BroadcastChannel 监听
  if (typeof BroadcastChannel !== 'undefined') {
    const channel = new BroadcastChannel('pinia-window-sync')
    channel.addEventListener('message', (event) => {
      handleSyncMessage(event.data)
    })

    console.log('[WindowSync] BroadcastChannel listener initialized')
  }

  // localStorage 事件监听（备用方案）
  window.addEventListener('storage', (event) => {
    if (event.key?.startsWith('pinia-sync-') && event.newValue) {
      try {
        const message = JSON.parse(event.newValue)
        handleSyncMessage(message)
      }
      catch (error) {
        console.warn('Failed to parse storage sync message:', error)
      }
    }
  })

  console.log('[WindowSync] Storage listener initialized')
}

/**
 * 多窗口同步插件主函数
 */
export default function windowSyncPlugin({ store, options }: PiniaPluginContext) {
  // 检查是否启用多窗口同步
  const syncConfig = (options as any)?.multiWindowSync as MultiWindowSyncConfig | undefined
  if (!syncConfig?.enabled) {
    return
  }

  // 注册 store
  syncEnabledStores.set(store.$id, store)

  // 保存同步配置到 store
  store._syncConfig = syncConfig

  // 初始化同步相关属性
  store._lastSyncTime = Date.now()
  store._isSyncing = false

  // 监听状态变更
  store.$subscribe((_mutation, state) => {
    // 如果正在同步中，跳过广播
    if (store._isSyncing) {
      return
    }

    // 广播状态变更
    broadcastState(store.$id, state, syncConfig)
  }, {
    detached: true,
    deep: true,
  })

  // 重写 $dispose 方法，清理资源
  const originalDispose = store.$dispose
  store.$dispose = () => {
    syncEnabledStores.delete(store.$id)
    console.log(`[WindowSync] Disposed sync for store: ${store.$id}`)
    originalDispose?.()
  }
}

// 全局初始化监听器（只初始化一次）
let listenersInitialized = false
if (!listenersInitialized && typeof window !== 'undefined') {
  initializeMessageListeners()
  listenersInitialized = true
}
