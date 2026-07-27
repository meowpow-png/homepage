import type {ComponentPropsWithoutRef, JSX} from 'react'

import type {BlogPost} from '@/content/blog'
import {getNextPost, getPreviousPost} from '@/content/blog'
import {ArrowIcon} from '@/shared/components'
import {Link} from '@/shared/routing'

import styles from './BlogPost.module.css'

interface BlogPostPageProps {
    post: BlogPost
}

export function formatPublishedAt(publishedAt: string): string {
    return new Intl.DateTimeFormat('en-US', {
        day: 'numeric',
        month: 'short',
        timeZone: 'UTC',
        year: 'numeric',
    }).format(new Date(`${publishedAt}:00Z`))
}

function PostLink({
    href,
    ...props
}: ComponentPropsWithoutRef<'a'>): JSX.Element {
    if (!href) {
        return <a {...props} />
    }

    return <Link {...props} href={href}/>
}

export function BlogPostPage({
    post,
}: BlogPostPageProps): JSX.Element {
    const {Content, metadata} = post
    const nextPost = getNextPost(metadata.slug)
    const previousPost = getPreviousPost(metadata.slug)

    return (
        <article
            className={styles.post}
            aria-labelledby="post-heading"
        >
            <header>
                <h1
                    className={styles.heading}
                    id="post-heading"
                >
                    {metadata.title}
                </h1>

                <p className={styles.metadata}>
                    <time dateTime={metadata.publishedAt}>
                        {formatPublishedAt(metadata.publishedAt)}
                    </time>
                </p>
            </header>

            <div className={`${styles.content} mdx-content`}>
                <Content components={{a: PostLink}}/>
            </div>

            <footer className={styles.postFooter}>
                <Link
                    className={styles.backLink}
                    href={previousPost ? `/blog/${previousPost.metadata.slug}` : '/blog'}
                >
                    <ArrowIcon
                        className={styles.backArrow}
                        direction="left"
                        aria-hidden="true"
                    />
                    {previousPost ? 'Previous' : 'Blog'}
                </Link>

                {nextPost && (
                    <Link
                        className={styles.nextLink}
                        href={`/blog/${nextPost.metadata.slug}`}
                    >
                        Next
                        <ArrowIcon
                            className={styles.nextArrow}
                            direction="right"
                            aria-hidden="true"
                        />
                    </Link>
                )}
            </footer>
        </article>
    )
}
