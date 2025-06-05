# Vercel 部署指南

本项目配置了完整的 Vercel 静态部署方案，支持自动构建和部署。

## 🚀 快速开始

### 1. 安装 Vercel CLI

```bash
npm i -g vercel
```

### 2. 登录 Vercel

```bash
vercel login
```

### 3. 部署项目

```bash
# 部署预览版本
npm run deploy:preview

# 部署生产版本
npm run deploy:prod
```

## 📁 项目配置

### vercel.json 配置说明

```json
{
  "version": 2,
  "name": "pic-age",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm ci",
  "framework": "vite"
}
```

### 主要配置项

- **buildCommand**: 构建命令，使用 `npm run build`
- **outputDirectory**: 构建输出目录 `dist`
- **installCommand**: 依赖安装命令，使用 `npm ci` 确保一致性
- **framework**: 框架类型，设置为 `vite`
- **regions**: 部署区域，优先使用亚洲节点 (香港、新加坡、东京)

## 🔧 路由配置

### SPA 路由支持

项目使用 Vue Router 的 Hash 模式，配置了以下路由规则：

```json
{
  "rewrites": [
    {
      "source": "/((?!api/).*)",
      "destination": "/index.html"
    }
  ]
}
```

### 静态资源缓存

- **静态资源**: 1年缓存 (CSS, JS, 图片等)
- **HTML文件**: 不缓存，确保更新及时
- **Favicon**: 1天缓存

## 🛡️ 安全配置

项目配置了以下安全头：

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

## 🌍 环境变量

### 本地开发

1. 复制 `.env.example` 为 `.env.local`
2. 填入实际的环境变量值

### Vercel 环境变量

在 Vercel 控制台中设置以下环境变量：

- `VITE_API_BASE_URL`: API 基础地址
- `VITE_IMAGE_PROXY_URL`: 图片代理地址
- `NODE_ENV`: 环境类型 (production)

## 📊 构建优化

### 代码分割

项目配置了智能代码分割：

- Vue 核心库单独打包
- Element Plus UI 库单独打包
- 工具库单独打包
- 动画库单独打包

### 构建分析

```bash
# 启用构建分析
VITE_BUILD_ANALYZE=true npm run build
```

## 🔄 自动部署

### GitHub 集成

1. 在 Vercel 控制台连接 GitHub 仓库
2. 配置自动部署分支 (通常是 `main` 或 `master`)
3. 每次推送代码会自动触发部署

### 部署钩子

可以配置以下钩子：

- **构建前**: 运行测试、代码检查
- **构建后**: 发送通知、更新缓存
- **部署后**: 健康检查、性能监控

## 🐛 故障排除

### 常见问题

1. **构建失败**
   - 检查 Node.js 版本 (推荐 18+)
   - 确保所有依赖已正确安装
   - 检查环境变量配置

2. **路由 404**
   - 确认 `vercel.json` 中的重写规则
   - 检查 Vue Router 配置

3. **静态资源加载失败**
   - 检查 `base` 配置
   - 确认资源路径正确

### 调试命令

```bash
# 本地预览构建结果
npm run preview

# 检查构建产物
ls -la dist/

# 验证路由配置
vercel dev
```

## 📈 性能监控

### 推荐工具

- **Vercel Analytics**: 内置分析工具
- **Web Vitals**: 核心性能指标
- **Lighthouse**: 性能审计

### 性能优化建议

1. 启用 Gzip/Brotli 压缩
2. 使用 CDN 加速静态资源
3. 优化图片格式和大小
4. 实施懒加载策略

## 🔗 相关链接

- [Vercel 官方文档](https://vercel.com/docs)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html)
- [Vue Router 部署](https://router.vuejs.org/guide/essentials/history-mode.html)
