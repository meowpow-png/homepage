import { useEffect, useState } from 'react'

export function useActiveProject(projectIds: string[]) {
  const [activeProjectId, setActiveProjectId] = useState(projectIds[0] ?? '')

  useEffect(() => {
    const projects = projectIds
      .map((projectId) => document.getElementById(projectId))
      .filter((project): project is HTMLElement => project !== null)

    if (projects.length === 0) {
      return
    }

    let animationFrame = 0

    const updateActiveProject = () => {
      const viewportMidpoint = window.innerHeight / 2
      const activeProject = projects.reduce(
        (currentProject, project) =>
          project.getBoundingClientRect().top <= viewportMidpoint ? project : currentProject,
        projects[0],
      )

      setActiveProjectId(activeProject.id)
    }

    const scheduleUpdate = () => {
      window.cancelAnimationFrame(animationFrame)
      animationFrame = window.requestAnimationFrame(updateActiveProject)
    }

    scheduleUpdate()
    window.addEventListener('resize', scheduleUpdate)
    window.addEventListener('scroll', scheduleUpdate, { passive: true })

    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', scheduleUpdate)
      window.removeEventListener('scroll', scheduleUpdate)
    }
  }, [projectIds])

  return activeProjectId
}
