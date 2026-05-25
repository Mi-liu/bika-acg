<script setup lang="ts">
import { Check, Lightning, Refresh } from '@element-plus/icons-vue'
import { apiProxy, fileProxy } from '@/services/config'
import { createHeader } from '@/utils/crypto'

type ProxyStatus = 'idle' | 'testing' | 'success' | 'error' | 'timeout'

interface ProxyResult {
  status: ProxyStatus
  latency?: number
  message?: string
}

const TEST_TIMEOUT = 5000

const settingStore = useSettingStoreHook()

const visible = ref(false)
const apiResults = reactive<Record<string, ProxyResult>>({})
const fileResults = reactive<Record<string, ProxyResult>>({})

const apiTesting = computed(() => Object.values(apiResults).some(item => item.status === 'testing'))
const fileTesting = computed(() => Object.values(fileResults).some(item => item.status === 'testing'))

const currentApiProxy = computed(() => {
  return apiProxy.find(item => item.value === settingStore.comic.apiProxy)
})

const currentFileProxy = computed(() => {
  return fileProxy.find(item => item.value === settingStore.comic.fileProxy)
})

function getResult(results: Record<string, ProxyResult>, value: string) {
  return results[value] || { status: 'idle' as const }
}

function getStatusType(status: ProxyStatus) {
  const typeMap: Record<ProxyStatus, 'info' | 'primary' | 'success' | 'danger' | 'warning'> = {
    idle: 'info',
    testing: 'primary',
    success: 'success',
    error: 'danger',
    timeout: 'warning',
  }

  return typeMap[status]
}

function getStatusText(result: ProxyResult) {
  if (result.status === 'testing')
    return '测速中'

  if (result.latency !== undefined)
    return `${result.latency}ms`

  if (result.status === 'timeout')
    return '超时'

  if (result.status === 'error')
    return '失败'

  return '未测速'
}

function joinUrl(baseUrl: string, path = '') {
  return new URL(path, baseUrl).toString()
}

async function runWithTimeout(url: string, init: RequestInit) {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), TEST_TIMEOUT)
  const startedAt = performance.now()

  try {
    const response = await fetch(url, {
      ...init,
      signal: controller.signal,
    })
    const latency = Math.round(performance.now() - startedAt)
    return { response, latency }
  }
  finally {
    window.clearTimeout(timeout)
  }
}

async function testApi(proxyUrl: string) {
  const requestPath = 'categories'
  const { response, latency } = await runWithTimeout(joinUrl(proxyUrl, requestPath), {
    method: 'GET',
    cache: 'no-store',
    headers: createHeader(requestPath, 'GET', { auth: false }) as HeadersInit,
  })

  if (!response.ok) {
    return {
      latency,
      status: 'error' as const,
      message: `HTTP ${response.status}`,
    }
  }

  return {
    latency,
    status: 'success' as const,
  }
}

async function testFile(proxyUrl: string) {
  const { latency } = await runWithTimeout(joinUrl(proxyUrl, `?proxy_test=${Date.now()}`), {
    method: 'HEAD',
    mode: 'no-cors',
    cache: 'no-store',
  })

  return {
    latency,
    status: 'success' as const,
  }
}

async function testProxy(
  value: string,
  results: Record<string, ProxyResult>,
  tester: (value: string) => Promise<ProxyResult>,
) {
  results[value] = { status: 'testing' }

  try {
    results[value] = await tester(value)
  }
  catch (error) {
    results[value] = {
      status: error instanceof DOMException && error.name === 'AbortError' ? 'timeout' : 'error',
      message: error instanceof Error ? error.message : '测速失败',
    }
  }
}

async function testAllApiProxy() {
  await Promise.all(apiProxy.map(item => testProxy(item.value, apiResults, testApi)))
}

async function testAllFileProxy() {
  await Promise.all(fileProxy.map(item => testProxy(item.value, fileResults, testFile)))
}
</script>

