import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import VueRouter from 'unplugin-vue-router/vite'
import UnoCSS from 'unocss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // VueRouter must be before Vue plugin
    VueRouter({
      // Configuration options for unplugin-vue-router
      // https://github.com/posva/unplugin-vue-router
      routesFolder: 'src/views',
      dts: 'src/types/typed-router.d.ts',
    }),
    vue(),
    vueDevTools(),
    // 添加 UnoCSS 插件
    UnoCSS(),
    AutoImport({
      // Auto import Vue composables and functions
      imports: [
        'vue',
        'pinia',
        // 不要导入 vue-router，因为我们使用 unplugin-vue-router
        // 'vue-router',
        // Import VueUse
        '@vueuse/core',
      ],
      dirs: ['src/store/modules'],
      resolvers: [ElementPlusResolver()],
      dts: 'src/types/auto-imports.d.ts',
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: 'src/types/components.d.ts',
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
