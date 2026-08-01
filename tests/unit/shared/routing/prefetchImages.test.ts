import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { prefetchImage, prefetchImages } from '@/shared/routing'

let instances: FakeImage[]

class FakeImage {
  src = ''
  decode = vi.fn().mockResolvedValue(undefined)

  constructor() {
    instances.push(this)
  }
}

beforeEach(() => {
  instances = []
  vi.stubGlobal('Image', FakeImage)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('prefetchImage', () => {
  it('sets src and decodes the image', async () => {
    await prefetchImage('/some/image.webp')

    expect(instances).toHaveLength(1)
    const [instance] = instances
    expect(instance?.src).toBe('/some/image.webp')
    expect(instance?.decode).toHaveBeenCalledOnce()
  })

  it('does not throw when decode rejects', async () => {
    class RejectingImage extends FakeImage {
      override decode = vi.fn().mockRejectedValue(new Error('aborted'))
    }
    vi.stubGlobal('Image', RejectingImage)

    await expect(prefetchImage('/some/image.webp')).resolves.toBeUndefined()
  })
})

describe('prefetchImages', () => {
  it('schedules prefetching of the registered images', () => {
    const schedule = vi.fn()

    prefetchImages(schedule)

    expect(schedule).toHaveBeenCalledOnce()
  })
})
