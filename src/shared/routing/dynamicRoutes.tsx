import { lazy } from 'react'

import { getBlogPost } from '@/content/blog'

import type { Route } from './types'

const BlogPostPage = lazy(() =>
  import('@/sections/Blog').then((module) => ({ default: module.BlogPostPage })),
)

function matchBlogPost(pathname: string): Route | undefined {
  if (!pathname.startsWith('/blog/')) {
    return undefined
  }
  const post = getBlogPost(pathname.slice('/blog/'.length))

  if (!post) {
    return undefined
  }
  return {
    currentPage: 'blog',
    title: post.metadata.title,
    description: post.metadata.description,
    render: () => <BlogPostPage post={post} />,
  }
}

export const dynamicRoutes = [matchBlogPost]
