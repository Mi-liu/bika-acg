import antfu from '@antfu/eslint-config'

console.log('开始检查代码格式问题')
export default antfu(
  {
    ignores: ['node_modules', 'dist'],
  },
  {
    rules: {
      // 禁止使用未定义的变量
      'no-unused-vars': 'warn',
      // 禁止使用console
      'no-console': 'off',
      // 禁止使用async-promise-executor
      'no-async-promise-executor': 'off',
      // 禁止使用未定义的变量
      'ts/no-unused-vars': 'warn',
      // 禁止使用未定义的变量
      'unused-imports/no-unused-vars': 'warn',
      // 组件名必须为多单词
      'vue/multi-word-component-names': 'off',
      // 禁止使用未定义的模板
      'vue/no-lone-template': 'error',
      // 禁止使用未定义的变量
      'vue/no-unused-vars': 'warn',
      // 禁止使用保留的组件名
      'vue/no-reserved-component-names': 'off',
      // 单行标签时，内容必须换行
      'vue/singleline-html-element-content-newline': 'off',
      // 单行标签时，最多3个属性
      'vue/max-attributes-per-line': [
        'warn',
        {
          // 单行标签时
          singleline: {
            max: 3,
          },
          // 多行标签时
          multiline: {
            max: 3,
          },
        },
      ],
    },
  },
)
