import type { JSX, MouseEvent } from 'react'
import { useEffect, useRef, useState } from 'react'

import { ChevronIcon } from '@/shared/components'

import type { ProjectMetadata } from '@/content/projects'
import styles from './Projects.module.css'

interface ProjectTimelineProps {
  activeProjectId: string
  projects: ProjectMetadata[]
}

function shouldReduceMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function ProjectTimeline({ activeProjectId, projects }: ProjectTimelineProps): JSX.Element {
  const [isJumpListOpen, setIsJumpListOpen] = useState(false)
  const mobileNavRef = useRef<HTMLElement>(null)
  const mobileBarToggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isJumpListOpen) {
      return
    }

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        setIsJumpListOpen(false)
        mobileBarToggleRef.current?.focus()
      }
    }

    function handleClickOutside(event: globalThis.MouseEvent): void {
      if (!mobileNavRef.current?.contains(event.target as Node)) {
        setIsJumpListOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isJumpListOpen])

  function handleProjectNavigation(event: MouseEvent<HTMLAnchorElement>): void {
    setIsJumpListOpen(false)

    const targetId = event.currentTarget.hash.slice(1)
    const target = document.getElementById(targetId)

    if (!shouldHandleProjectNavigation(event, target)) {
      return
    }
    event.preventDefault()

    window.history.pushState(null, '', `#${targetId}`)

    target.scrollIntoView({
      behavior: shouldReduceMotion() ? 'auto' : 'smooth',
      block: 'center',
    })
  }

  function renderProjectItem(
    project: ProjectMetadata,
    itemClassName: string | undefined,
    linkClassName: string | undefined,
    markerClassName: string | undefined,
  ): JSX.Element {
    const isActive = project.id === activeProjectId
    return (
      <li key={project.id} className={itemClassName}>
        <a
          className={linkClassName}
          href={`#${project.id}`}
          onClick={handleProjectNavigation}
          aria-current={isActive ? 'location' : undefined}
        >
          <span className={markerClassName} aria-hidden="true" />
          <span>{project.title}</span>
        </a>
      </li>
    )
  }

  const activeIndex = projects.findIndex((project) => project.id === activeProjectId)
  const activePosition = activeIndex === -1 ? 1 : activeIndex + 1
  const projectCount = projects.length
  const activeProject = projects[activeIndex === -1 ? 0 : activeIndex]

  return (
    <>
      <nav className={styles.timeline} aria-label="Project navigation">
        <ol className={styles.timelineList}>
          {projects.map((project) =>
            renderProjectItem(
              project,
              styles.timelineItem,
              styles.timelineLink,
              styles.timelineMarker,
            ),
          )}
        </ol>
      </nav>

      <nav
        ref={mobileNavRef}
        className={styles.mobileBarWrapper}
        aria-label="Project navigation, mobile"
      >
        <button
          ref={mobileBarToggleRef}
          type="button"
          className={styles.mobileBarToggle}
          aria-expanded={isJumpListOpen}
          aria-controls="mobile-project-navigation-list"
          aria-label={isJumpListOpen ? 'Collapse project list' : 'Expand project list'}
          onClick={() => setIsJumpListOpen((open) => !open)}
        >
          <span className={styles.mobileBarMarker} aria-hidden="true" />
          <span className={styles.mobileBarTitle}>{activeProject?.title}</span>
          <span className={styles.mobileBarPosition}>
            {activePosition}/{projectCount}
          </span>
          <ChevronIcon
            className={styles.mobileBarChevron}
            direction={isJumpListOpen ? 'up' : 'down'}
            aria-hidden="true"
          />
        </button>

        <div
          className={styles.mobileBackdrop}
          data-open={isJumpListOpen}
          aria-hidden="true"
          onClick={() => setIsJumpListOpen(false)}
        />

        <ol
          id="mobile-project-navigation-list"
          className={styles.mobileDropdownList}
          data-open={isJumpListOpen}
        >
          {projects
            .filter((project) => project.id !== activeProjectId)
            .map((project) =>
              renderProjectItem(
                project,
                styles.mobileDropdownItem,
                styles.mobileDropdownLink,
                styles.mobileDropdownMarker,
              ),
            )}
        </ol>
      </nav>
    </>
  )
}

export function shouldHandleProjectNavigation(
  event: MouseEvent<HTMLAnchorElement>,
  target: HTMLElement | null,
): target is HTMLElement {
  return (
    target !== null &&
    !event.defaultPrevented &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey
  )
}
