# Rollup 依赖问题修复指南

## 🚨 问题描述

在 Vercel 部署时遇到以下错误：
```
Error: Cannot find module @rollup/rollup-linux-x64-gnu
```

这是 npm 可选依赖的已知 bug：https://github.com/npm/cli/issues/4828

## 🔧 解决方案

### 方案 1: 使用 .npmrc 配置 (推荐)

已添加 `.npmrc` 文件：
```
legacy-peer-deps=true
fund=false
audit=false
prefer-offline=true
progress=false
```

### 方案 2: 自定义构建脚本

已创建 `scripts/vercel-build.js`，包含：
- 自动检测和修复依赖问题
- 备用构建方案
- 详细的错误处理

### 方案 3: 简化构建命令

如果上述方案都不工作，可以使用 `vercel-simple.json`：
```json
{
  "version": 2,
  "buildCommand": "npm install --legacy-peer-deps && npm run build-only",
  "outputDirectory": "dist",
  "installCommand": "npm install --legacy-peer-deps"
}
```

## 📋 当前配置

### vercel.json
```json
{
  "version": 2,
  "buildCommand": "node scripts/vercel-build.js",
  "outputDirectory": "dist",
  "installCommand": "npm install --legacy-peer-deps"
}
```

### 备用配置文件
- `vercel-simple.json` - 最简化配置
- `scripts/vercel-build.js` - 智能构建脚本

## 🚀 部署步骤

1. **首次部署**: 使用当前的 `vercel.json` 配置
2. **如果失败**: 将 `vercel-simple.json` 重命名为 `vercel.json`
3. **最后手段**: 在 Vercel 控制台手动设置构建命令

## 🔍 调试信息

### 检查本地构建
```bash
# 测试自定义构建脚本
node scripts/vercel-build.js

# 测试简化构建
npm install --legacy-peer-deps && npm run build-only
```

### Vercel 控制台设置
如果配置文件都不工作，可以在 Vercel 控制台手动设置：
- **Build Command**: `npm install --legacy-peer-deps && npm run build-only`
- **Output Directory**: `dist`
- **Install Command**: `npm install --legacy-peer-deps`

## 📚 相关资源

- [npm CLI Issue #4828](https://github.com/npm/cli/issues/4828)
- [Vercel Build Configuration](https://vercel.com/docs/projects/project-configuration)
- [Rollup Optional Dependencies](https://rollupjs.org/installation/#npm-packages)
