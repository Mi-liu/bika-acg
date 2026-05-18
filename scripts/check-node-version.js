import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'

const expectedVersion = readFileSync(resolve('.node-version'), 'utf8').trim()
const currentVersion = process.versions.node

if (currentVersion !== expectedVersion) {
  console.error(`Node version mismatch: expected ${expectedVersion}, got ${currentVersion}`)
  process.exit(1)
}

console.log(`Node version OK: ${currentVersion}`)
