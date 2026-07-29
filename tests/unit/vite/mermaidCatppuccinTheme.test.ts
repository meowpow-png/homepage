import type { Plugin } from 'vite'
import { describe, expect, it } from 'vitest'

import { mermaidCatppuccinTheme } from '../../../vite.plugins'

function callResolveId(plugin: Plugin, id: string) {
  const resolveId = plugin.resolveId as (this: unknown, id: string) => unknown
  return resolveId.call({}, id)
}

function callLoad(plugin: Plugin, id: string) {
  const load = plugin.load as (this: unknown, id: string) => unknown
  return load.call({}, id)
}

const virtualModuleId = 'virtual:mermaid-theme'
const resolvedVirtualModuleId = `\0${virtualModuleId}`

describe('mermaidCatppuccinTheme', () => {
  const plugin = mermaidCatppuccinTheme()

  describe('resolveId', () => {
    it('resolves the virtual module id', () => {
      expect(callResolveId(plugin, virtualModuleId)).toBe(resolvedVirtualModuleId)
    })

    it('ignores other ids', () => {
      expect(callResolveId(plugin, 'something-else')).toBeUndefined()
    })
  })

  describe('load', () => {
    it('exports a mermaidTheme object built from the catppuccin palette for the resolved id', () => {
      const result = callLoad(plugin, resolvedVirtualModuleId) as string

      expect(result).toMatch(/^export const mermaidTheme = /)

      const theme = JSON.parse(result.replace('export const mermaidTheme = ', ''))
      expect(theme).toMatchObject({
        base: expect.stringMatching(/^#/),
        mantle: expect.stringMatching(/^#/),
        surface0: expect.stringMatching(/^#/),
        surface1: expect.stringMatching(/^#/),
        surface2: expect.stringMatching(/^#/),
        text: expect.stringMatching(/^#/),
        subtext1: expect.stringMatching(/^#/),
        blue: expect.stringMatching(/^#/),
      })
    })

    it('ignores other ids', () => {
      expect(callLoad(plugin, 'something-else')).toBeUndefined()
    })
  })
})
