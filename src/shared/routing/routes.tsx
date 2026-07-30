import type { Route, RoutePath } from './types'

import { About } from '@/sections/About'
import { Blog } from '@/sections/Blog'
import { Projects } from '@/sections/Projects'
import { Questions } from '@/sections/Questions'

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
