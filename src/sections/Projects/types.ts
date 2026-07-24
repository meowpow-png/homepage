export type ProjectLink = {
  href: string
  label: string
}

export type Project = {
  description: string
  id: string
  links: ProjectLink[]
  status: string
  title: string
  year: number
}

export type ProjectsMetadata = {
  closing: string
  intro: string[]
  projects: Project[]
  title: string
}
