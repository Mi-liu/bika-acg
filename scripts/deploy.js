#!/usr/bin/env node

/**
 * Vercel 部署脚本
 * 
 * 用法:
 * npm run deploy:preview  # 部署预览版本
 * npm run deploy:prod     # 部署生产版本
 */

import { execSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import process from 'node:process'

const args = process.argv.slice(2)
const isProduction = args.includes('--prod') || args.includes('--production')

console.log(`🚀 开始部署到 Vercel ${isProduction ? '(生产环境)' : '(预览环境)'}...`)

// 检查是否安装了 Vercel CLI
try {
  execSync('vercel --version', { stdio: 'ignore' })
} catch (error) {
  console.error('❌ 未找到 Vercel CLI，请先安装:')
  console.error('npm i -g vercel')
  process.exit(1)
}

// 检查是否存在构建产物
if (!existsSync('dist')) {
  console.log('📦 构建产物不存在，开始构建...')
  try {
    execSync('npm run build', { stdio: 'inherit' })
    console.log('✅ 构建完成')
  } catch (error) {
    console.error('❌ 构建失败')
    process.exit(1)
  }
}

// 部署到 Vercel
try {
  const deployCommand = isProduction 
    ? 'vercel --prod' 
    : 'vercel'
  
  console.log(`🚀 执行部署命令: ${deployCommand}`)
  execSync(deployCommand, { stdio: 'inherit' })
  
  console.log(`✅ 部署成功！`)
  
  if (!isProduction) {
    console.log('🔗 预览链接已生成，请查看上方输出')
  } else {
    console.log('🌐 生产环境已更新')
  }
  
} catch (error) {
  console.error('❌ 部署失败')
  process.exit(1)
}
