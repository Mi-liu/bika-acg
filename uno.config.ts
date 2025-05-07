import { defineConfig, presetUno, presetAttributify, presetIcons } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
  ],
  shortcuts: [
    // 自定义快捷方式
    [
      'btn',
      'px-4 py-2 rounded inline-block bg-primary text-white cursor-pointer hover:bg-primary-dark disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50',
    ],
    [
      'icon-btn',
      'inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-primary',
    ],
    ['center', 'flex items-center justify-center'],
    [
      'form-input',
      'w-full rounded border border-gray-200 bg-transparent px-4 py-2 text-sm outline-none transition-all focus:border-primary',
    ],
  ],
  theme: {
    colors: {
      primary: {
        DEFAULT: '#FF6B9A', // 粉色主色调
        dark: '#E05A85', // 深粉色
        light: '#FFA5C3', // 浅粉色
      },
    },
  },
})
