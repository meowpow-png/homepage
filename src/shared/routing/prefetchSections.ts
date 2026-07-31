import { sectionLoaders } from './routes'

export type IdleScheduler = (callback: () => void) => void

export const defaultIdleSchedule: IdleScheduler = (callback) => {
  if (typeof requestIdleCallback === 'function') {
    requestIdleCallback(callback)
    return
  }
  setTimeout(callback, 1)
}

// fetches every section's chunk at low priority once the browser is idle, so
// navigating to one later resolves from cache instead of a fresh fetch
export function prefetchOnIdle(
  loaders: Array<() => unknown>,
  schedule: IdleScheduler = defaultIdleSchedule,
): void {
  schedule(() => {
    for (const load of loaders) {
      load()
    }
  })
}

export function prefetchSections(schedule?: IdleScheduler): void {
  prefetchOnIdle(Object.values(sectionLoaders), schedule)
}
