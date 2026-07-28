import type { JSX } from 'react'

import ProjectsIntro, { metadata } from '@/content/projects.mdx'
import { getMetadata } from '@/content/getMetadata'
import { projects } from '@/content/projects'

import { ProjectEntry } from './ProjectEntry'
import { ProjectTimeline } from './ProjectTimeline'
import { useActiveProject } from './useActiveProject'
import type { ProjectsPageMetadata } from './types'

import styles from './Projects.module.css'

const pageMetadata = getMetadata<ProjectsPageMetadata>(metadata)
const projectIds = projects.map(({ metadata: project }) => project.id)

export function Projects(): JSX.Element {
  const activeProjectId = useActiveProject(projectIds)

  return (
    <section className={styles.projects} aria-labelledby="projects-heading">
      <header className={styles.introduction}>
        <h1 className={styles.heading} id="projects-heading">
          Projects
        </h1>
        <div className={`${styles.introCopy} mdx-content`}>
          <ProjectsIntro />
        </div>
      </header>
      <div className={styles.projectLayout}>
        <ProjectTimeline
          activeProjectId={activeProjectId}
          projects={projects.map(({ metadata: project }) => project)}
        />
        <div className={styles.projectList}>
          {projects.map(({ Content, metadata: project }) => (
            <ProjectEntry key={project.id} metadata={project}>
              <Content />
            </ProjectEntry>
          ))}
          <div className={styles.moreProjects}>
            <p className={styles.moreProjectsMarker} aria-hidden="true">
              ...
            </p>
            <p>{pageMetadata.closing}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
