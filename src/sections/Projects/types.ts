export interface ProjectLink {
    href: string
    label: string
}

export interface Project {
    description: string
    id: string
    links: ProjectLink[]
    status: string
    title: string
    year: number
}

export interface ProjectsMetadata {
    closing: string
    intro: string[]
    projects: Project[]
    title: string
}
