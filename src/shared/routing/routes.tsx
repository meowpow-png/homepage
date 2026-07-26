import type {Route, RoutePath} from './types'

import {About, Blog, Projects, Questions,} from '@/sections'

export const routes = {
    '/about': {
        currentPage: 'about',
        render: () => <About/>,
    },
    '/projects': {
        currentPage: 'projects',
        render: () => <Projects/>,
    },
    '/blog': {
        currentPage: 'blog',
        render: () => <Blog/>,
    },
    '/questions': {
        currentPage: 'questions',
        render: () => <Questions/>,
    },
} satisfies Record<RoutePath, Route>
