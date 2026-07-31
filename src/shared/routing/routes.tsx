import { lazy } from 'react'

import type { Route, RoutePath } from './types'

// shared with prefetchSections, so warming the cache for the other three
// sections can't drift from what these routes actually lazy-load
export const sectionLoaders = {
  about: () => import('@/sections/About').then((module) => ({ default: module.About })),
  blog: () => import('@/sections/Blog').then((module) => ({ default: module.Blog })),
  projects: () => import('@/sections/Projects').then((module) => ({ default: module.Projects })),
  questions: () => import('@/sections/Questions').then((module) => ({ default: module.Questions })),
}

const About = lazy(sectionLoaders.about)
const Blog = lazy(sectionLoaders.blog)
const Projects = lazy(sectionLoaders.projects)
const Questions = lazy(sectionLoaders.questions)

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
