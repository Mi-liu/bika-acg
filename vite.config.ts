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
})
