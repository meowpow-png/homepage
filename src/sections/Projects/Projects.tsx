import type {JSX} from "react";

import {metadata} from '@/content/projects.mdx'

import {getMetadata} from '@/content/getMetadata'
import {ProjectEntry} from './ProjectEntry'
import {ProjectTimeline} from './ProjectTimeline'
import {useActiveProject} from './useActiveProject'
import type {ProjectsMetadata} from './types'

import styles from './Projects.module.css'

const projectsMetadata = getMetadata<ProjectsMetadata>(metadata)
const projectIds = projectsMetadata.projects.map(({id}) => id)

export function Projects(): JSX.Element {
    const {closing, intro, projects, title} = projectsMetadata
    const activeProjectId = useActiveProject(projectIds)

    return (
        <section
            className={styles.projects}
            aria-labelledby="projects-heading"
        >
            <header className={styles.introduction}>
                <h1
                    className={styles.heading}
                    id="projects-heading"
                >
                    {title}
                </h1>
                <div className={styles.introCopy}>
                    {intro.map((text) => (
                        <p key={text}>{text}</p>
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
                        <ProjectEntry
                            key={project.id}
                            project={project}
                        />
                    ))}
                    <div className={styles.moreProjects}>
                        <p
                            className={styles.moreProjectsMarker}
                            aria-hidden="true"
                        >
                            ...
                        </p>
                        <p>{closing}</p>
                    </div>
                </div>
            </div>
        </section>
    )
}