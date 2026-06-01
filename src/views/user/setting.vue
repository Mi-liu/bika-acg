<script setup lang="ts">
import type { UploadFile } from 'element-plus'
import {
  Connection,
  DataBoard,
  Delete,
  Download,
  Filter,
  InfoFilled,
  Monitor,
  Moon,
  QuestionFilled,
  Reading,
  Sunny,
  SwitchButton,
  Timer,
  Upload,
  UserFilled,
} from '@element-plus/icons-vue'
import { pictureQuality } from '@/constants/options'
import { apiProxy, fileProxy } from '@/services/config'
import { useLocalStoreHook } from '@/store/modules/local'
import { useSettingStoreHook } from '@/store/modules/setting'

const settingStore = useSettingStoreHook()
const localStore = useLocalStoreHook()

const appName = import.meta.env.VITE_APP_NAME
const appVersion = import.meta.env.VITE_APP_VERSION

const importDialogVisible = ref(false)
const importFile = ref<File | null>(null)

const themeOptions = [
  {
    value: 'system',
    label: '跟随系统',
    icon: Monitor,
  },
  {
    value: 'light',
    label: '浅色模式',
    icon: Sunny,
  },
  {
    value: 'dark',
    label: '深色模式',
    icon: Moon,
  },
]

const currentImageQuality = computed(() => {
  return pictureQuality.find(item => item.value === settingStore.comic.imageQuality)?.label || '未选择'
})

const currentApiProxy = computed(() => {
  return apiProxy.find(item => item.value === settingStore.comic.apiProxy)?.label || '未选择'
})

const currentFileProxy = computed(() => {
  return fileProxy.find(item => item.value === settingStore.comic.fileProxy)?.label || '未选择'
})

const currentTheme = computed(() => {
  return themeOptions.find(item => item.value === settingStore.appearance.themeMode)?.label || '跟随系统'
})

const localStats = computed(() => [
  {
    label: '稍后观看',
    value: localStore.local.WATCH_LATER_LIST.length,
    unit: '部',
  },
  {
    label: '关注作者',
    value: localStore.local.FOLLOW_AUTHOR_LIST.length,
    unit: '位',
  },
  {
    label: '分类缓存',
    value: localStore.local.CATEGORIES.length,
    unit: '个',
  },
])

async function handleCloseTag(tag: string) {
  await ElMessageBox.confirm(`是否取消过滤分类：${tag}`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
  settingStore.filter.categories = settingStore.filter.categories.filter(item => item !== tag)
  ElMessage.success('分类已取消过滤')
}

function handleExportData() {
  try {
    const exportData = {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      appearance: settingStore.appearance,
      settings: settingStore.comic,
      localData: localStore.local,
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    })

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bika-settings-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)

    ElMessage.success('数据导出成功')
  }
  catch (error) {
    console.error('导出数据失败:', error)
    ElMessage.error('导出数据失败')
  }
}

function handleImportData() {
  importDialogVisible.value = true
}

function handleFileChange(file: UploadFile) {
  importFile.value = file.raw || null
}

function confirmImportData() {
  if (!importFile.value) {
    ElMessage.warning('请选择要导入的文件')
    return
  }

  const reader = new FileReader()
  reader.onload = (event) => {
    try {
      const data = JSON.parse(event.target?.result as string)

      if (!data.settings || !data.localData) {
        throw new Error('数据格式不正确')
      }

      Object.assign(settingStore.comic, data.settings)
      if (data.appearance) {
        Object.assign(settingStore.appearance, data.appearance)
      }
      Object.assign(localStore.local, data.localData)

      ElMessage.success('数据导入成功')
      importDialogVisible.value = false
      importFile.value = null
    }
    catch (error) {
      console.error('导入数据失败:', error)
      ElMessage.error('导入数据失败，请检查文件格式')
    }
  }
  reader.readAsText(importFile.value)
}

function handleClearData() {
  ElMessageBox.confirm(
    '此操作将清空所有本地数据（稍后观看、关注作者等），是否继续？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    },
  ).then(() => {
    localStore.local.WATCH_LATER_LIST = []
    localStore.local.FOLLOW_AUTHOR_LIST = []
    localStore.local.CATEGORIES = []
    localStore.local.ACCOUNT_INFO = { email: '', password: '' }

    ElMessage.success('数据清空成功')
  }).catch(() => {
    ElMessage.info('已取消清空操作')
  })
}

function handleCloseAuthor(author: string) {
  settingStore.filter.authors = settingStore.filter.authors.filter(item => item !== author)
  ElMessage.success('作者已取消过滤')
}
</script>

