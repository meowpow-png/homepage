import { describe, expect, it } from 'vitest'

import { formatPublishedAt } from '@/sections/Blog/BlogPostPage'

describe('formatPublishedAt', () => {
  it('formats a date as "Mon D, YYYY"', () => {
    expect(formatPublishedAt('2024-01-15T10:30')).toBe('Jan 15, 2024')
  })

  it('formats the year boundary correctly', () => {
    expect(formatPublishedAt('2024-12-31T23:59')).toBe('Dec 31, 2024')
    expect(formatPublishedAt('2024-01-01T00:00')).toBe('Jan 1, 2024')
  })
})
