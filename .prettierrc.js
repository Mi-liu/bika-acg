/**
 * Prettier 配置文件
 *
 * 注意：此项目主要使用 @antfu/eslint-config 进行代码格式化
 * 此配置仅用于不被 ESLint 覆盖的文件类型（如 .md, .yml 等）
 */
module.exports = {
  // 基本格式化选项
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  useTabs: false,
  trailingComma: 'es5',
  bracketSpacing: true,
  arrowParens: 'avoid',
  endOfLine: 'lf',
  printWidth: 100,

  // 覆盖特定文件类型的配置
  overrides: [
    {
      files: ['*.md', '*.markdown'],
      options: {
        printWidth: 80,
        proseWrap: 'preserve',
      },
    },
    {
      files: ['*.yml', '*.yaml'],
      options: {
        singleQuote: false,
      },
    },
    {
      files: ['*.json', '*.jsonc'],
      options: {
        trailingComma: 'none',
      },
    },
  ],
}
