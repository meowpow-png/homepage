import {getMetadata} from '@/content/getMetadata'

import WifiAdminContent, {metadata as wifiAdminMetadata} from './wifi-admin.mdx'
import TaskRunnerContent, {metadata as taskRunnerMetadata} from './task-runner.mdx'
import DotfilesContent, {metadata as dotfilesMetadata} from './dotfiles.mdx'
import ReleaseMonitorContent, {metadata as releaseMonitorMetadata} from './release-monitor.mdx'

export interface ProjectLink {
    href: string
    label: string
}

export interface ProjectMetadata {
    id: string
    links: ProjectLink[]
    status: string
    title: string
    year: number
}

export const projects = [
    {
        Content: WifiAdminContent,
        metadata: getMetadata<ProjectMetadata>(wifiAdminMetadata)
    },
    {
        Content: TaskRunnerContent,
        metadata: getMetadata<ProjectMetadata>(taskRunnerMetadata)
    },
    {
        Content: DotfilesContent,
        metadata: getMetadata<ProjectMetadata>(dotfilesMetadata)
    },
    {
        Content: ReleaseMonitorContent,
        metadata: getMetadata<ProjectMetadata>(releaseMonitorMetadata)
    },
] as const
