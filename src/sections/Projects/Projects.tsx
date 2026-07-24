import { metadata } from '../../content/projects.mdx'

import { ProjectEntry } from './components/ProjectEntry'
import { ProjectTimeline } from './components/ProjectTimeline'
import { useActiveProject } from './hooks/useActiveProject'
import type { ProjectsMetadata } from './types'

import styles from './Projects.module.css'

const projectsMetadata = metadata as ProjectsMetadata
const projectIds = projectsMetadata.projects.map((project) => project.id)

export function Projects() {
  const { closing, intro, projects, title } = projectsMetadata
  const activeProjectId = useActiveProject(projectIds)

  return (
    <section className={styles.projects} aria-labelledby="projects-heading">
      <header className={styles.introduction}>
        <h1 className={styles.heading} id="projects-heading">
          {title}
        </h1>
        <div className={styles.introCopy}>
          {intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </header>

      <div className={styles.projectLayout}>
        <ProjectTimeline
          activeProjectId={activeProjectId}
          projects={projects}
        />
        <div className={styles.projectList}>
          {projects.map((project) => (
            <ProjectEntry key={project.id} project={project} />
          ))}
          <div className={styles.moreProjects}>
            <p className={styles.moreProjectsMarker} aria-hidden="true">
              ...
            </p>
            <p>{closing}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
