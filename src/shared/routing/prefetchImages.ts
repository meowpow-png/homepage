import { defaultIdleSchedule, prefetchOnIdle } from './prefetchSections'
import type { IdleScheduler } from './prefetchSections'

import art404 from '@/shared/assets/images/404.webp'
import dashboard from '@/shared/assets/images/dashboard.webp'
import hexagonalArchitecture from '@/shared/assets/images/hexagonal-architecture.svg'
import loginPage from '@/shared/assets/images/login-page.webp'
import resilienceTestingRig from '@/shared/assets/images/resilience-testing-rig.svg'

const imageUrls = [art404, loginPage, dashboard, hexagonalArchitecture, resilienceTestingRig]

// kept alive so the browser can't GC the Image mid-request,
// which would abort the load before it's actually prewarmed
const keepAlive: HTMLImageElement[] = []

// decode images used off current route, so landing on them
// later reuses the decoded bitmap instead of paying decode cost on mount
export function prefetchImage(url: string): Promise<void> {
  const image = new Image()
  keepAlive.push(image)
  image.src = url
  return image.decode().catch(() => {})
}

export function prefetchImages(schedule: IdleScheduler = defaultIdleSchedule): void {
  prefetchOnIdle(
    imageUrls.map((url) => () => prefetchImage(url)),
    schedule,
  )
}
