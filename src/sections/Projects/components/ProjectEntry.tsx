import type { Project } from '../types'

import styles from '../Projects.module.css'

type ProjectEntryProps = {
  project: Project
}

export function ProjectEntry({ project }: ProjectEntryProps) {
  return (
    <article className={styles.project}>
      <div className={styles.projectBody}>
        <h2 className={styles.projectTitle} id={project.id}>
          {project.title}
        </h2>
        <p className={styles.projectMeta}>
          {project.year} <span aria-hidden="true">·</span> {project.status}
        </p>
        <p className={styles.projectDescription}>{project.description}</p>
      </div>
      <ul className={styles.projectLinks} aria-label={`${project.title} links`}>
        {project.links.map((link) => (
          <li key={link.label}>
            <a href={link.href} target="_blank" rel="noopener noreferrer">
              {link.label} <span className={styles.externalIndicator} aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </article>
  )
}
