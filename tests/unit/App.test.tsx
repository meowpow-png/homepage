import { isValidElement } from 'react'
import { describe, expect, it } from 'vitest'

import { renderPage, resolveBlogPost, resolveCurrentPage } from '@/App'
import type { BlogPost } from '@/content/blog'
import { BlogPostPage } from '@/sections/Blog'
import { NotFound } from '@/sections/NotFound'
import type { Route } from '@/shared/routing'

function makeBlogPost(overrides: Partial<BlogPost['metadata']> = {}): BlogPost {
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

describe('resolveBlogPost', () => {
  it('returns undefined for a non-blog path', () => {
    expect(resolveBlogPost('/about')).toBeUndefined()
  })

  it('returns undefined for the blog index path', () => {
    expect(resolveBlogPost('/blog')).toBeUndefined()
  })

  it('returns the matching post for a known slug', () => {
    const post = resolveBlogPost('/blog/telekom-assignment-overview')

    expect(post?.metadata.slug).toBe('telekom-assignment-overview')
  })

  it('returns undefined for an unknown slug', () => {
    expect(resolveBlogPost('/blog/unknown-slug')).toBeUndefined()
  })
})

describe('resolveCurrentPage', () => {
  const route: Route = { currentPage: 'projects', render: () => null }

  it('returns the route current page when a route matches', () => {
    expect(resolveCurrentPage(route, false)).toBe('projects')
    expect(resolveCurrentPage(route, true)).toBe('projects')
  })

  it('returns "blog" when no route matches but a blog post does', () => {
    expect(resolveCurrentPage(undefined, true)).toBe('blog')
  })

  it('returns undefined when neither a route nor a blog post match', () => {
    expect(resolveCurrentPage(undefined, false)).toBeUndefined()
  })
})

describe('renderPage', () => {
  it('renders the route when one matches', () => {
    const sentinel = <div data-testid="sentinel" />
    const route: Route = { currentPage: 'about', render: () => sentinel }

    expect(renderPage(route, undefined)).toBe(sentinel)
  })

  it('renders the blog post page when there is no route but a blog post matches', () => {
    const post = makeBlogPost()

    const result = renderPage(undefined, post)

    expect(isValidElement(result)).toBe(true)
    expect(result && (result as React.ReactElement).type).toBe(BlogPostPage)
    expect(result && (result as React.ReactElement<{ post: BlogPost }>).props.post).toBe(post)
  })

  it('renders NotFound when neither a route nor a blog post match', () => {
    const result = renderPage(undefined, undefined)

    expect(isValidElement(result)).toBe(true)
    expect(result && (result as React.ReactElement).type).toBe(NotFound)
  })
})
