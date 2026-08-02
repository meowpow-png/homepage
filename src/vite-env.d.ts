/// <reference types="vite/client" />

declare const __APP_VERSION__: string

declare module '*.mdx' {
  import type { ComponentType } from 'react'
  export const metadata: Record<string, unknown>

  const MDXContent: ComponentType<{
    components?: Record<string, unknown>
  }>
  export default MDXContent
}

declare module '*.svg?react' {
  import type { FC, SVGProps } from 'react'

  const Component: FC<SVGProps<SVGSVGElement>>

  export default Component
}

declare module 'virtual:blog-metadata' {
  export const blogMetadata: Array<{
    createdAt: string
    description: string
    filename: string
    modifiedAt: string
    publishedAt: string
    size: string
    slug: string
    title: string
  }>
}
