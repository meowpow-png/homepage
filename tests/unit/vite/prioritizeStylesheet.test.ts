import type { Plugin } from 'vite'
import { describe, expect, it } from 'vitest'

import { prioritizeStylesheet } from '../../../vite.plugins'

function runTransformIndexHtml(plugin: Plugin, html: string) {
  const transform = plugin.transformIndexHtml as {
    handler: (this: unknown, html: string) => unknown
  }
  return transform.handler.call({}, html)
}

describe('prioritizeStylesheet', () => {
  const plugin = prioritizeStylesheet()

  it('moves the stylesheet link to the front of head, ahead of script and modulepreload tags', () => {
    const html =
      '<!doctype html>\n<html lang="en">\n  <head>\n    <script type="module" crossorigin src="/assets/index-abc.js"></script>\n    <link rel="modulepreload" crossorigin href="/assets/chunk-abc.js">\n    <link rel="stylesheet" crossorigin href="/assets/index-abc.css">\n  </head>\n</html>'

    expect(runTransformIndexHtml(plugin, html)).toBe(
      '<!doctype html>\n<html lang="en">\n  <head>\n    <link rel="stylesheet" crossorigin href="/assets/index-abc.css">\n    <script type="module" crossorigin src="/assets/index-abc.js"></script>\n    <link rel="modulepreload" crossorigin href="/assets/chunk-abc.js">\n  </head>\n</html>',
    )
  })

  it('leaves the html untouched when there is no stylesheet link', () => {
    const html =
      '<!doctype html>\n<html lang="en">\n  <head>\n    <title>Homepage</title>\n  </head>\n</html>'

    expect(runTransformIndexHtml(plugin, html)).toBe(html)
  })
})