<template>
  <el-scrollbar class="settings-scrollbar">
    <main class="settings-page">
      <header class="settings-hero">
        <div class="hero-copy">
          <p>快速调整漫画阅读体验、代理线路、过滤规则，并管理本地备份数据。</p>
        </div>

        <div class="hero-status-grid" aria-label="当前设置概览">
          <div class="hero-status-card">
            <span>画质</span>
            <strong>{{ currentImageQuality }}</strong>
          </div>
          <div class="hero-status-card">
            <span>阅读宽度</span>
            <strong>{{ settingStore.comic.comicImageWidth }}px</strong>
          </div>
          <div class="hero-status-card">
            <span>主题</span>
            <strong>{{ currentTheme }}</strong>
          </div>
          <div class="hero-status-card">
            <span>隐私模式</span>
            <strong>{{ settingStore.comic.privacyMode ? '开启' : '关闭' }}</strong>
          </div>
        </div>
      </header>

      <div class="settings-layout">
        <div class="settings-main">
          <section class="settings-panel" aria-labelledby="appearance-settings-title">
            <div class="panel-header">
              <div class="panel-title">
                <span class="panel-icon">
                  <el-icon><Monitor /></el-icon>
                </span>
                <div>
                  <h2 id="appearance-settings-title">
                    外观主题
                  </h2>
                  <p>默认跟随当前设备，也可以固定为浅色或深色模式。</p>
                </div>
              </div>
            </div>

            <div class="setting-list">
              <div class="setting-row">
                <div class="setting-copy">
                  <span class="setting-label">主题模式</span>
                  <span class="setting-help">影响页面、弹窗、表单和浏览器原生控件配色。</span>
                </div>
                <el-radio-group
                  v-model="settingStore.appearance.themeMode"
                  class="theme-mode-group"
                  aria-label="主题模式"
                >
                  <el-radio-button
                    v-for="option in themeOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    <span class="theme-mode-option">
                      <el-icon><component :is="option.icon" /></el-icon>
                      {{ option.label }}
                    </span>
                  </el-radio-button>
                </el-radio-group>
              </div>
            </div>
          </section>

          <section class="settings-panel" aria-labelledby="reading-settings-title">
            <div class="panel-header">
              <div class="panel-title">
                <span class="panel-icon">
                  <el-icon><Reading /></el-icon>
                </span>
                <div>
                  <h2 id="reading-settings-title">
                    漫画阅读
                  </h2>
                  <p>控制画质、图片宽度、自动阅读和隐私遮挡。</p>
                </div>
              </div>
            </div>

            <div class="setting-list">
              <div class="setting-row">
                <div class="setting-copy">
                  <span class="setting-label">图片质量</span>
                  <span class="setting-help">影响加载速度和图片清晰度。</span>
                </div>
                <el-select v-model="settingStore.comic.imageQuality" class="setting-control">
                  <el-option
                    v-for="option in pictureQuality"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                  />
                </el-select>
              </div>

              <div class="setting-row setting-row-stacked">
                <div class="setting-copy">
                  <span class="setting-label">漫画图片宽度</span>
                  <span class="setting-help">当前宽度 {{ settingStore.comic.comicImageWidth }}px。</span>
                </div>
                <el-slider
                  v-model="settingStore.comic.comicImageWidth"
                  class="setting-slider"
                  :min="400"
                  :max="1200"
                  :step="50"
                  show-input
                />
              </div>

              <div class="setting-row">
                <div class="setting-copy">
                  <span class="setting-label">自动阅读</span>
                  <span class="setting-help">开启后阅读页会按固定速度自动滚动。</span>
                </div>
                <el-switch v-model="settingStore.comic.autoRead" />
              </div>

              <div v-if="settingStore.comic.autoRead" class="setting-row setting-row-stacked">
                <div class="setting-copy">
                  <span class="setting-label">自动阅读速度</span>
                  <span class="setting-help">当前速度 {{ settingStore.comic.autoReadSpeed }} 像素/秒。</span>
                </div>
                <el-slider
                  v-model="settingStore.comic.autoReadSpeed"
                  class="setting-slider"
                  :min="1"
                  :max="100"
                  show-input
                />
              </div>

              <div class="setting-row">
                <div class="setting-copy">
                  <span class="setting-label">
                    隐私模式
                    <el-tooltip placement="top" content="隐私模式下，漫画图片会显示为灰色，不直接展示图片内容。">
                      <el-icon class="help-icon">
                        <QuestionFilled />
                      </el-icon>
                    </el-tooltip>
                  </span>
                  <span class="setting-help">适合公共环境或临时隐藏图片内容。</span>
                </div>
                <el-switch v-model="settingStore.comic.privacyMode" />
              </div>
            </div>
          </section>

          <section class="settings-panel" aria-labelledby="network-settings-title">
            <div class="panel-header">
              <div class="panel-title">
                <span class="panel-icon panel-icon-network">
                  <el-icon><Connection /></el-icon>
                </span>
                <div>
                  <h2 id="network-settings-title">
                    网络线路
                  </h2>
                  <p>分别选择 API 请求和图片资源的代理线路。</p>
                </div>
              </div>
            </div>

            <div class="setting-list">
              <div class="setting-row setting-row-stacked">
                <div class="setting-copy">
                  <span class="setting-label">API 代理线路</span>
                  <span class="setting-help">{{ currentApiProxy }}</span>
                </div>
                <el-select v-model="settingStore.comic.apiProxy" class="setting-control setting-control-wide">
                  <el-option
                    v-for="option in apiProxy"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                  />
                </el-select>
              </div>

              <div class="setting-row setting-row-stacked">
                <div class="setting-copy">
                  <span class="setting-label">文件代理线路</span>
                  <span class="setting-help">{{ currentFileProxy }}</span>
                </div>
                <el-select v-model="settingStore.comic.fileProxy" class="setting-control setting-control-wide">
                  <el-option
                    v-for="option in fileProxy"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                  />
                </el-select>
              </div>
            </div>
          </section>

          <section class="settings-panel" aria-labelledby="filter-settings-title">
            <div class="panel-header">
              <div class="panel-title">
                <span class="panel-icon panel-icon-filter">
                  <el-icon><Filter /></el-icon>
                </span>
                <div>
                  <h2 id="filter-settings-title">
                    漫画过滤
                  </h2>
                  <p>管理首页分类显示和已屏蔽的分类、作者。</p>
                </div>
              </div>
            </div>

            <div class="setting-list">
              <div class="setting-row">
                <div class="setting-copy">
                  <span class="setting-label">
                    R18 分类
                    <el-tooltip placement="top" content="关闭时首页分类仅显示非成人目录，开启后显示全部分类。">
                      <el-icon class="help-icon">
                        <QuestionFilled />
                      </el-icon>
                    </el-tooltip>
                  </span>
                  <span class="setting-help">控制首页分类入口的显示范围。</span>
                </div>
                <el-switch
                  v-model="settingStore.comic.showR18Categories"
                  active-text="开"
                  inactive-text="关"
                />
              </div>

              <div class="tag-group">
                <div class="tag-group-header">
                  <span>过滤分类</span>
                  <em>{{ settingStore.filter.categories.length }} 个</em>
                </div>
                <div v-if="settingStore.filter.categories.length" class="tag-cloud">
                  <el-tag
                    v-for="category in settingStore.filter.categories"
                    :key="category"
                    closable
                    effect="plain"
                    @close="handleCloseTag(category)"
                  >
                    {{ category }}
                  </el-tag>
                </div>
                <el-empty v-else :image-size="72" description="暂无过滤分类" />
              </div>

              <div class="tag-group">
                <div class="tag-group-header">
                  <span>过滤作者</span>
                  <em>{{ settingStore.filter.authors.length }} 位</em>
                </div>
                <div v-if="settingStore.filter.authors.length" class="tag-cloud">
                  <el-tag
                    v-for="author in settingStore.filter.authors"
                    :key="author"
                    type="info"
                    closable
                    effect="plain"
                    @close="handleCloseAuthor(author)"
                  >
                    {{ author }}
                  </el-tag>
                </div>
                <el-empty v-else :image-size="72" description="暂无过滤作者" />
              </div>
            </div>
          </section>
        </div>

        <aside class="settings-aside">
          <section class="settings-panel compact-panel" aria-labelledby="data-settings-title">
            <div class="panel-header">
              <div class="panel-title">
                <span class="panel-icon panel-icon-data">
                  <el-icon><DataBoard /></el-icon>
                </span>
                <div>
                  <h2 id="data-settings-title">
                    数据管理
                  </h2>
                  <p>查看本地数据，并进行备份或清理。</p>
                </div>
              </div>
            </div>

            <div class="stat-list">
              <div v-for="item in localStats" :key="item.label" class="stat-item">
                <span>{{ item.label }}</span>
                <strong>{{ item.value }}<em>{{ item.unit }}</em></strong>
              </div>
            </div>

            <div class="action-stack" aria-label="数据操作">
              <el-button type="primary" plain @click="handleExportData">
                <el-icon><Download /></el-icon>
                导出数据
              </el-button>
              <el-button type="success" plain @click="handleImportData">
                <el-icon><Upload /></el-icon>
                导入数据
              </el-button>
              <el-button type="danger" plain @click="handleClearData">
                <el-icon><Delete /></el-icon>
                清空数据
              </el-button>
            </div>
          </section>

          <section class="settings-panel compact-panel" aria-labelledby="app-info-title">
            <div class="panel-header">
              <div class="panel-title">
                <span class="panel-icon panel-icon-info">
                  <el-icon><InfoFilled /></el-icon>
                </span>
                <div>
                  <h2 id="app-info-title">
                    关于应用
                  </h2>
                  <p>当前运行版本信息。</p>
                </div>
              </div>
            </div>

            <dl class="info-list">
              <div>
                <dt>
                  <el-icon><UserFilled /></el-icon>
                  应用名称
                </dt>
                <dd>{{ appName }}</dd>
              </div>
              <div>
                <dt>
                  <el-icon><SwitchButton /></el-icon>
                  版本信息
                </dt>
                <dd>{{ appVersion }}</dd>
              </div>
              <div>
                <dt>
                  <el-icon><Timer /></el-icon>
                  自动阅读
                </dt>
                <dd>{{ settingStore.comic.autoRead ? '已开启' : '未开启' }}</dd>
              </div>
            </dl>
          </section>
        </aside>
      </div>
    </main>

    <el-dialog
      v-model="importDialogVisible" title="导入数据" width="500px"
      class="settings-import-dialog"
    >
      <div class="import-panel">
        <el-upload
          drag
          :auto-upload="false"
          :show-file-list="false"
          accept=".json"
          @change="handleFileChange"
        >
          <el-icon class="upload-icon">
            <Upload />
          </el-icon>
          <div class="el-upload__text">
            将 JSON 文件拖到此处，或 <em>点击选择</em>
          </div>
        </el-upload>
        <div v-if="importFile" class="selected-file">
          已选择：{{ importFile.name }}
        </div>
      </div>
      <template #footer>
        <el-button @click="importDialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" :disabled="!importFile" @click="confirmImportData">
          确认导入
        </el-button>
      </template>
    </el-dialog>
  </el-scrollbar>
