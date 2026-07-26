import type {JSX} from 'react'

import {Link} from '@/shared/routing'

import type {Project} from '../types'
import styles from '../Projects.module.css'

interface ProjectEntryProps {
    project: Project
}

export function ProjectEntry({
    project,
}: ProjectEntryProps): JSX.Element {
    return (
        <article className={styles.project}>
            <div className={styles.projectBody}>
                <h2
                    className={styles.projectTitle}
                    id={project.id}
                >
                    {project.title}
                </h2>
                <p className={styles.projectMeta}>
                    {project.year}
                    <span aria-hidden="true"> · </span>
                    {project.status}
                </p>
                <p className={styles.projectDescription}>
                    {project.description}
                </p>
            </div>
            <ul
                className={styles.projectLinks}
                aria-label={`${project.title} links`}
            >
                {project.links.map((link) => (
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
