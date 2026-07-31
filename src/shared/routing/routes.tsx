import { lazy } from 'react'

import type { Route, RoutePath } from './types'

const About = lazy(() => import('@/sections/About').then((module) => ({ default: module.About })))
const Blog = lazy(() => import('@/sections/Blog').then((module) => ({ default: module.Blog })))
const Projects = lazy(() =>
  import('@/sections/Projects').then((module) => ({ default: module.Projects })),
)
const Questions = lazy(() =>
  import('@/sections/Questions').then((module) => ({ default: module.Questions })),
)

export const routes = {
  '/about': {
    currentPage: 'about',
    title: 'Marin',
    description: "I enjoy building software that makes other developers' lives a little easier.",
    render: () => <About />,
  },
  '/projects': {
    currentPage: 'projects',
    title: 'Projects',
    description: "A collection of things I've built.",
    render: () => <Projects />,
  },
  '/blog': {
    currentPage: 'blog',
    title: 'Blog',
    description: 'Thoughts, experiments and stories from projects.',
    render: () => <Blog />,
  },
  '/questions': {
    currentPage: 'questions',
    title: 'Questions',
    description: "Questions nobody asked, but I'm answering anyway.",
    render: () => <Questions />,
  },
} satisfies Record<RoutePath, Route>
