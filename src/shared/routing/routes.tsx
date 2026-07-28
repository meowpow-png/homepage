import type { Route, RoutePath } from './types'

import { About } from '@/sections/About'
import { Blog } from '@/sections/Blog'
import { Projects } from '@/sections/Projects'
import { Questions } from '@/sections/Questions'

export const routes = {
  '/about': {
    currentPage: 'about',
    render: () => <About />,
  },
  '/projects': {
    currentPage: 'projects',
    render: () => <Projects />,
  },
  '/blog': {
    currentPage: 'blog',
    render: () => <Blog />,
  },
  '/questions': {
    currentPage: 'questions',
    render: () => <Questions />,
  },
} satisfies Record<RoutePath, Route>
