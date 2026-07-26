import type { ComponentPropsWithoutRef } from 'react'

import type { BlogPost } from '../../content/blog/posts'
import { Link, useRouter } from '../../shared/routing'

import styles from './BlogPost.module.css'

type BlogPostProps = {
  post: BlogPost
}

function formatPublishedAt(publishedAt: string) {
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
    year: 'numeric',
  }).format(new Date(`${publishedAt}T00:00:00Z`))
}

export function BlogPost({ post }: BlogPostProps) {
  const { Content, metadata } = post
  const { navigate } = useRouter()

  function PostLink({ href, ...props }: ComponentPropsWithoutRef<'a'>) {
    if (!href) {
      return <a {...props} />
    }

    return <Link {...props} href={href} navigate={navigate} />
  }

  return (
    <article className={styles.post} aria-labelledby="post-heading">
      <header>
        <h1 className={styles.heading} id="post-heading">
          {metadata.title}
        </h1>
        <p className={styles.metadata}>
          <time dateTime={metadata.publishedAt}>{formatPublishedAt(metadata.publishedAt)}</time>
        </p>
      </header>
      <div className={`${styles.content} mdx-content`}>
        <Content components={{ a: PostLink }} />
      </div>
      <footer className={styles.postFooter}>
        <Link className={styles.backLink} href="/blog" navigate={navigate}>
            <svg className={styles.backArrow} viewBox="0 0 24 24" aria-hidden="true">
              <path d="M19 12H5" />
              <path d="m12 19-7-7 7-7" />
            </svg>
            Back to Blog
        </Link>
      </footer>
    </article>
  )
}
