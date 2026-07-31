import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import pluginReact from 'eslint-plugin-react'
import markdown from '@eslint/markdown'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    ignores: [
      '.obsidian/**',
      '.claude/**',
      '.codex/**',
      '.mipe/**',
      'dist/**',
      '**/coverage/**',
      'node_modules/**',
      '.prettierrc.json',
      '**/*.md',
    ],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    extends: [tseslint.configs.recommended],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    ...pluginReact.configs.flat.recommended,
    settings: { react: { version: 'detect' } },
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    ...pluginReact.configs.flat['jsx-runtime'],
  },
  {
    files: ['**/*.md'],
    plugins: { markdown },
    language: 'markdown/gfm',
    extends: ['markdown/recommended'],
  },
  {
    // .cjs exists specifically to force CommonJS regardless of "type":
    // "module", so require() here is correct, not legacy code to flag
    files: ['**/*.cjs'],
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  },
])
