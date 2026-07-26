/// <reference types="vite/client" />

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
