import type { ComponentType } from 'react'

import { getMetadata } from '@/content/getMetadata'

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

interface BlogModule {
  default: ComponentType<{ components?: Record<string, unknown> }>
  metadata: Record<string, unknown>
}

export function toFilename(path: string): string {
  return path.replace('./', '')
}

function toBlogPost([path, module]: [string, BlogModule]) {
  return {
    Content: module.default,
    metadata: {
      ...getMetadata<Omit<BlogPostMetadata, 'filename'>>(module.metadata),
      filename: toFilename(path),
    },
  }
}

export function byPublishedAtAscending(
  a: { metadata: BlogPostMetadata },
  b: { metadata: BlogPostMetadata },
): number {
  return a.metadata.publishedAt.localeCompare(b.metadata.publishedAt)
}

const modules = import.meta.glob<BlogModule>('./*.mdx', { eager: true })

export const blogPosts = Object.entries(modules).map(toBlogPost).sort(byPublishedAtAscending)

export type BlogPost = (typeof blogPosts)[number]

export function findPostBySlug(posts: BlogPost[], slug: string): BlogPost | undefined {
  return posts.find((post) => post.metadata.slug === slug)
}

export function findNextPost(posts: BlogPost[], slug: string): BlogPost | undefined {
  const index = posts.findIndex((post) => post.metadata.slug === slug)

  if (index === -1) {
    return undefined
  }
  return posts[index + 1]
}

export function findPreviousPost(posts: BlogPost[], slug: string): BlogPost | undefined {
  const index = posts.findIndex((post) => post.metadata.slug === slug)

  if (index === -1) {
    return undefined
  }
  return posts[index - 1]
}

export function getBlogPost(slug: string) {
  return findPostBySlug(blogPosts, slug)
}

export function getNextPost(slug: string) {
  return findNextPost(blogPosts, slug)
}

export function getPreviousPost(slug: string) {
  return findPreviousPost(blogPosts, slug)
}
