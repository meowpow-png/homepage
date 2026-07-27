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
    pinIndex?: number
    pinned?: boolean
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

function byPinnedThenDate(
    a: {metadata: ProjectMetadata},
    b: {metadata: ProjectMetadata},
): number {
    const aPinned = a.metadata.pinned ?? false
    const bPinned = b.metadata.pinned ?? false

    if (aPinned !== bPinned) {
        return aPinned ? -1 : 1
    }
    if (aPinned && bPinned) {
        const aIndex = a.metadata.pinIndex ?? Number.MAX_SAFE_INTEGER
        const bIndex = b.metadata.pinIndex ?? Number.MAX_SAFE_INTEGER

        if (aIndex !== bIndex) {
            return aIndex - bIndex
        }
    }
    return byDateDescending(a, b)
}

const modules = import.meta.glob<ProjectModule>('./*.mdx', {eager: true})

export const projects = Object.values(modules)
    .map(toProject)
    .sort(byPinnedThenDate)
