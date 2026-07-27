import { resolve } from 'node:path'
import { normalizePath, type Plugin } from 'vite'
import { describe, expect, it } from 'vitest'

import { formatFileSize, injectBlogPostFileSize } from '../../../vite.config'

function runTransform(plugin: Plugin, code: string, id: string) {
    const transform = plugin.transform as (this: unknown, code: string, id: string) => unknown
    return transform.call({}, code, id)
}

const blogDir = normalizePath(resolve('src/content/blog'))

describe('formatFileSize', () => {
    it('formats sizes under 1000 bytes in B', () => {
        expect(formatFileSize(500)).toBe('500 B')
        expect(formatFileSize(999)).toBe('999 B')
    })

    it('formats sizes at or above 1000 bytes in KB', () => {
        expect(formatFileSize(1000)).toBe('1.0 KB')
        expect(formatFileSize(1500)).toBe('1.5 KB')
    })
})

describe('injectBlogPostFileSize', () => {
    const plugin = injectBlogPostFileSize()

    it('injects size into frontmatter for a blog post', () => {
        const code = '---\ntitle: Test\n---\ncontent'
        const id = `${blogDir}/post.mdx`

        const result = runTransform(plugin, code, id) as { code: string }

        expect(result.code).toBe(
            `---\nsize: ${formatFileSize(Buffer.byteLength(code, 'utf8'))}\ntitle: Test\n---\ncontent`,
        )
    })

    it('ignores files outside the blog directory', () => {
        const code = '---\ntitle: Test\n---\ncontent'
        const id = `${normalizePath(resolve('src/content/projects'))}/post.mdx`

        expect(runTransform(plugin, code, id)).toBeNull()
    })

    it('ignores non-mdx files', () => {
        const code = '---\ntitle: Test\n---\ncontent'
        const id = `${blogDir}/post.ts`

        expect(runTransform(plugin, code, id)).toBeNull()
    })
})
