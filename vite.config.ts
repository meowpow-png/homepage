import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'

import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import istanbul from 'vite-plugin-istanbul'
import mdx from '@mdx-js/rollup'
import rehypePrettyCode from 'rehype-pretty-code'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'

import { CATPPUCCIN_FLAVOR } from './src/shared/styles/catppuccinFlavor'
import {
  blockNonProductionIndexing,
  inlineStylesheet,
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
    blockNonProductionIndexing(),
    inlineStylesheet(),
    mermaidCatppuccinTheme(),
    mdx({
      remarkPlugins: [remarkFrontmatter, [remarkMdxFrontmatter, { name: 'metadata' }]],
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
    istanbul({
      include: 'src/*',
      exclude: ['node_modules', 'tests/'],
      requireEnv: true,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    // mermaid lazily imports diagram renderers at render time — pre-bundle
    // here or vite reloads mid-render the first time one is used
    include: ['mermaid'],
  },
  build: {
    // CSS is inlined as one <style> anyway,
    // so per-chunk splitting just orphans unlinked files
    cssCodeSplit: false,
    // mermaid's shared chunk covers diagram types we don't use and is
    // never fetched at runtime, so ignore the default 500kb warning
    chunkSizeWarningLimit: 700,
    // vite-plugin-istanbul needs this for accurate coverage;
    // hidden keeps the map off production bundle's sourceMappingURL
    sourcemap: 'hidden',
    // lets prerender script resolve dev-mode asset URLs
    // to their hashed production paths in rendered HTML
    manifest: true,
  },
  test: {
    include: ['tests/unit/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'istanbul',
      reportsDirectory: 'tests/output/coverage/unit',
      reporter: ['text', 'html', 'clover', 'json', 'json-summary'],
    },
  },
})