</template>

<style scoped lang="scss">
.settings-scrollbar {
  height: 100%;
  background:
    radial-gradient(circle at 8% 0%, var(--el-color-primary-light-8), transparent 32%),
    linear-gradient(135deg, var(--el-fill-color-extra-light) 0%, var(--el-bg-color-page) 100%);
}

.settings-page {
  width: min(1180px, calc(100% - 32px));
  min-height: 100%;
  padding: 24px 0 40px;
  margin: 0 auto;
}

.settings-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(320px, 420px);
  gap: 24px;
  align-items: stretch;
  padding: 28px;
  margin-bottom: 24px;
  overflow: hidden;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  border-radius: 8px;
  box-shadow: var(--el-box-shadow-light);
}

.hero-copy {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;

  h1 {
    max-width: 640px;
    margin: 12px 0 10px;
    font-size: 30px;
    font-weight: 750;
    line-height: 1.25;
    color: var(--el-text-color-primary);
    letter-spacing: 0;
  }

  p {
    max-width: 620px;
    margin: 0;
    font-size: 14px;
    line-height: 1.8;
    color: var(--el-text-color-secondary);
  }
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  gap: 8px;
  padding: 6px 10px;
  font-size: 13px;
  font-weight: 700;
  color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
  border: 1px solid var(--el-color-primary-light-7);
  border-radius: 6px;
}

