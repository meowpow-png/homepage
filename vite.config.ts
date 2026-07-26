import { execFileSync } from 'node:child_process'
import { statSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, normalizePath, type Plugin } from 'vite'

import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import mdx from '@mdx-js/rollup'
import rehypePrettyCode from 'rehype-pretty-code'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'

function formatFileSize(bytes: number) {
  if (bytes < 1000) {
    return `${bytes} B`
  }

  return `${(bytes / 1000).toFixed(1)} KB`
}

function getLastModifiedDate(filePath: string): string {
  try {
    const gitDate = execFileSync(
      'git', ['log', '-1', '--format=%cs', '--', filePath],
      { encoding: 'utf8' },
    ).trim()

    if (gitDate) {
      return gitDate
    }
  } catch {
    // Not a git repo, or git unavailable — fall through to mtime.
  }

  return statSync(filePath).mtime.toISOString().slice(0, 10)
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

function injectBlogPostModifiedAt(): Plugin {
  const blogDirectory = normalizePath(resolve('src/content/blog'))

  return {
    name: 'inject-blog-post-modified-at',
    enforce: 'pre',
    transform(code, id) {
      const filePath = normalizePath(id.split('?', 1)[0])

      if (!filePath.startsWith(`${blogDirectory}/`) || !filePath.endsWith('.mdx')) {
        return null
      }

      const modifiedAt = getLastModifiedDate(filePath)

      return {
        code: code.replace(/^---\r?\n/, (opening) => `${opening}modifiedAt: ${modifiedAt}\n`),
        map: null,
      }
    },
  }
}

export default defineConfig({
  plugins: [
    injectBlogPostFileSize(),
    injectBlogPostModifiedAt(),
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
    svgr(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
