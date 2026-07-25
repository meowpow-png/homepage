import { resolve } from 'node:path'

import mdx from '@mdx-js/rollup'
import rehypePrettyCode from 'rehype-pretty-code'

import { defineConfig, normalizePath, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'

function formatFileSize(bytes: number) {
  if (bytes < 1000) {
    return `${bytes} B`
  }

  return `${(bytes / 1000).toFixed(1)} KB`
}

function injectBlogPostFileSize(): Plugin {
  const blogDirectory = normalizePath(resolve('src/content/blog'))

  return {
    name: 'inject-blog-post-file-size',
    enforce: 'pre',
    transform(code, id) {
      const filePath = normalizePath(id.split('?', 1)[0])

      if (!filePath.startsWith(`${blogDirectory}/`) || !filePath.endsWith('.mdx')) {
        return null
      }

      const size = formatFileSize(Buffer.byteLength(code, 'utf8'))

      return {
        code: code.replace(/^---\r?\n/, (opening) => `${opening}size: ${size}\n`),
        map: null,
      }
    },
  }
}

export default defineConfig({
  plugins: [
    injectBlogPostFileSize(),
    mdx({
      remarkPlugins: [
        remarkFrontmatter,
        [remarkMdxFrontmatter, { name: 'metadata' }],
      ],
      rehypePlugins: [
        [
          rehypePrettyCode,
          {
            theme: 'catppuccin-mocha',
          },
        ],
      ],
    }),
    react(),
  ],
})
