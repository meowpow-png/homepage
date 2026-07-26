import type {ComponentType} from 'react'

import {getMetadata} from '@/content/getMetadata'

export interface ProjectLink {
    href: string
    label: string
}

export interface ProjectMetadata {
    date: string
    id: string
    links: ProjectLink[]
    status: string
    title: string
}

interface ProjectModule {
    default: ComponentType<{components?: Record<string, unknown>}>
    metadata: Record<string, unknown>
}

function toProject(module: ProjectModule) {
    return {
        Content: module.default,
        metadata: getMetadata<ProjectMetadata>(module.metadata),
    }
}

function byDateDescending(
    a: {metadata: ProjectMetadata},
    b: {metadata: ProjectMetadata},
): number {
    return b.metadata.date.localeCompare(a.metadata.date)
}

const modules = import.meta.glob<ProjectModule>('./*.mdx', {eager: true})

export const projects = Object.values(modules)
    .map(toProject)
    .sort(byDateDescending)
