# Vercel 部署故障排除指南

## 🚨 常见部署失败原因及解决方案

### 1. 构建失败

#### 问题：类型检查错误
**错误信息**: `Type checking failed`
**原因**: `npm run build` 包含类型检查，可能因为类型错误导致构建失败
**解决方案**:
```json
// vercel.json
{
  "buildCommand": "npm run build-only"
}
```

#### 问题：依赖安装失败
**错误信息**: `npm install failed`
**原因**: 依赖版本冲突或网络问题
**解决方案**:
```json
// vercel.json
{
  "installCommand": "npm ci --legacy-peer-deps"
}
```

#### 问题：Node.js 版本不兼容
**错误信息**: `Node version not supported`
**解决方案**: 在 `package.json` 中指定 Node.js 版本
```json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### 2. 配置文件错误

#### 问题：vercel.json 语法错误
**常见错误**:
- 使用了不支持的配置项
- JSON 语法错误
- 路径配置错误

**最简配置**:
```json
{
  "version": 2
}
```

**推荐配置**:
```json
{
  "version": 2,
  "buildCommand": "npm run build-only",
  "outputDirectory": "dist",
  "installCommand": "npm ci"
}
```

### 3. 路由问题

#### 问题：页面 404
**原因**: SPA 路由配置问题
**解决方案**: 
由于项目使用 Hash 路由，通常不需要额外配置。如果仍有问题，可以添加：
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 4. 环境变量问题

#### 问题：环境变量未生效
**检查清单**:
- [ ] 变量名是否以 `VITE_` 开头
- [ ] 在 Vercel 控制台是否正确设置
- [ ] 是否重新部署

**设置方法**:
1. Vercel 控制台 → 项目 → Settings → Environment Variables
2. 添加变量，选择适当的环境 (Production/Preview/Development)

### 5. 静态资源问题

#### 问题：静态资源 404
**检查项目**:
- [ ] `vite.config.ts` 中的 `base` 配置
- [ ] 资源路径是否正确
- [ ] 构建产物是否包含资源文件

**解决方案**:
```typescript
// vite.config.ts
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/' : './',
})
```

## 🔧 调试步骤

### 1. 本地验证
```bash
# 本地构建测试
npm run build-only

# 本地预览
npm run preview

# 检查构建产物
ls -la dist/
```

### 2. Vercel CLI 调试
```bash
# 安装 Vercel CLI
npm i -g vercel

# 本地开发服务器
vercel dev

# 部署到预览环境
vercel

# 查看部署日志
vercel logs
```

### 3. 检查部署日志
1. 访问 Vercel 控制台
2. 选择项目 → Deployments
3. 点击失败的部署查看详细日志

## 📋 配置文件模板

### 最简配置 (推荐)
```json
{
  "version": 2
}
```

### 基础配置
```json
{
  "version": 2,
  "buildCommand": "npm run build-only",
  "outputDirectory": "dist",
  "installCommand": "npm ci"
}
```

### 完整配置
```json
{
  "version": 2,
  "buildCommand": "npm run build-only",
  "outputDirectory": "dist",
  "installCommand": "npm ci",
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

## 🆘 紧急修复

如果部署持续失败，可以尝试以下紧急修复：

### 1. 使用最简配置
将 `vercel.json` 内容替换为：
```json
{
  "version": 2
}
```

### 2. 跳过类型检查
临时修改 `package.json`：
```json
{
  "scripts": {
    "build": "vite build"
  }
}
```

### 3. 使用备用构建命令
在 Vercel 控制台设置：
- Build Command: `vite build`
- Output Directory: `dist`
- Install Command: `npm install`

## 📞 获取帮助

1. **Vercel 官方文档**: https://vercel.com/docs
2. **Vite 部署指南**: https://vitejs.dev/guide/static-deploy.html
3. **项目 Issues**: 在项目仓库创建 Issue
4. **Vercel 社区**: https://github.com/vercel/vercel/discussions
