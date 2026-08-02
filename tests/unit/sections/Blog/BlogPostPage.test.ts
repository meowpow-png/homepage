import { isValidElement } from 'react'
import { describe, expect, it } from 'vitest'

import { formatPublishedAt, PostLink } from '@/sections/Blog/BlogPostPage'
import { Link } from '@/shared/routing'

describe('formatPublishedAt', () => {
  it('formats a date as "Mon D, YYYY"', () => {
    expect(formatPublishedAt('2024-01-15T10:30')).toBe('Jan 15, 2024')
  })

  it('formats the year boundary correctly', () => {
    expect(formatPublishedAt('2024-12-31T23:59')).toBe('Dec 31, 2024')
    expect(formatPublishedAt('2024-01-01T00:00')).toBe('Jan 1, 2024')
  })
})

describe('PostLink', () => {
  it('renders a plain anchor when there is no href', () => {
    const result = PostLink({ children: 'footnote' })

    expect(isValidElement(result)).toBe(true)
    expect(result.type).toBe('a')
  })

  it('renders the routing Link when an href is present', () => {
    const result = PostLink({ href: '/blog/some-post', children: 'some post' })

    expect(isValidElement(result)).toBe(true)
    expect(result.type).toBe(Link)
    expect(result.props.href).toBe('/blog/some-post')
  })
})