<template>
  <el-popover
    v-model:visible="visible"
    placement="bottom-end"
    width="500"
    trigger="click"
    popper-class="proxy-switch-popover"
  >
    <template #reference>
      <el-button
        class="proxy-trigger h-full! outline-none!"
        text
        :icon="Lightning"
        aria-label="线路代理"
        title="线路代理"
      />
    </template>

    <div class="proxy-switch-panel">
      <div class="proxy-panel-header">
        <div class="proxy-panel-title">
          <el-icon>
            <Lightning />
          </el-icon>
          <span>线路代理</span>
        </div>
        <div class="proxy-panel-summary">
          <span>网络：{{ currentApiProxy?.label || '未选择' }}</span>
          <span>资源：{{ currentFileProxy?.label || '未选择' }}</span>
        </div>
      </div>

      <section class="proxy-section">
        <div class="proxy-section-header">
          <div>
            <div class="proxy-section-title">
              网络代理
            </div>
            <div class="proxy-section-subtitle">
              {{ currentApiProxy?.label || '请选择线路' }}
            </div>
          </div>
          <el-button
            size="small" type="primary" plain
            :icon="Refresh"
            :loading="apiTesting" @click="testAllApiProxy"
          >
            测速
          </el-button>
        </div>

        <div class="proxy-list">
          <button
            v-for="item in apiProxy"
            :key="item.value"
            class="proxy-option"
            :class="{ 'is-active': item.value === settingStore.comic.apiProxy }"
            :aria-pressed="item.value === settingStore.comic.apiProxy"
            type="button"
            @click="settingStore.comic.apiProxy = item.value"
          >
            <span class="proxy-option-check">
              <el-icon v-if="item.value === settingStore.comic.apiProxy">
                <Check />
              </el-icon>
            </span>
            <span class="proxy-option-main">
              <span class="proxy-option-label">{{ item.label }}</span>
              <span class="proxy-option-url">{{ item.value }}</span>
            </span>
            <el-tag
              size="small"
              :type="getStatusType(getResult(apiResults, item.value).status)"
              effect="light"
            >
              {{ getStatusText(getResult(apiResults, item.value)) }}
            </el-tag>
          </button>
        </div>
      </section>

      <el-divider class="proxy-divider" />

      <section class="proxy-section">
        <div class="proxy-section-header">
          <div>
            <div class="proxy-section-title">
              资源代理
            </div>
            <div class="proxy-section-subtitle">
              {{ currentFileProxy?.label || '请选择线路' }}
            </div>
          </div>
          <el-button
            size="small" type="primary" plain
            :icon="Refresh"
            :loading="fileTesting" @click="testAllFileProxy"
          >
            测速
          </el-button>
        </div>

        <div class="proxy-list">
          <button
            v-for="item in fileProxy"
            :key="item.value"
            class="proxy-option"
            :class="{ 'is-active': item.value === settingStore.comic.fileProxy }"
            :aria-pressed="item.value === settingStore.comic.fileProxy"
            type="button"
            @click="settingStore.comic.fileProxy = item.value"
          >
            <span class="proxy-option-check">
              <el-icon v-if="item.value === settingStore.comic.fileProxy">
                <Check />
              </el-icon>
            </span>
            <span class="proxy-option-main">
              <span class="proxy-option-label">{{ item.label }}</span>
              <span class="proxy-option-url">{{ item.value }}</span>
            </span>
            <el-tag
              size="small"
              :type="getStatusType(getResult(fileResults, item.value).status)"
              effect="light"
            >
              {{ getStatusText(getResult(fileResults, item.value)) }}
            </el-tag>
          </button>
        </div>
      </section>
    </div>
  </el-popover>
</template>

<style scoped lang="scss">
.proxy-trigger {
  width: 42px;
  min-width: 42px;
  padding: 0;
  color: var(--el-color-primary);
}

.proxy-trigger:hover,
.proxy-trigger:focus-visible {
  background: var(--el-color-primary-light-9);
}

.proxy-trigger :deep(.el-icon) {
  font-size: 22px;
}

.proxy-switch-panel {
  width: 100%;
}

.proxy-panel-header {
  padding: 2px 2px 12px;
  margin-bottom: 12px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.proxy-panel-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.4;
  color: var(--el-text-color-primary);
}

.proxy-panel-title .el-icon {
  color: var(--el-color-primary);
  font-size: 18px;
}

.proxy-panel-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}

.proxy-panel-summary span {
  max-width: 100%;
  padding: 3px 8px;
  overflow: hidden;
  font-size: 12px;
  line-height: 1.4;
  color: var(--el-text-color-secondary);
  text-overflow: ellipsis;
  white-space: nowrap;
  background: var(--el-fill-color-lighter);
  border-radius: 6px;
}

.proxy-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.proxy-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.proxy-section-title {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
  color: var(--el-text-color-primary);
}

.proxy-section-subtitle {
  margin-top: 2px;
  font-size: 12px;
  line-height: 1.4;
  color: var(--el-text-color-secondary);
}

.proxy-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.proxy-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  min-height: 58px;
  padding: 9px 10px;
  text-align: left;
  cursor: pointer;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  border-radius: 6px;
  transition:
    background-color 120ms ease,
    border-color 120ms ease,
    box-shadow 120ms ease;
}

.proxy-option:hover,
.proxy-option:focus-visible {
  border-color: var(--el-color-primary);
  box-shadow: 0 0 0 2px var(--el-color-primary-light-9);
}

.proxy-option.is-active {
  background: var(--el-color-primary-light-9);
  border-color: var(--el-color-primary);
}

.proxy-option.is-active .proxy-option-label {
  color: var(--el-color-primary);
  font-weight: 600;
}

.proxy-option-check {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  color: var(--el-color-primary);
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  border-radius: 50%;
}

.proxy-option.is-active .proxy-option-check {
  color: var(--el-color-white);
  background: var(--el-color-primary);
  border-color: var(--el-color-primary);
}

.proxy-option-main {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  gap: 2px;
}

.proxy-option-label {
  font-size: 13px;
  line-height: 1.4;
  color: var(--el-text-color-primary);
}

.proxy-option-url {
  overflow: hidden;
  font-size: 12px;
  line-height: 1.4;
  color: var(--el-text-color-secondary);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.proxy-divider {
  margin: 14px 0;
}
</style>
