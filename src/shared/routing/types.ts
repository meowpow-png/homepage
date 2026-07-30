import type { ReactNode } from 'react'

export type NavigationPage = 'about' | 'projects' | 'blog' | 'questions'

export type RoutePath = '/about' | '/projects' | '/blog' | '/questions'

export interface Route {
  currentPage: NavigationPage
  title: string
  description: string

  render(): ReactNode
}

export interface Navigation {
  pathname: string

  navigate(pathname: string): void
}

export interface RouterContextValue {
  navigate: Navigation['navigate']
}
