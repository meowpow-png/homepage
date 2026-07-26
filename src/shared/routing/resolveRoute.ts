import {routes} from './routes'
import type {Route, RoutePath} from './types'

export function resolveRoute(path: string): Route {
    if (path in routes) {
        return routes[path as RoutePath]
    }
    return routes['/about']
}
