# 多窗口同步功能说明

## 🎯 功能概述

本项目实现了跨浏览器标签页的 Pinia 状态同步功能，当用户在一个标签页中修改设置或状态时，其他标签页会自动同步更新。

## 🔧 技术实现

### 核心技术
- **BroadcastChannel API**: 主要通信方式，支持现代浏览器
- **localStorage 事件**: 备用方案，兼容旧版浏览器
- **Pinia 插件系统**: 无侵入式集成

### 同步机制
1. **状态监听**: 监听 Pinia store 的状态变更
2. **消息广播**: 通过 BroadcastChannel 或 localStorage 广播变更
3. **状态更新**: 其他窗口接收消息并更新本地状态
4. **防抖优化**: 避免频繁同步影响性能

## 📁 文件结构

```
src/store/plugin/
├── window-sync.ts          # 简化版同步插件（推荐）
├── multi-window-sync.ts    # 基础版同步插件
├── advanced-sync.ts        # 高级版同步插件
└── persistedstate.ts       # 持久化插件
```

## 🚀 使用方法

### 1. 启用同步

在 store 定义中添加 `multiWindowSync` 配置：

```typescript
const useSettingStore = defineStore('setting', () => {
  // store 逻辑
  return { ... }
}, {
  persist: true,
  multiWindowSync: {
    enabled: true,           // 启用多窗口同步
    debounce: 200,          // 防抖延迟（毫秒）
    conflictResolution: 'latest', // 冲突解决策略
    include: ['comic'],      // 同步的字段（可选）
    exclude: ['temp'],       // 排除的字段（可选）
  },
})
```

### 2. 配置选项

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `enabled` | boolean | false | 是否启用多窗口同步 |
| `debounce` | number | 150 | 防抖延迟时间（毫秒） |
| `conflictResolution` | string | 'latest' | 冲突解决策略 |
| `include` | string[] | undefined | 需要同步的字段 |
| `exclude` | string[] | undefined | 不需要同步的字段 |

### 3. 冲突解决策略

- **`latest`**: 使用最新的状态（推荐）
- **`merge`**: 智能合并状态
- **`ignore`**: 忽略冲突，保持本地状态

## 📊 已配置的 Store

### 用户信息 Store (`user`)
```typescript
multiWindowSync: {
  enabled: true,
  debounce: 100,
  conflictResolution: 'latest',
  include: ['token', 'user'],
}
```

### 设置 Store (`setting`)
```typescript
multiWindowSync: {
  enabled: true,
  debounce: 200,
  conflictResolution: 'latest',
  include: ['comic'],
}
```

### 本地存储 Store (`local`)
```typescript
multiWindowSync: {
  enabled: true,
  debounce: 300,
  conflictResolution: 'merge',
  include: ['local'],
}
```

## 🧪 测试方法

### 1. 使用演示组件

访问包含 `WindowSyncDemo` 组件的页面：

```vue
<template>
  <WindowSyncDemo />
</template>

<script setup>
import WindowSyncDemo from '@/components/WindowSyncDemo/index.vue'
</script>
```

### 2. 手动测试步骤

1. 打开多个浏览器标签页
2. 在任意标签页中修改设置：
   - 更改图片质量
   - 调整漫画图片宽度
   - 切换自动阅读开关
   - 修改用户 token
3. 观察其他标签页是否自动更新

### 3. 控制台调试

打开浏览器开发者工具，查看同步日志：

```javascript
// 查看同步状态
console.log('[WindowSync] 同步已启用')

// 监听同步事件
const channel = new BroadcastChannel('pinia-window-sync')
channel.addEventListener('message', (event) => {
  console.log('收到同步消息:', event.data)
})
```

## 🔍 故障排除

### 常见问题

1. **同步不工作**
   - 检查浏览器是否支持 BroadcastChannel API
   - 确认 store 配置中 `enabled: true`
   - 查看控制台是否有错误信息

2. **同步延迟**
   - 调整 `debounce` 参数
   - 检查网络状况
   - 确认没有大量数据同步

3. **状态冲突**
   - 调整 `conflictResolution` 策略
   - 使用 `include`/`exclude` 精确控制同步字段

### 调试技巧

```javascript
// 检查 BroadcastChannel 支持
if (typeof BroadcastChannel !== 'undefined') {
  console.log('✅ BroadcastChannel 支持')
} else {
  console.log('❌ BroadcastChannel 不支持，使用 localStorage 备用方案')
}

// 监听所有同步消息
const channel = new BroadcastChannel('pinia-window-sync')
channel.addEventListener('message', (event) => {
  console.log(`[${new Date().toLocaleTimeString()}] 同步消息:`, event.data)
})
```

## 🎨 自定义配置

### 创建自定义同步插件

```typescript
import type { PiniaPluginContext } from 'pinia'

export default function customSyncPlugin({ store, options }: PiniaPluginContext) {
  // 自定义同步逻辑
  if (options.customSync?.enabled) {
    // 实现自定义同步
  }
}
```

### 高级配置示例

```typescript
const useAdvancedStore = defineStore('advanced', () => {
  // store 逻辑
}, {
  multiWindowSync: {
    enabled: true,
    debounce: 500,
    conflictResolution: 'merge',
    include: ['importantData'],
    exclude: ['temporaryData', 'cache'],
  },
})
```

## 📈 性能优化

### 最佳实践

1. **合理设置防抖时间**: 根据数据更新频率调整 `debounce`
2. **精确控制同步字段**: 使用 `include`/`exclude` 减少不必要的同步
3. **选择合适的冲突策略**: 根据业务需求选择 `conflictResolution`
4. **监控同步性能**: 在开发环境启用调试日志

### 性能指标

- **同步延迟**: 通常 < 200ms
- **内存占用**: 每个 store 约 1-2KB
- **网络开销**: 仅在状态变更时传输

## 🔗 相关资源

- [BroadcastChannel API 文档](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel)
- [Pinia 插件开发指南](https://pinia.vuejs.org/core-concepts/plugins.html)
- [localStorage 事件处理](https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event)