.hero-status-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  align-self: center;
}

.hero-status-card {
  min-width: 0;
  padding: 14px;
  background: var(--el-fill-color-extra-light);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;

  span,
  strong {
    display: block;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  span {
    margin-bottom: 8px;
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }

  strong {
    font-size: 18px;
    font-weight: 750;
    line-height: 1.2;
    color: var(--el-text-color-primary);
  }
}

.settings-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 330px;
  gap: 24px;
  align-items: start;
}

.settings-main,
.settings-aside {
  display: flex;
  flex-direction: column;
  gap: 18px;
  min-width: 0;
}

.settings-aside {
  position: sticky;
  top: 16px;
}

.settings-panel {
  min-width: 0;
  padding: 22px;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  border-radius: 8px;
  box-shadow: var(--el-box-shadow-lighter);
}

.compact-panel {
  padding: 20px;
}

.panel-header {
  padding-bottom: 16px;
  margin-bottom: 4px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.panel-title {
  display: flex;
  gap: 12px;
  align-items: flex-start;

  h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 750;
    line-height: 1.35;
    color: var(--el-text-color-primary);
    letter-spacing: 0;
  }

  p {
    margin: 4px 0 0;
    font-size: 13px;
    line-height: 1.6;
    color: var(--el-text-color-secondary);
  }
}

