#!/usr/bin/env node

/**
 * Vercel 构建脚本
 * 解决 Rollup 原生依赖问题
 */

import { execSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import process from 'node:process'

console.log('🚀 开始 Vercel 构建...')

try {
  // 检查是否存在 node_modules
  if (!existsSync('node_modules')) {
    console.log('📦 安装依赖...')
    execSync('npm install --legacy-peer-deps', { stdio: 'inherit' })
  }

  // 尝试重新安装 Rollup 相关依赖
  console.log('🔧 修复 Rollup 依赖...')
  try {
    execSync('npm install @rollup/rollup-linux-x64-gnu --save-dev --legacy-peer-deps', { stdio: 'inherit' })
  } catch (error) {
    console.log('⚠️  无法安装特定平台的 Rollup，继续使用默认版本')
  }

  // 执行构建
  console.log('🏗️  开始构建...')
  execSync('npm run build-only', { stdio: 'inherit' })
  
  console.log('✅ 构建完成！')
  
} catch (error) {
  console.error('❌ 构建失败:', error.message)
  
  // 尝试备用构建方案
  console.log('🔄 尝试备用构建方案...')
  try {
    // 清理并重新安装
    execSync('rm -rf node_modules package-lock.json', { stdio: 'inherit' })
    execSync('npm install --legacy-peer-deps', { stdio: 'inherit' })
    execSync('npm run build-only', { stdio: 'inherit' })
    console.log('✅ 备用构建成功！')
  } catch (fallbackError) {
    console.error('❌ 备用构建也失败了:', fallbackError.message)
    process.exit(1)
  }
}
