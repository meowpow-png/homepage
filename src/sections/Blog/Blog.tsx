import type {JSX} from "react";

import BlogSummary from '@/content/blog.mdx'
import {blogPosts} from '@/content/blog'
import FileIcon from '@/shared/assets/icons/file.svg?react'
import {Link} from '@/shared/routing'

import styles from './Blog.module.css'

export function Blog(): JSX.Element {
    return (
        <section className={styles.blog} aria-labelledby="blog-heading">
            <header className={styles.introduction}>
                <h1 className={styles.heading} id="blog-heading">
                    Blog
                </h1>

                <div className={`${styles.summary} mdx-content`}>
                    <BlogSummary/>
                </div>
            </header>

            <div className={styles.listingShell}>
                <p className={styles.directory}>~/blog</p>

                <div
                    className={styles.table}
                    role="table"
                    aria-label="Blog posts"
                >
                    <div
                        className={`${styles.tableRow} ${styles.tableHeader}`}
                        role="row"
                    >
                        <span role="columnheader">Created</span>
                        <span role="columnheader">Modified</span>
                        <span role="columnheader">Size</span>
                        <span role="columnheader">File</span>
                    </div>

                    {blogPosts.map(({metadata: post}) => {
                        return (
                            <article
                                key={post.filename}
                                className={styles.post}
                                role="row"
                            >
                                <time
                                    className={styles.metadata}
                                    role="cell"
                                    dateTime={post.createdAt}
                                    data-label="Created"
                                >
                                    {post.createdAt}
                                </time>

                                <time
                                    className={styles.metadata}
                                    role="cell"
                                    dateTime={post.modifiedAt}
                                    data-label="Modified"
                                >
                                    {post.modifiedAt}
                                </time>

                                <span
                                    className={styles.metadata}
                                    role="cell"
                                    data-label="Size"
                                >
                  {post.size}
                </span>
                                <div
                                    className={styles.file}
                                    role="cell"
                                    data-label="File"
                                >
                                    <Link
                                        className={styles.fileName}
                                        href={`/blog/${post.slug}`}
                                    >
                                        <FileIcon className={styles.fileIcon}/>
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
