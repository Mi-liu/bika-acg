#!/usr/bin/env node

/**
 * 创建新分支并同步到两个远程仓库的脚本
 * 使用方法: node scripts/create-and-push-branch.js <branch-name>
 */

import { execSync } from 'node:child_process'
import process, { exit } from 'node:process'

const branchName = process.argv[2]

if (!branchName) {
  console.error('❌ 请提供分支名称')
  console.log('使用方法: node scripts/create-and-push-branch.js <branch-name>')
  exit(1)
}

try {
  console.log(`🚀 开始创建并推送分支: ${branchName}`)

  // 1. 创建新分支
  console.log('📝 创建新分支...')
  execSync(`git checkout -b ${branchName}`, { stdio: 'inherit' })

  // 2. 推送到两个远程仓库
  console.log('📤 推送到远程仓库...')
  execSync(`git push origin ${branchName}`, { stdio: 'inherit' })

  console.log('✅ 分支创建并推送成功！')
  console.log(`📋 分支 ${branchName} 已同步到:`)
  console.log('   - Gitee: https://gitee.com/yetuzi/pic-age.git')
  console.log('   - GitHub: https://github.com/Mi-liu/bika-acg.git')
}
catch (error) {
  console.error('❌ 操作失败:', error.message)
  exit(1)
}
