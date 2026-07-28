import { describe, expect, it } from 'vitest'

import { normalizePathname } from '@/shared/routing'

describe('normalizePathname', () => {
  it('normalizes the root path to /about', () => {
    expect(normalizePathname('/')).toBe('/about')
  })

  it('leaves other paths unchanged', () => {
    expect(normalizePathname('/projects')).toBe('/projects')
    expect(normalizePathname('/blog/some-post')).toBe('/blog/some-post')
  })
})
