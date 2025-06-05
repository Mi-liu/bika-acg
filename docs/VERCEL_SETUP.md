# Vercel 配置设置指南

## 🎯 项目配置概览

本项目已完整配置 Vercel 部署，包含以下特性：

- ✅ 自动构建和部署
- ✅ SPA 路由支持 (Hash 模式)
- ✅ 静态资源缓存优化
- ✅ 安全头配置
- ✅ 代码分割和性能优化
- ✅ 环境变量管理
- ✅ GitHub Actions 集成

## 📋 部署前检查清单

### 1. 必需文件确认

- [x] `vercel.json` - Vercel 配置文件
- [x] `.env.example` - 环境变量示例
- [x] `scripts/deploy.js` - 部署脚本
- [x] `docs/DEPLOYMENT.md` - 部署文档

### 2. 项目配置确认

- [x] Vue Router 使用 Hash 模式
- [x] Vite 配置优化
- [x] 构建输出目录为 `dist`
- [x] 静态资源路径正确

## 🚀 首次部署步骤

### 1. 安装 Vercel CLI

```bash
npm install -g vercel
```

### 2. 登录 Vercel

```bash
vercel login
```

### 3. 初始化项目

```bash
vercel
```

按照提示完成项目配置：
- 选择团队 (如果有)
- 确认项目名称
- 确认项目目录
- 选择框架 (Vite)

### 4. 配置环境变量

在 Vercel 控制台设置以下环境变量：

```bash
# 必需的环境变量
VITE_API_BASE_URL=https://your-api-domain.com
VITE_IMAGE_PROXY_URL=https://your-image-proxy.com

# 可选的环境变量
NODE_ENV=production
VITE_BUILD_SOURCEMAP=false
```

### 5. 部署项目

```bash
# 预览部署
npm run deploy:preview

# 生产部署
npm run deploy:prod
```

## 🔧 Vercel 控制台配置

### 1. 项目设置

在 Vercel 控制台 → 项目 → Settings：

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm ci`

### 2. 域名配置

- **Production Domain**: 配置自定义域名
- **Preview Domains**: 自动生成预览域名

### 3. Git 集成

- **Connected Git Repository**: 连接 GitHub 仓库
- **Production Branch**: `main` 或 `master`
- **Auto-deploy**: 启用自动部署

## 🌍 环境变量配置

### 开发环境

创建 `.env.local` 文件：

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_IMAGE_PROXY_URL=http://localhost:3001
VITE_ENABLE_DEVTOOLS=true
```

### 生产环境

在 Vercel 控制台配置：

```env
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_IMAGE_PROXY_URL=https://images.yourdomain.com
VITE_ENABLE_DEVTOOLS=false
NODE_ENV=production
```

## 🔄 GitHub Actions 配置

### 1. 设置 Secrets

在 GitHub 仓库 → Settings → Secrets and variables → Actions：

```
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id
```

### 2. 获取 Vercel Token

```bash
vercel login
vercel --token
```

### 3. 获取项目 ID

```bash
vercel project ls
```

## 📊 性能优化配置

### 1. 缓存策略

- **静态资源**: 1年缓存
- **HTML文件**: 不缓存
- **API响应**: 根据需要配置

### 2. 代码分割

已配置的分割策略：
- Vue 核心库 (`vue-vendor`)
- Element Plus (`element-plus`)
- 工具库 (`utils`)
- 动画库 (`animation`)
- 图标库 (`icons`)

### 3. 压缩优化

- **JavaScript**: Terser 压缩
- **CSS**: 自动压缩
- **图片**: 建议使用 WebP 格式

## 🛡️ 安全配置

### 1. 安全头

已配置的安全头：
- `X-Content-Type-Options`
- `X-Frame-Options`
- `X-XSS-Protection`
- `Referrer-Policy`
- `Permissions-Policy`

### 2. CORS 配置

静态资源允许跨域访问：
```json
{
  "key": "Access-Control-Allow-Origin",
  "value": "*"
}
```

## 🐛 常见问题解决

### 1. 构建失败

**问题**: Node.js 版本不兼容
**解决**: 在 `package.json` 中指定 Node.js 版本：

```json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### 2. 路由 404

**问题**: SPA 路由不工作
**解决**: 确认 `vercel.json` 中的重写规则正确

### 3. 环境变量不生效

**问题**: 环境变量未正确加载
**解决**: 
- 确认变量名以 `VITE_` 开头
- 在 Vercel 控制台重新部署

### 4. 静态资源 404

**问题**: 静态资源路径错误
**解决**: 检查 `vite.config.ts` 中的 `base` 配置

## 📈 监控和分析

### 1. Vercel Analytics

在 Vercel 控制台启用 Analytics：
- 页面访问统计
- 性能指标监控
- 用户行为分析

### 2. 性能监控

推荐工具：
- **Lighthouse**: 性能审计
- **Web Vitals**: 核心指标
- **Sentry**: 错误监控

## 🔗 相关资源

- [Vercel 官方文档](https://vercel.com/docs)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html)
- [Vue Router 部署](https://router.vuejs.org/guide/essentials/history-mode.html)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
