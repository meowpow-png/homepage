import { execFileSync } from 'node:child_process'
import { statSync } from 'node:fs'
import { resolve } from 'node:path'
import { normalizePath, type Plugin } from 'vite'
import { flavors } from '@catppuccin/palette'

import { CATPPUCCIN_FLAVOR } from './src/shared/styles/catppuccinFlavor'
import { LANGUAGE_COLORS } from './src/sections/Projects/languages'

export function formatFileSize(bytes: number) {
  if (bytes < 1000) {
    return `${bytes} B`
  }

  return `${(bytes / 1000).toFixed(1)} KB`
}

function getFallbackDate(filePath: string): string {
  return statSync(filePath).mtime.toISOString().slice(0, 10)
}

export function getLastModifiedDate(filePath: string): string {
  try {
    const gitDate = execFileSync('git', ['log', '-1', '--format=%cs', '--', filePath], {
      encoding: 'utf8',
    }).trim()

    if (gitDate) {
      return gitDate
    }
  } catch {
    // not a git repo or git unavailable, fall back to mtime
  }

  return getFallbackDate(filePath)
}

export function getCreatedDate(filePath: string): string {
  try {
    // --follow + --reverse returns nothing combined with --diff-filter=A,
    // so read newest-first and grab the last line instead
    const gitDates = execFileSync(
      'git',
      ['log', '--diff-filter=A', '--follow', '--format=%cs', '--', filePath],
      { encoding: 'utf8' },
    )
      .trim()
      .split('\n')
      .filter(Boolean)

    if (gitDates.length > 0) {
      // length check above guarantees the last element exists
      return gitDates[gitDates.length - 1]!
    }
  } catch {
    // not a git repo or git unavailable, fall back to mtime
  }

  return getFallbackDate(filePath)
}

export function injectBlogPostFileSize(): Plugin {
  const blogDirectory = normalizePath(resolve('src/content/blog'))

  return {
    name: 'inject-blog-post-file-size',
    enforce: 'pre',
    transform(code, id) {
      // split(..., 1) always returns exactly one element
      const filePath = normalizePath(id.split('?', 1)[0]!)

      if (!filePath.startsWith(`${blogDirectory}/`) || !filePath.endsWith('.mdx')) {
        return null
      }

      const size = formatFileSize(Buffer.byteLength(code, 'utf8'))

      return {
        code: code.replace(/^---\r?\n/, (opening) => `${opening}size: ${size}\n`),
        map: null,
      }
    },
  }
}

export function injectBlogPostDates(): Plugin {
  const blogDirectory = normalizePath(resolve('src/content/blog'))

  return {
    name: 'inject-blog-post-dates',
    enforce: 'pre',
    transform(code, id) {
      // split(..., 1) always returns exactly one element
      const filePath = normalizePath(id.split('?', 1)[0]!)

      if (!filePath.startsWith(`${blogDirectory}/`) || !filePath.endsWith('.mdx')) {
        return null
      }

      const modifiedAt = getLastModifiedDate(filePath)
      const createdAt = getCreatedDate(filePath)

      return {
        code: code.replace(
          /^---\r?\n/,
          (opening) => `${opening}createdAt: ${createdAt}\nmodifiedAt: ${modifiedAt}\n`,
        ),
        map: null,
      }
    },
  }
}

export function validateProjectLanguages(): Plugin {
  const projectsDirectory = normalizePath(resolve('src/content/projects'))

  return {
    name: 'validate-project-languages',
    enforce: 'pre',
    transform(code, id) {
      // split(..., 1) always returns exactly one element
      const filePath = normalizePath(id.split('?', 1)[0]!)

      if (!filePath.startsWith(`${projectsDirectory}/`) || !filePath.endsWith('.mdx')) {
        return null
      }
      const frontmatterMatch = code.match(/^---\r?\n([\s\S]*?)\r?\n---/)
      // regex has one required capture group, so index 1 always exists when matched
      const languagesMatch = frontmatterMatch?.[1]!.match(/^languages:\s*\n((?:\s*-\s*.+\n?)+)/m)
      if (!languagesMatch) {
        return null
      }
      const languages = languagesMatch[1]!
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => line.replace(/^-\s*/, ''))

      const unknown = languages.filter((language) => !(language.toLowerCase() in LANGUAGE_COLORS))
      if (unknown.length > 0) {
        throw new Error(
          `${filePath}: unknown language(s) "${unknown.join(', ')}". ` +
            'Add them to src/sections/Projects/languages.ts or fix the typo.',
        )
      }
      return null
    },
  }
}

export function mermaidCatppuccinTheme(): Plugin {
  const virtualModuleId = 'virtual:mermaid-theme'
  const resolvedVirtualModuleId = `\0${virtualModuleId}`

  return {
    name: 'mermaid-catppuccin-theme',
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
      return undefined
    },
    load(id) {
      if (id !== resolvedVirtualModuleId) {
        return
      }
      const { colors } = flavors[CATPPUCCIN_FLAVOR]

      const mermaidTheme = {
        base: colors.base.hex,
        mantle: colors.mantle.hex,
        surface0: colors.surface0.hex,
        surface1: colors.surface1.hex,
        surface2: colors.surface2.hex,
        text: colors.text.hex,
        subtext1: colors.subtext1.hex,
        blue: colors.blue.hex,
      }
      return `export const mermaidTheme = ${JSON.stringify(mermaidTheme)}`
    },
  }
}
