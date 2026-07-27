import { resolve } from 'node:path'
import { normalizePath, type Plugin } from 'vite'
import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('node:child_process', () => ({
    execFileSync: vi.fn(),
}))

vi.mock('node:fs', () => ({
    statSync: vi.fn(() => ({ mtime: new Date('2020-06-01T00:00:00Z') })),
}))

const { execFileSync } = await import('node:child_process')
const {
    getCreatedDate,
    getLastModifiedDate,
    injectBlogPostDates,
} = await import('../../../vite.plugins')

function runTransform(plugin: Plugin, code: string, id: string) {
    const transform = plugin.transform as (this: unknown, code: string, id: string) => unknown
    return transform.call({}, code, id)
}

const blogDir = normalizePath(resolve('src/content/blog'))

afterEach(() => {
    vi.mocked(execFileSync).mockReset()
})

describe('getLastModifiedDate', () => {
    it('returns the last git commit date for the file', () => {
        vi.mocked(execFileSync).mockReturnValue('2024-03-15\n')

        expect(getLastModifiedDate('post.mdx')).toBe('2024-03-15')
    })

    it('falls back to file mtime when git is unavailable', () => {
        vi.mocked(execFileSync).mockImplementation(() => {
            throw new Error('not a git repo')
        })

        expect(getLastModifiedDate('post.mdx')).toBe('2020-06-01')
    })
})

describe('getCreatedDate', () => {
    it('returns the oldest date from git history (add commit)', () => {
        vi.mocked(execFileSync).mockReturnValue('2024-03-15\n2023-01-01\n')

        expect(getCreatedDate('post.mdx')).toBe('2023-01-01')
    })

    it('falls back to file mtime when git history is empty', () => {
        vi.mocked(execFileSync).mockReturnValue('')

        expect(getCreatedDate('post.mdx')).toBe('2020-06-01')
    })
})

describe('injectBlogPostDates', () => {
    const plugin = injectBlogPostDates()

    it('injects createdAt and modifiedAt into frontmatter for a blog post', () => {
        vi.mocked(execFileSync)
            .mockReturnValueOnce('2024-03-15\n')
            .mockReturnValueOnce('2023-01-01\n')

        const code = '---\ntitle: Test\n---\ncontent'
        const id = `${blogDir}/post.mdx`

        const result = runTransform(plugin, code, id) as { code: string }

        expect(result.code).toBe(
            '---\ncreatedAt: 2023-01-01\nmodifiedAt: 2024-03-15\ntitle: Test\n---\ncontent',
        )
    })

    it('ignores files outside the blog directory', () => {
        const code = '---\ntitle: Test\n---\ncontent'
        const id = `${normalizePath(resolve('src/content/projects'))}/post.mdx`

        expect(runTransform(plugin, code, id)).toBeNull()
    })
})
