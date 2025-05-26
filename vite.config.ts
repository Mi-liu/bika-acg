import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import VueRouter from 'unplugin-vue-router/vite'
import UnoCSS from 'unocss/vite'
import process from 'node:process'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import { VueHooksPlusResolver } from '@vue-hooks-plus/resolvers'
const root = process.cwd()

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // VueRouter must be before Vue plugin
    VueRouter({
      // Configuration options for unplugin-vue-router
      // https://github.com/posva/unplugin-vue-router
      routesFolder: 'src/views',
      dts: 'typings/typed-router.d.ts',
      // async extendRoute(route) {
      //   route.addToMeta({
      //     layout: true,
      //   })
      // },
    }),
    vue(),
    vueDevTools(),
    // 添加 UnoCSS 插件
    UnoCSS(),
    AutoImport({
      // Auto import Vue composables and functions
      imports: ['vue', 'pinia', VueRouterAutoImports, '@vueuse/core'],
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
