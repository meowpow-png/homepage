import { describe, expect, it, vi } from 'vitest'

import { defaultIdleSchedule, prefetchOnIdle, prefetchSections } from '@/shared/routing'

describe('prefetchOnIdle', () => {
  it('invokes every loader once the schedule fires', () => {
    const loaders = [vi.fn(), vi.fn(), vi.fn()]
    const schedule = (callback: () => void) => callback()

    prefetchOnIdle(loaders, schedule)

    for (const loader of loaders) {
      expect(loader).toHaveBeenCalledOnce()
    }
  })

  it('does not invoke loaders before the schedule fires', () => {
    const loaders = [vi.fn()]
    const schedule = vi.fn()

    prefetchOnIdle(loaders, schedule)

    expect(loaders[0]).not.toHaveBeenCalled()
    expect(schedule).toHaveBeenCalledOnce()
  })
})

describe('defaultIdleSchedule', () => {
  it('uses requestIdleCallback when available', () => {
    const requestIdleCallback = vi.fn()
    vi.stubGlobal('requestIdleCallback', requestIdleCallback)

    const callback = () => {}
    defaultIdleSchedule(callback)

    expect(requestIdleCallback).toHaveBeenCalledWith(callback)

    vi.unstubAllGlobals()
  })

  it('falls back to setTimeout when requestIdleCallback is unavailable', () => {
    vi.stubGlobal('requestIdleCallback', undefined)
    vi.useFakeTimers()
    const callback = vi.fn()

    defaultIdleSchedule(callback)
    vi.runAllTimers()

    expect(callback).toHaveBeenCalledOnce()

    vi.useRealTimers()
    vi.unstubAllGlobals()
  })
})

describe('prefetchSections', () => {
  it('schedules prefetching of the section loaders', () => {
    const schedule = vi.fn()

    prefetchSections(schedule)

    expect(schedule).toHaveBeenCalledOnce()
  })
})