.panel-icon {
  display: inline-flex;
  flex: 0 0 38px;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  font-size: 20px;
  color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
  border: 1px solid var(--el-color-primary-light-7);
  border-radius: 8px;
}

.panel-icon-network {
  color: var(--el-color-success);
  background: var(--el-color-success-light-9);
  border-color: var(--el-color-success-light-7);
}

.panel-icon-filter {
  color: var(--el-color-warning);
  background: var(--el-color-warning-light-9);
  border-color: var(--el-color-warning-light-7);
}

.panel-icon-data {
  color: var(--el-color-danger);
  background: var(--el-color-danger-light-9);
  border-color: var(--el-color-danger-light-7);
}

.panel-icon-info {
  color: var(--el-color-info);
  background: var(--el-fill-color-lighter);
  border-color: var(--el-border-color-light);
}

.setting-list {
  display: flex;
  flex-direction: column;
}

.setting-row {
  display: flex;
  gap: 20px;
  align-items: center;
  justify-content: space-between;
  min-height: 72px;
  padding: 16px 0;
  border-bottom: 1px solid var(--el-border-color-lighter);

  &:last-child {
    border-bottom: 0;
  }
}

.setting-row-stacked {
  display: grid;
  grid-template-columns: minmax(190px, 260px) minmax(0, 1fr);
  align-items: center;
}

.setting-copy {
  min-width: 0;
}

.setting-label {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 5px;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.4;
  color: var(--el-text-color-primary);
}

.setting-help {
  display: block;
  max-width: 100%;
  overflow: hidden;
  font-size: 13px;
  line-height: 1.5;
  color: var(--el-text-color-secondary);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.help-icon {
  color: var(--el-color-info);
  cursor: help;
}

.setting-control {
  width: 220px;
}

.theme-mode-group {
  flex: 0 0 auto;

  :deep(.el-radio-button__inner) {
    min-height: 40px;
  }
}

.theme-mode-option {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.setting-control-wide,
.setting-slider {
  width: 100%;
}

.tag-group {
  padding: 16px 0;
  border-bottom: 1px solid var(--el-border-color-lighter);

  &:last-child {
    border-bottom: 0;
  }
}

.tag-group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;

  span {
    font-size: 15px;
    font-weight: 700;
    color: var(--el-text-color-primary);
  }

  em {
    font-size: 12px;
    font-style: normal;
    color: var(--el-text-color-secondary);
  }
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.stat-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  margin: 18px 0;
}

.stat-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px;
  background: var(--el-fill-color-extra-light);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;

  span {
    font-size: 13px;
    color: var(--el-text-color-secondary);
  }

  strong {
    font-size: 22px;
    font-weight: 750;
    line-height: 1;
    color: var(--el-text-color-primary);
  }

  em {
    margin-left: 2px;
    font-size: 12px;
    font-style: normal;
    color: var(--el-text-color-secondary);
  }
}

.action-stack {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;

  :deep(.el-button) {
    justify-content: flex-start;
    width: 100%;
    margin-left: 0;
  }
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 18px 0 0;

  div {
    min-width: 0;
  }

  dt {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 4px;
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }

  dd {
    min-width: 0;
    margin: 0;
    overflow: hidden;
    font-size: 14px;
    font-weight: 650;
    color: var(--el-text-color-primary);
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.import-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.upload-icon {
  margin-bottom: 8px;
  font-size: 36px;
  color: var(--el-color-primary);
}

.selected-file {
  padding: 10px 12px;
  font-size: 13px;
  color: var(--el-text-color-regular);
  background: var(--el-fill-color-extra-light);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
}

:deep(.el-empty) {
  padding: 18px 0;
}

:deep(.el-slider__runway.show-input) {
  margin-right: 132px;
}

@media (max-width: 1080px) {
  .settings-layout,
  .settings-hero {
    grid-template-columns: 1fr;
  }

  .settings-aside {
    position: static;
  }
}

@media (max-width: 720px) {
  .settings-page {
    width: min(100% - 20px, 1180px);
    padding: 12px 0 28px;
  }

  .settings-hero,
  .settings-panel {
    padding: 18px;
  }

  .hero-copy h1 {
    font-size: 24px;
  }

  .hero-status-grid {
    grid-template-columns: 1fr;
  }

  .setting-row,
  .setting-row-stacked {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .setting-control {
    width: 100%;
  }

  .setting-help {
    white-space: normal;
  }
}
</style>
