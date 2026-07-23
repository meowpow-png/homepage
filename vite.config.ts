import mdx from '@mdx-js/rollup'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'

export default defineConfig({
  plugins: [
    mdx({
      remarkPlugins: [remarkFrontmatter, [remarkMdxFrontmatter, { name: 'metadata' }]],
    }),
    react(),
  ],
})
