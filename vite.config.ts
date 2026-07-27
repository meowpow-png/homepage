import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'

import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import mdx from '@mdx-js/rollup'
import rehypePrettyCode from 'rehype-pretty-code'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'

import { CATPPUCCIN_FLAVOR } from './src/shared/styles/catppuccinFlavor'
import {
  injectBlogPostDates,
  injectBlogPostFileSize,
  mermaidCatppuccinTheme,
  validateProjectLanguages,
} from './vite.plugins'

const CODE_THEME = `catppuccin-${CATPPUCCIN_FLAVOR}` as const

export default defineConfig({
  plugins: [
    injectBlogPostFileSize(),
    injectBlogPostDates(),
    validateProjectLanguages(),
    mermaidCatppuccinTheme(),
    mdx({
      remarkPlugins: [
        remarkFrontmatter,
        [remarkMdxFrontmatter, { name: 'metadata' }],
      ],
      rehypePlugins: [
        [
          rehypePrettyCode,
          {
            theme: CODE_THEME,
          },
        ],
      ],
    }),
    react(),
    svgr(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    // mermaid lazily imports its diagram-type renderers at render
    // time. Without this, Vite only discovers them on first use,
    // triggering a dependency re-optimization + reload mid-render.
    include: ['mermaid'],
  },
  build: {
    // mermaid ships one large shared chunk covering diagram
    // types we don't use. It's never fetched at runtime,
    // so it shouldn't trip the default 500kB warning.
    chunkSizeWarningLimit: 700,
  },
  test: {
    coverage: {
      provider: 'v8',
    },
  },
})
