import { getBlogPost } from '@/content/blog'
import { BlogPostPage } from '@/sections/Blog'

import type { Route } from './types'

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
    render: () => <BlogPostPage post={post} />,
  }
}

export const dynamicRoutes = [matchBlogPost]
