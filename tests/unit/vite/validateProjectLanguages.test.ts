import { resolve } from 'node:path'
import { normalizePath, type Plugin } from 'vite'
import { describe, expect, it } from 'vitest'

import { validateProjectLanguages } from '../../../vite.plugins'

function runTransform(plugin: Plugin, code: string, id: string) {
  const transform = plugin.transform as (this: unknown, code: string, id: string) => unknown
  return transform.call({}, code, id)
}

const projectsDir = normalizePath(resolve('src/content/projects'))
const id = `${projectsDir}/example.mdx`

describe('validateProjectLanguages', () => {
  const plugin = validateProjectLanguages()

  it('allows known languages', () => {
    const code = '---\ntitle: Test\nlanguages:\n  - go\n  - java\n---\ncontent'

    expect(runTransform(plugin, code, id)).toBeNull()
  })

  it('throws on an unknown language', () => {
    const code = '---\ntitle: Test\nlanguages:\n  - rust\n---\ncontent'

    expect(() => runTransform(plugin, code, id)).toThrow(/unknown language\(s\) "rust"/)
  })

  it('ignores files without a languages field', () => {
    const code = '---\ntitle: Test\n---\ncontent'

    expect(runTransform(plugin, code, id)).toBeNull()
  })

  it('ignores files outside the projects directory', () => {
    const code = '---\ntitle: Test\nlanguages:\n  - rust\n---\ncontent'
    const blogId = `${normalizePath(resolve('src/content/blog'))}/example.mdx`

    expect(runTransform(plugin, code, blogId)).toBeNull()
  })
})
