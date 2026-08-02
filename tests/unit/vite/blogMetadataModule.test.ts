import type { Plugin } from 'vite'
import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('node:child_process', () => ({
  execFileSync: vi.fn(),
}))

vi.mock('node:fs', () => ({
  readFileSync: vi.fn(),
  readdirSync: vi.fn(),
  statSync: vi.fn(() => ({ mtime: new Date('2020-06-01T00:00:00Z') })),
}))

const { execFileSync } = await import('node:child_process')
const { readFileSync, readdirSync } = await import('node:fs')
const {
  blogMetadataModule,
  formatFileSize,
  getCreatedDate,
  getLastModifiedDate,
  readBlogMetadata,
} = await import('../../../vite.plugins')

function callResolveId(plugin: Plugin, id: string) {
  const resolveId = plugin.resolveId as (this: unknown, id: string) => unknown
  return resolveId.call({}, id)
}

function callLoad(plugin: Plugin, id: string) {
  const load = plugin.load as (
    this: { addWatchFile: (file: string) => void },
    id: string,
  ) => unknown
  return load.call({ addWatchFile: () => {} }, id)
}

afterEach(() => {
  vi.mocked(execFileSync).mockReset()
  vi.mocked(readFileSync).mockReset()
  vi.mocked(readdirSync).mockReset()
})

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

describe('readBlogMetadata', () => {
  it('parses frontmatter and computes filename/size/dates for each mdx file', () => {
    vi.mocked(readdirSync).mockReturnValue(['post.mdx', 'index.ts'] as never)
    vi.mocked(readFileSync).mockReturnValue(
      '---\ntitle: Test Post\nslug: test-post\npublishedAt: 2024-01-01\ndescription: A test post\n---\ncontent',
    )
    // read in source order: getCreatedDate's git log, then getLastModifiedDate's
    vi.mocked(execFileSync).mockReturnValueOnce('2023-01-01\n').mockReturnValueOnce('2024-03-15\n')

    expect(readBlogMetadata('/blog')).toEqual([
      {
        title: 'Test Post',
        slug: 'test-post',
        publishedAt: '2024-01-01',
        description: 'A test post',
        filename: 'post.mdx',
        size: '97 B',
        createdAt: '2023-01-01',
        modifiedAt: '2024-03-15',
      },
    ])
  })
})

describe('blogMetadataModule', () => {
  const plugin = blogMetadataModule()

  describe('resolveId', () => {
    it('resolves the virtual module id', () => {
      expect(callResolveId(plugin, 'virtual:blog-metadata')).toBe('\0virtual:blog-metadata')
    })

    it('ignores other ids', () => {
      expect(callResolveId(plugin, 'something-else')).toBeUndefined()
    })
  })

  describe('load', () => {
    it('exports the metadata read from the blog directory for the resolved id', () => {
      vi.mocked(readdirSync).mockReturnValue(['post.mdx'] as never)
      vi.mocked(readFileSync).mockReturnValue('---\ntitle: Test Post\n---\ncontent')
      vi.mocked(execFileSync).mockReturnValue('2024-03-15\n')

      const result = callLoad(plugin, '\0virtual:blog-metadata') as string

      expect(result).toMatch(/^export const blogMetadata = /)
      const metadata = JSON.parse(result.replace('export const blogMetadata = ', ''))
      expect(metadata).toEqual([expect.objectContaining({ title: 'Test Post' })])
    })

    it('ignores other ids', () => {
      expect(callLoad(plugin, 'something-else')).toBeUndefined()
    })
  })
})
