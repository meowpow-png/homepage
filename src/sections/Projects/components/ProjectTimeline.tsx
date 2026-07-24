import type { MouseEvent } from 'react'

import type { Project } from '../types'

import styles from '../Projects.module.css'

type ProjectTimelineProps = {
  activeProjectId: string
  projects: Project[]
}

function shouldReduceMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function ProjectTimeline({
  activeProjectId,
  projects,
}: ProjectTimelineProps) {
  function handleProjectNavigation(event: MouseEvent<HTMLAnchorElement>) {
    const targetId = event.currentTarget.hash.slice(1)
    const target = document.getElementById(targetId)

    if (!target || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return
    }

    event.preventDefault()
    window.history.pushState(null, '', `#${targetId}`)
    target.scrollIntoView({ behavior: shouldReduceMotion() ? 'auto' : 'smooth', block: 'center' })
  }

  return (
    <nav className={styles.timeline} aria-label="Project navigation">
      <ol className={styles.timelineList}>
        {projects.map((project) => {
          const isActive = project.id === activeProjectId

          return (
            <li key={project.id} className={styles.timelineItem}>
              <a
                className={styles.timelineLink}
                href={`#${project.id}`}
                onClick={handleProjectNavigation}
                aria-current={isActive ? 'location' : undefined}
              >
                <span className={styles.timelineMarker} aria-hidden="true" />
                <span>{project.title}</span>
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
