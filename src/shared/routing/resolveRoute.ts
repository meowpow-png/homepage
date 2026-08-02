import { routes } from './routes'
import { dynamicRoutes } from './dynamicRoutes'
import type { Route, RoutePath } from './types'

export function resolveRoute(path: string): Route | undefined {
  if (path in routes) {
    return routes[path as RoutePath]
  }

  for (const match of dynamicRoutes) {
    const route = match(path)

    if (route) {
      return route
    }
  }
  return undefined
}
