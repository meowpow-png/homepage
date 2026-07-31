import { describe, expect, it } from 'vitest'

import {
  type BlogPost,
  byPublishedAtAscending,
  findNextPost,
  findPostBySlug,
  findPreviousPost,
} from '@/content/blog'

function makePost(overrides: Partial<BlogPost['metadata']> = {}): BlogPost {
  return {
    Content: () => null,
    metadata: {
      createdAt: '2024-01-01',
      filename: 'post.mdx',
      modifiedAt: '2024-01-01',
      publishedAt: '2024-01-01',
      size: '1.0 KB',
      slug: 'post',
      title: 'Post',
      ...overrides,
    },
  } as BlogPost
}

describe('byPublishedAtAscending', () => {
  it('orders earlier dates before later ones', () => {
    const earlier = makePost({ publishedAt: '2024-01-01' })
    const later = makePost({ publishedAt: '2024-06-01' })

    expect(byPublishedAtAscending(earlier, later)).toBeLessThan(0)
    expect(byPublishedAtAscending(later, earlier)).toBeGreaterThan(0)
  })

  it('returns 0 for equal dates', () => {
    const a = makePost({ publishedAt: '2024-01-01' })
    const b = makePost({ publishedAt: '2024-01-01' })

    expect(byPublishedAtAscending(a, b)).toBe(0)
  })
})

describe('findPostBySlug', () => {
  const posts = [makePost({ slug: 'a' }), makePost({ slug: 'b' })]

  it('returns the matching post', () => {
    expect(findPostBySlug(posts, 'b')).toBe(posts[1])
  })

  it('returns undefined when no post matches', () => {
    expect(findPostBySlug(posts, 'missing')).toBeUndefined()
  })
})

describe('findNextPost', () => {
  const posts = [makePost({ slug: 'a' }), makePost({ slug: 'b' }), makePost({ slug: 'c' })]
  it('returns the post after the given slug', () => {
    expect(findNextPost(posts, 'a')).toBe(posts[1])
  })

  it('returns undefined for the last post', () => {
    expect(findNextPost(posts, 'c')).toBeUndefined()
  })

  it('returns undefined when the slug is not found', () => {
    expect(findNextPost(posts, 'missing')).toBeUndefined()
  })
})

describe('findPreviousPost', () => {
  const posts = [makePost({ slug: 'a' }), makePost({ slug: 'b' }), makePost({ slug: 'c' })]

  it('returns the post before the given slug', () => {
    expect(findPreviousPost(posts, 'c')).toBe(posts[1])
  })

  it('returns undefined for the first post', () => {
    expect(findPreviousPost(posts, 'a')).toBeUndefined()
  })

  it('returns undefined when the slug is not found', () => {
    expect(findPreviousPost(posts, 'missing')).toBeUndefined()
  })
})
