import type { OutputAsset, OutputBundle } from 'rollup'
import type { Plugin } from 'vite'
import { describe, expect, it } from 'vitest'

import { inlineStylesheet } from '../../../vite.plugins'

function runTransformIndexHtml(plugin: Plugin, html: string, bundle: OutputBundle) {
  const transform = plugin.transformIndexHtml as unknown as {
    handler: (this: unknown, html: string, ctx: { bundle: OutputBundle }) => unknown
  }
  return transform.handler.call({}, html, { bundle })
}

function cssAsset(source: string): OutputAsset {
  return {
    type: 'asset',
    fileName: 'assets/index-abc.css',
    name: undefined,
    names: [],
    originalFileName: null,
    originalFileNames: [],
    needsCodeReference: false,
    source,
  }
}

describe('inlineStylesheet', () => {
  const plugin = inlineStylesheet()

  it('replaces the stylesheet link with an inline style tag containing the built CSS', () => {
    const html =
      '<!doctype html>\n<html lang="en">\n  <head>\n    <link rel="stylesheet" crossorigin href="/assets/index-abc.css">\n  </head>\n</html>'
    const bundle = { 'assets/index-abc.css': cssAsset('body{margin:0}') }

    expect(runTransformIndexHtml(plugin, html, bundle)).toBe(
      '<!doctype html>\n<html lang="en">\n  <head>\n    <style>body{margin:0}</style>\n  </head>\n</html>',
    )
  })

  it('leaves the html untouched when there is no stylesheet link', () => {
    const html =
      '<!doctype html>\n<html lang="en">\n  <head>\n    <title>Homepage</title>\n  </head>\n</html>'

    expect(runTransformIndexHtml(plugin, html, {})).toBe(html)
  })

  it('leaves the html untouched when the referenced asset is missing from the bundle', () => {
    const html =
      '<!doctype html>\n<html lang="en">\n  <head>\n    <link rel="stylesheet" crossorigin href="/assets/index-abc.css">\n  </head>\n</html>'

    expect(runTransformIndexHtml(plugin, html, {})).toBe(html)
  })
})
