import type {ComponentType} from 'react'

import {getMetadata} from '@/content/getMetadata'

export type BlogPostMetadata = {
    createdAt: string
    filename: string
    modifiedAt: string
    publishedAt: string
    size: string
    slug: string
    title: string
}

interface BlogModule {
    default: ComponentType<{components?: Record<string, unknown>}>
    metadata: Record<string, unknown>
}

function toFilename(path: string): string {
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

function byPublishedAtAscending(
    a: {metadata: BlogPostMetadata},
    b: {metadata: BlogPostMetadata},
): number {
    return a.metadata.publishedAt.localeCompare(b.metadata.publishedAt)
}

const modules = import.meta.glob<BlogModule>('./*.mdx', {eager: true})

export const blogPosts = Object.entries(modules)
    .map(toBlogPost)
    .sort(byPublishedAtAscending)

export type BlogPost = (typeof blogPosts)[number]

export function getBlogPost(slug: string) {
    return blogPosts.find((post) => post.metadata.slug === slug)
}

export function getNextPost(slug: string) {
    const index = blogPosts.findIndex((post) => post.metadata.slug === slug)

    if (index === -1) {
        return undefined
    }
    return blogPosts[index + 1]
}

export function getPreviousPost(slug: string) {
    const index = blogPosts.findIndex((post) => post.metadata.slug === slug)

    if (index === -1) {
        return undefined
    }
    return blogPosts[index - 1]
}
