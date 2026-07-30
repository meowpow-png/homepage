import type { Plugin } from 'vite'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { blockNonProductionIndexing } from '../../../vite.plugins'

function runTransformIndexHtml(plugin: Plugin, html: string) {
  const transformIndexHtml = plugin.transformIndexHtml as (this: unknown, html: string) => unknown
  return transformIndexHtml.call({}, html)
}

const html =
  '<!doctype html>\n<html lang="en">\n  <head>\n    <title>Homepage</title>\n  </head>\n</html>'

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('blockNonProductionIndexing', () => {
  const plugin = blockNonProductionIndexing()

  it('injects a noindex meta tag when not building for production', () => {
    vi.stubEnv('VERCEL_ENV', 'preview')

    expect(runTransformIndexHtml(plugin, html)).toBe(
      '<!doctype html>\n<html lang="en">\n  <head>\n    <meta content="noindex, nofollow" name="robots" />\n    <title>Homepage</title>\n  </head>\n</html>',
    )
  })

  it('leaves the html untouched when building for production', () => {
    vi.stubEnv('VERCEL_ENV', 'production')

    expect(runTransformIndexHtml(plugin, html)).toBe(html)
  })

  it('injects a noindex meta tag when VERCEL_ENV is unset (local builds)', () => {
    vi.stubEnv('VERCEL_ENV', undefined)

    expect(runTransformIndexHtml(plugin, html)).toContain(
      '<meta content="noindex, nofollow" name="robots" />',
    )
  })
})
