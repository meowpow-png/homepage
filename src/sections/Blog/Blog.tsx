import BlogSummary from '../../content/blog.mdx'
import { blogPosts, type BlogPostMetadata } from '../../content/blog/posts'
import { Link, useRouter } from '../../shared/components/routing'

import styles from './Blog.module.css'

function formatPublishedAt(publishedAt: string) {
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  }).format(new Date(`${publishedAt}T00:00:00Z`))
}

export function Blog() {
  const { navigate } = useRouter()

  return (
    <section className={styles.blog} aria-labelledby="blog-heading">
      <header className={styles.introduction}>
        <h1 className={styles.heading} id="blog-heading">
          Blog
        </h1>
        <div className={`${styles.summary} mdx-content`}>
          <BlogSummary />
        </div>
      </header>

      <div className={styles.listingShell}>
        <p className={styles.directory}>~/blog</p>
        <div className={styles.table} role="table" aria-label="Blog posts">
          <div className={`${styles.tableRow} ${styles.tableHeader}`} role="row">
            <span role="columnheader">Modified</span>
            <span role="columnheader">Size</span>
            <span role="columnheader">File</span>
          </div>
          {blogPosts.map(({ metadata }) => {
            const post = metadata as BlogPostMetadata

            return (
              <article className={styles.post} key={post.filename} role="row">
                <time
                  className={styles.metadata}
                  role="cell"
                  dateTime={post.publishedAt}
                  data-label="Modified"
                >
                  {formatPublishedAt(post.publishedAt)}
                </time>
                <span className={styles.metadata} role="cell" data-label="Size">
                  {post.size}
                </span>
                <div className={styles.file} role="cell" data-label="File">
                  <Link className={styles.fileName} href={`/blog/${post.slug}`} navigate={navigate}>
                    <FileIcon />
                    {post.filename}
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function FileIcon() {
  return (
    <svg className={styles.fileIcon} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 2.75h7.25L18 7.5v13.75H6z" />
      <path d="M13 2.75V7.5h5" />
    </svg>
  )
}
