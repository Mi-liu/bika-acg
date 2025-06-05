#!/usr/bin/env node

/**
 * 检查并切换到 .nvmrc 文件中指定的 Node.js 版本
 * 如果没有安装该版本，则安装它
 */

import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

// 读取 .nvmrc 文件
const nvmrcPath = path.join(rootDir, '.nvmrc')

if (!fs.existsSync(nvmrcPath)) {
  console.error('未找到 .nvmrc 文件')
  process.exit(1)
}

// 获取 .nvmrc 中指定的 Node.js 版本
const requiredNodeVersion = fs.readFileSync(nvmrcPath, 'utf8').trim()

if (!requiredNodeVersion) {
  console.error('.nvmrc 文件为空或无效')
  process.exit(1)
}

console.log(`需要的 Node.js 版本: ${requiredNodeVersion}`)

// 检查是否已安装指定版本的 Node.js
function isVersionInstalled(version) {
  try {
    // 尝试直接使用 nvm 切换到该版本，如果成功则说明已安装
    execSync(`nvm use ${version} > nul 2>&1`, { shell: true })
    return true
  }
  catch {
    // 如果切换失败，则说明未安装
    return false
  }
}

// 检查当前是否使用指定版本的 Node.js
function isUsingVersion(version) {
  try {
    const currentVersion = execSync('node -v', { shell: true }).toString().trim().replace('v', '')
    return currentVersion === version
  }
  catch (error) {
    console.error('检查当前 Node.js 版本失败:', error.message)
    return false
  }
}

// 检查是否已安装指定版本
const isInstalled = isVersionInstalled(requiredNodeVersion)
console.log(`Node.js v${requiredNodeVersion} 是否已安装: ${isInstalled ? '是' : '否'}`)

// 检查是否正在使用指定版本
const isUsing = isUsingVersion(requiredNodeVersion)
console.log(`当前是否使用 Node.js v${requiredNodeVersion}: ${isUsing ? '是' : '否'}`)

// 如果已安装但未使用，则切换版本
if (isInstalled && !isUsing) {
  console.log(`切换到 Node.js v${requiredNodeVersion}`)
  try {
    execSync(`nvm use ${requiredNodeVersion}`, { stdio: 'inherit', shell: true })
  }
  catch (error) {
    console.error('切换 Node.js 版本失败:', error.message)
    process.exit(1)
  }
}
// 如果未安装，则安装并切换
else if (!isInstalled) {
  console.log(`安装 Node.js v${requiredNodeVersion}`)
  try {
    execSync(`nvm install ${requiredNodeVersion}`, { stdio: 'inherit', shell: true })
    execSync(`nvm use ${requiredNodeVersion}`, { stdio: 'inherit', shell: true })
  }
  catch (error) {
    console.error('安装或切换 Node.js 版本失败:', error.message)
    process.exit(1)
  }
}

// 不再在这里启动项目，而是返回成功状态
console.log('Node.js 版本检查完成，正在启动项目')
// 返回成功状态码
process.exit(0)
