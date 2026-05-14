<script setup lang="ts">
import {
  Connection,
  DataBoard,
  Delete,
  Download,
  Filter,
  InfoFilled,
  QuestionFilled,
  Reading,
  Upload,
} from '@element-plus/icons-vue'
import { pictureQuality } from '@/constants/options'
import { proxy } from '@/services/config'
import { useLocalStoreHook } from '@/store/modules/local'
import { useSettingStoreHook } from '@/store/modules/setting'

/**
 * 设置页面
 */

// Store 实例
const settingStore = useSettingStoreHook()
const localStore = useLocalStoreHook()

const labelWidth = '120px'
const lebelPosition = 'left'

const appName = import.meta.env.VITE_APP_NAME
const appVersion = import.meta.env.VITE_APP_VERSION

async function handleCloseTag(tag: string) {
  await ElMessageBox.alert(`是否取消过滤分类：${tag}`, '提示', {
    showCancelButton: true,
  })
  settingStore.filter.categories = settingStore.filter.categories.filter(item => item !== tag)
  ElMessage.success('分类已取消过滤')
}

// 导入对话框
const importDialogVisible = ref(false)
const importFile = ref<File | null>(null)

/**
 * 导出数据
 */
function handleExportData() {
  try {
    const exportData = {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
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

/**
 * 导入数据
 */
function handleImportData() {
  importDialogVisible.value = true
}

/**
 * 处理文件选择
 */
function handleFileChange(file: any) {
  importFile.value = file.raw
}

/**
 * 确认导入数据
 */
function confirmImportData() {
  if (!importFile.value) {
    ElMessage.warning('请选择要导入的文件')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target?.result as string)

      // 验证数据格式
      if (!data.settings || !data.localData) {
        throw new Error('数据格式不正确')
      }

      // 导入设置数据
      Object.assign(settingStore.comic, data.settings)

      // 导入本地数据
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

/**
 * 清空数据
 */
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
    // 清空本地数据
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
  <el-scrollbar class="bg-[--el-bg-color-page]">
    <div class="w-full max-w-[1000px] mx-auto">
      <el-card>
        <!-- <template #header>
          <div>
            <el-icon>
              <Setting />
            </el-icon>
            <span>应用设置</span>
          </div>
        </template> -->

        <!-- 漫画阅读设置 -->
        <div>
          <div class="flex items-center gap-2 text-18px font-bold line-height-1 py-10px my-14px border-b-3px border-[--el-color-primary] border-b-solid">
            <el-icon>
              <Reading />
            </el-icon>
            漫画阅读设置
          </div>

          <el-form :label-width="labelWidth" :label-position="lebelPosition">
            <el-form-item label="图片质量">
              <el-select v-model="settingStore.comic.imageQuality">
                <el-option
                  v-for="option in pictureQuality"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="漫画图片宽度">
              <el-slider
                v-model="settingStore.comic.comicImageWidth"
                class="ml-10px"
                :min="400"
                :max="1200"
                :step="50"
              />
            </el-form-item>
            <el-form-item label="自动阅读">
              <el-switch v-model="settingStore.comic.autoRead" />
            </el-form-item>
            <el-form-item v-if="settingStore.comic.autoRead" label="自动阅读速度">
              <el-slider v-model="settingStore.comic.autoReadSpeed" />
            </el-form-item>
            <el-form-item label="隐私模式">
              <template #label="{ label }">
                <div class="size-full flex items-center gap-1">
                  {{ label }}
                  <el-tooltip placement="top" content="隐私模式下，漫画图片会显示为灰色，不会显示图片内容">
                    <el-icon class="cursor-pointer">
                      <QuestionFilled />
                    </el-icon>
                  </el-tooltip>
                </div>
              </template>
              <el-switch v-model="settingStore.comic.privacyMode" />
            </el-form-item>
          </el-form>
        </div>

        <!-- 网络设置 -->
        <div>
          <div class="flex items-center gap-2 text-18px font-bold line-height-1 py-10px my-14px border-b-3px border-[--el-color-primary] border-b-solid">
            <el-icon>
              <Connection />
            </el-icon>
            网络设置
          </div>

          <el-form :label-width="labelWidth" :label-position="lebelPosition">
            <el-form-item label="代理线路">
              <el-select v-model="settingStore.comic.proxy" value-key="api">
                <el-option
                  v-for="(option, index) in proxy"
                  :key="index"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </div>

        <!-- 漫画过滤设置 -->
        <div>
          <div class="flex items-center gap-2 text-18px font-bold line-height-1 py-10px my-14px border-b-3px border-[--el-color-primary] border-b-solid">
            <el-icon>
              <Filter />
            </el-icon>
            漫画过滤设置
          </div>

          <el-form :label-width="labelWidth" :label-position="lebelPosition">
            <el-form-item label="过滤分类">
              <div class="w-full flex flex-wrap gap-2">
                <el-tag
                  v-for="category in settingStore.filter.categories"
                  :key="category" type="info" closable
                  @close="handleCloseTag(category)"
                >
                  {{ category }}
                </el-tag>
              </div>
            </el-form-item>
            <el-form-item label="过滤作者">
              <div class="w-full flex flex-wrap gap-2">
                <el-tag
                  v-for="author in settingStore.filter.authors" :key="author" type="info"
                  closable @close="handleCloseAuthor(author)"
                >
                  {{ author }}
                </el-tag>
              </div>
            </el-form-item>
          </el-form>
        </div>

        <!-- 数据管理 -->
        <div>
          <h3>
            <el-icon>
              <DataBoard />
            </el-icon>
            数据管理
          </h3>

          <div>
            <!-- 本地数据统计 -->
            <div>
              <div>
                <span>本地数据统计</span>
              </div>
              <div>
                <div>
                  <span>稍后观看:</span>
                  <span>{{ localStore.local.WATCH_LATER_LIST.length }} 部</span>
                </div>
                <div>
                  <span>关注作者:</span>
                  <span>{{ localStore.local.FOLLOW_AUTHOR_LIST.length }} 位</span>
                </div>
                <div>
                  <span>分类缓存:</span>
                  <span>{{ localStore.local.CATEGORIES.length }} 个</span>
                </div>
              </div>
            </div>

            <!-- 数据操作 -->
            <div>
              <div>
                <span>数据操作</span>
              </div>
              <div>
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
            </div>
          </div>
        </div>

        <!-- 关于信息 -->
        <div>
          <div class="flex items-center gap-2 text-18px font-bold line-height-1 py-10px my-14px border-b-3px border-[--el-color-primary] border-b-solid">
            <el-icon>
              <InfoFilled />
            </el-icon>
            关于应用
          </div>

          <el-form :label-width="labelWidth" :label-position="lebelPosition">
            <el-form-item label="应用名称">
              {{ appName }}
            </el-form-item>
            <el-form-item label="版本信息">
              {{ appVersion }}
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </div>

    <!-- 导入数据对话框 -->
    <el-dialog v-model="importDialogVisible" title="导入数据" width="500px">
      <div>
        <el-upload
          :auto-upload="false"
          :show-file-list="false"
          accept=".json"
          @change="handleFileChange"
        >
          <el-button type="primary">
            <el-icon><Upload /></el-icon>
            选择文件
          </el-button>
        </el-upload>
        <div v-if="importFile">
          <el-text>已选择文件: {{ importFile.name }}</el-text>
        </div>
      </div>
      <template #footer>
        <el-button @click="importDialogVisible = false">取消</el-button>
        <el-button type="primary" :disabled="!importFile" @click="confirmImportData">确认导入</el-button>
      </template>
    </el-dialog>
  </el-scrollbar>
</template>

<style scoped>

</style>
