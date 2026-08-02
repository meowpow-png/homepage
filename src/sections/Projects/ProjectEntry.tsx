import type { JSX, ReactNode } from 'react'

import { PinIcon } from '@/shared/components'
import { Link } from '@/shared/routing'

import type { ProjectMetadata } from '@/content/projects'
import { LANGUAGE_COLORS } from './languages'
import styles from './Projects.module.css'

interface ProjectEntryProps {
  children: ReactNode
  metadata: ProjectMetadata
}

export function ProjectEntry({ children, metadata }: ProjectEntryProps): JSX.Element {
  return (
    <article className={styles.project}>
      <div className={styles.projectBody}>
        <div className={styles.projectHeader}>
          <h2 className={styles.projectTitle} id={metadata.id}>
            {metadata.title}
          </h2>
          {metadata.pinned && (
            <PinIcon className={styles.pinIndicator} aria-label="Pinned project" />
          )}
        </div>
        <p className={styles.projectMeta}>
          {metadata.date.slice(0, 4)}
          <span aria-hidden="true"> · </span>
          {metadata.status}
        </p>
        {metadata.languages && metadata.languages.length > 0 && (
          <ul className={styles.badges} aria-label={`${metadata.title} languages`}>
            {metadata.languages.map((language) => (
              <li key={language} className={styles.badge}>
                <span
                  className={styles.badgeDot}
                  style={{
                    background: LANGUAGE_COLORS[language.toLowerCase()],
                  }}
                  aria-hidden="true"
                />
                {language}
              </li>
            ))}
          </ul>
        )}
        <div className={`${styles.projectDescription} mdx-content`}>{children}</div>
      </div>
      <ul className={styles.projectLinks} aria-label={`${metadata.title} links`}>
        {metadata.links.map((link) => (
          <li key={link.label}>
            <Link href={link.href}>
              {link.label}

              {!link.href.startsWith('/') && (
                <span className={styles.externalIndicator} aria-hidden="true" />
              )}
            </Link>
          </li>
        ))}
      </ul>
    </article>
  )
}
