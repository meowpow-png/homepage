import type {JSX, ReactNode} from 'react'

import {Link} from '@/shared/routing'

import type {ProjectMetadata} from '@/content/projects'
import styles from './Projects.module.css'

interface ProjectEntryProps {
    children: ReactNode
    metadata: ProjectMetadata
}

export function ProjectEntry({
    children,
    metadata,
}: ProjectEntryProps): JSX.Element {
    return (
        <article className={styles.project}>
            <div className={styles.projectBody}>
                <h2
                    className={styles.projectTitle}
                    id={metadata.id}
                >
                    {metadata.title}
                </h2>
                <p className={styles.projectMeta}>
                    {metadata.year}
                    <span aria-hidden="true"> · </span>
                    {metadata.status}
                </p>
                <div className={`${styles.projectDescription} mdx-content`}>
                    {children}
                </div>
            </div>
            <ul
                className={styles.projectLinks}
                aria-label={`${metadata.title} links`}
            >
                {metadata.links.map((link) => (
                    <li key={link.label}>
                        <Link href={link.href}>
                            {link.label}

                            {!link.href.startsWith('/') && (
                                <span
                                    className={styles.externalIndicator}
                                    aria-hidden="true"
                                />
                            )}
                        </Link>
                    </li>
                ))}
            </ul>
        </article>
    )
}
