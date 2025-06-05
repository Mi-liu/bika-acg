# 代码格式化配置说明

本项目使用 `@antfu/eslint-config` 作为主要的代码格式化和代码质量检查工具。

## 配置概述

### 主要工具
- **ESLint + @antfu/eslint-config**: 主要的代码格式化和质量检查工具
- **Prettier**: 仅用于 Markdown、YAML 等 ESLint 不处理的文件类型
- **EditorConfig**: 基础的编辑器配置

### VSCode 配置

项目已配置 VSCode 设置，保存时会自动使用 ESLint 进行格式化：

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "editor.formatOnSave": false,
  "editor.defaultFormatter": "dbaeumer.vscode-eslint"
}
```

## 使用方法

### 自动格式化（推荐）
在 VSCode 中保存文件时会自动格式化。

### 手动格式化
```bash
# 格式化所有支持的文件
npm run format

# 仅运行 ESLint 检查和修复
npm run lint:eslint

# 格式化 Markdown 和 YAML 文件
npm run format:prettier
```

## 支持的文件类型

### ESLint 处理的文件类型
- JavaScript (.js, .mjs, .cjs)
- TypeScript (.ts, .mts, .cts)
- Vue (.vue)
- JSON (.json, .jsonc)

### Prettier 处理的文件类型
- Markdown (.md, .markdown)
- YAML (.yml, .yaml)

## 常见问题

### Q: 保存时没有自动格式化？
A: 请确保：
1. 安装了 ESLint 扩展 (`dbaeumer.vscode-eslint`)
2. 重启 VSCode
3. 检查文件类型是否在支持列表中

### Q: 格式化规则冲突？
A: 本项目已配置为优先使用 ESLint 的格式化规则，Prettier 仅用于 ESLint 不支持的文件类型。

### Q: 如何自定义格式化规则？
A: 修改 `eslint.config.ts` 文件中的 rules 配置。

## 扩展推荐

确保安装以下 VSCode 扩展：
- ESLint (`dbaeumer.vscode-eslint`)
- Vue Language Features (`Vue.volar`)
- EditorConfig for VS Code (`EditorConfig.EditorConfig`)
