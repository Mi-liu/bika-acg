import path from 'node:path'
import process from 'node:process'
import basicSsl from '@vitejs/plugin-basic-ssl'
import vue from '@vitejs/plugin-vue'
import { VueHooksPlusResolver } from '@vue-hooks-plus/resolvers'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import vueDevTools from 'vite-plugin-vue-devtools'

const root = process.cwd()

// https://vite.dev/config/
export default defineConfig({
  server: {
    https: {},
  },
  plugins: [
    basicSsl(),
    vue(),
    vueDevTools(),
    // 添加 UnoCSS 插件
    UnoCSS(),
    AutoImport({
      // Auto import Vue composables and functions
      imports: ['vue', 'pinia', 'vue-router', '@vueuse/core'],
      dirs: ['src/store/modules'],
      resolvers: [ElementPlusResolver(), VueHooksPlusResolver()],
      dts: 'typings/auto-imports.d.ts',
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: 'typings/components.d.ts',
    }),
  ],
  envDir: path.resolve(root, 'env'),
  resolve: {
    alias: {
      '@': `${root}/src`,
      '@common': `${root}/common`,
    },
  },
  base: './', // 使用相对路径
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets',
    // 设置 chunk 大小警告限制为 1000KB
    chunkSizeWarningLimit: 500,

    rollupOptions: {
      output: {
        // 手动分割代码块
        manualChunks: (id) => {
          const normalizedId = id.replaceAll(path.sep, '/')

          if (!normalizedId.includes('/node_modules/')) {
            return
          }

          // Vue 核心库
          if (/\/node_modules\/(?:\.pnpm\/)?(?:@vue\/|vue\/|pinia\/|vue-router\/)/.test(normalizedId)) {
            return 'vue-vendor'
          }
          // Element Plus UI 库
          if (normalizedId.includes('/element-plus/')) {
            return 'element-plus'
          }
          // VueUse 工具库
          if (normalizedId.includes('/@vueuse/core/')) {
            return 'vueuse'
          }
          // Vue Hooks Plus
          if (normalizedId.includes('/vue-hooks-plus/')) {
            return 'vue-hooks-plus'
          }
          // 动画库
          if (normalizedId.includes('/gsap/')) {
            return 'animation'
          }
          // 工具库
          if (
            normalizedId.includes('/dayjs/')
            || normalizedId.includes('/crypto-js/')
            || normalizedId.includes('/lodash-es/')
          ) {
            return 'utils'
          }
          // 图标库
          if (normalizedId.includes('/@element-plus/icons-vue/')) {
            return 'icons'
          }
        },
        // 为静态资源文件命名
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
})
