import type { MouseEvent } from 'react'

import SoapChroniclesContent, { metadata } from '../../content/blog/the-soap-chronicles.mdx'

import styles from './BlogPost.module.css'

type BlogPostMetadata = {
  publishedAt: string
  title: string
}

const postMetadata = metadata as BlogPostMetadata

type BlogPostProps = {
  onNavigate: (path: string) => void
}

function formatPublishedAt(publishedAt: string) {
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
    year: 'numeric',
  }).format(new Date(`${publishedAt}T00:00:00Z`))
}

function isModifiedClick(event: MouseEvent<HTMLAnchorElement>) {
  return event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
}

export function BlogPost({ onNavigate }: BlogPostProps) {
  function handleBackNavigation(event: MouseEvent<HTMLAnchorElement>) {
    if (event.defaultPrevented || isModifiedClick(event)) {
      return
    }

    event.preventDefault()
    onNavigate(event.currentTarget.pathname)
  }

  return (
    <article className={styles.post} aria-labelledby="post-heading">
      <header>
        <h1 className={styles.heading} id="post-heading">
          {postMetadata.title}
        </h1>
        <p className={styles.metadata}>
          <time dateTime={postMetadata.publishedAt}>{formatPublishedAt(postMetadata.publishedAt)}</time>
        </p>
      </header>
      <div className={`${styles.content} mdx-content`}>
        <SoapChroniclesContent />
      </div>
      <footer className={styles.postFooter}>
        <a className={styles.backLink} href="/blog" onClick={handleBackNavigation}>
            <svg className={styles.backArrow} viewBox="0 0 24 24" aria-hidden="true">
              <path d="M19 12H5" />
              <path d="m12 19-7-7 7-7" />
            </svg>
            Back to Blog
        </a>
      </footer>
    </article>
  )
}
