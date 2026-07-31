import { lazy, type ComponentType } from 'react'

import { blogMetadata } from 'virtual:blog-metadata'

export type BlogPostMetadata = {
  createdAt: string
  description: string
  filename: string
  modifiedAt: string
  publishedAt: string
  size: string
  slug: string
  title: string
}

type BlogContentComponent = ComponentType<{ components?: Record<string, unknown> }>

interface BlogContentModule {
  default: BlogContentComponent
}

export interface BlogPost {
  Content: BlogContentComponent
  metadata: BlogPostMetadata
}

export function byPublishedAtAscending(
  a: { metadata: BlogPostMetadata },
  b: { metadata: BlogPostMetadata },
): number {
  return a.metadata.publishedAt.localeCompare(b.metadata.publishedAt)
}

// content loaded on demand, only once a specific post is actually rendered —
// metadata comes from virtual:blog-metadata instead, so listing posts or
// matching a route by slug never imports (and bundles) a post's content
const contentLoaders = import.meta.glob<BlogContentModule>('./*.mdx')

// getBlogPost runs on every render that matches a blog post route, so the
// lazy component it returns must stay the same reference across calls —
// a fresh lazy() each render never resolves, since it always looks unresolved
const contentComponents = new Map<string, BlogContentComponent>()

export const blogPosts = blogMetadata.map((metadata) => ({ metadata })).sort(byPublishedAtAscending)

export function findPostBySlug<T extends { metadata: BlogPostMetadata }>(
  posts: T[],
  slug: string,
): T | undefined {
  return posts.find((post) => post.metadata.slug === slug)
}

export function findNextPost<T extends { metadata: BlogPostMetadata }>(
  posts: T[],
  slug: string,
): T | undefined {
  const index = posts.findIndex((post) => post.metadata.slug === slug)

  if (index === -1) {
    return undefined
  }
  return posts[index + 1]
}

export function findPreviousPost<T extends { metadata: BlogPostMetadata }>(
  posts: T[],
  slug: string,
): T | undefined {
  const index = posts.findIndex((post) => post.metadata.slug === slug)

  if (index === -1) {
    return undefined
  }
  return posts[index - 1]
}

export function getBlogPost(slug: string): BlogPost | undefined {
  const post = findPostBySlug(blogPosts, slug)

  if (!post) {
    return undefined
  }

  const { filename } = post.metadata
  let Content = contentComponents.get(filename)

  if (!Content) {
    const loadContent = contentLoaders[`./${filename}`]

    if (!loadContent) {
      return undefined
    }
    Content = lazy(loadContent)
    contentComponents.set(filename, Content)
  }

  return {
    Content,
    metadata: post.metadata,
  }
}

export function getNextPost(slug: string) {
  return findNextPost(blogPosts, slug)
}

export function getPreviousPost(slug: string) {
  return findPreviousPost(blogPosts, slug)
}
