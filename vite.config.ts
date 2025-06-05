import path from 'node:path'
import process from 'node:process'
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
  plugins: [
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
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // 手动分割代码块
        manualChunks: {
          // Vue 核心库
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          // Element Plus UI 库
          'element-plus': ['element-plus'],
          // VueUse 工具库
          vueuse: ['@vueuse/core'],
          // Vue Hooks Plus
          'vue-hooks-plus': ['vue-hooks-plus'],
          // 动画库
          animation: ['gsap'],
          // 工具库
          utils: ['dayjs', 'crypto-js', 'lodash-es'],
          // 图标库
          icons: ['@element-plus/icons-vue'],
        },
        // 为静态资源文件命名
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const fileName = assetInfo.name ?? ''
          if (/\.(?:mp4|webm|ogg|mp3|wav|flac|aac)$/.test(fileName)) {
            return 'assets/media/[name]-[hash].[ext]'
          }
          if (/\.(?:png|jpe?g|gif|svg|ico|webp)$/.test(fileName)) {
            return 'assets/images/[name]-[hash].[ext]'
          }
          if (/\.(?:woff2?|eot|ttf|otf)$/.test(fileName)) {
            return 'assets/fonts/[name]-[hash].[ext]'
          }
          return 'assets/[name]-[hash].[ext]'
        },
      },
    },
  },
})
