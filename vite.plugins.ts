import { execFileSync } from 'node:child_process'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { normalizePath, type Plugin } from 'vite'
import { parse as parseYaml } from 'yaml'
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

const FRONTMATTER_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---/

// reads frontmatter directly off disk rather than through the mdx compiler, so
// listing post metadata never imports (and bundles) a post's rendered content
export function readBlogMetadata(blogDirectory: string) {
  return readdirSync(blogDirectory)
    .filter((filename) => filename.endsWith('.mdx'))
    .map((filename) => {
      const filePath = join(blogDirectory, filename)
      const source = readFileSync(filePath, 'utf8')
      const frontmatter = source.match(FRONTMATTER_PATTERN)?.[1] ?? ''

      return {
        ...(parseYaml(frontmatter) as Record<string, unknown>),
        filename,
        size: formatFileSize(Buffer.byteLength(source, 'utf8')),
        createdAt: getCreatedDate(filePath),
        modifiedAt: getLastModifiedDate(filePath),
      }
    })
}

export function blogMetadataModule(): Plugin {
  const virtualModuleId = 'virtual:blog-metadata'
  const resolvedVirtualModuleId = `\0${virtualModuleId}`
  const blogDirectory = normalizePath(resolve('src/content/blog'))

  return {
    name: 'blog-metadata-module',
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
      const metadata = readBlogMetadata(blogDirectory)

      for (const post of metadata) {
        this.addWatchFile(join(blogDirectory, post.filename as string))
      }

      return `export const blogMetadata = ${JSON.stringify(metadata)}`
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

export function blockNonProductionIndexing(): Plugin {
  return {
    name: 'block-non-production-indexing',
    transformIndexHtml(html) {
      // only real non-production Vercel deployments (staging, previews) get this.
      // VERCEL_ENV is unset for local dev/builds, which should behave like production
      if (!process.env.VERCEL_ENV || process.env.VERCEL_ENV === 'production') {
        return html
      }
      return html.replace(
        '<head>',
        '<head>\n    <meta content="noindex, nofollow" name="robots" />',
      )
    },
  }
}

export function inlineStylesheet(): Plugin {
  return {
    name: 'inline-stylesheet',
    transformIndexHtml: {
      // needs the finished bundle to read the built CSS file's contents
      order: 'post',
      handler(html, ctx) {
        const stylesheetMatch = html.match(
          /[ \t]*<link rel="stylesheet"[^>]*href="\/([^"]+)"[^>]*>\n?/,
        )
        if (!stylesheetMatch) return html

        // a <link rel="stylesheet"> always blocks first paint until fetched,
        // regardless of where it sits in <head>; inlining removes that
        // network round-trip entirely, which reordering alone can't do
        const [stylesheetLine, fileName] = stylesheetMatch
        const cssAsset = ctx.bundle?.[fileName!]
        if (!cssAsset || cssAsset.type !== 'asset') return html

        return html.replace(stylesheetLine, `    <style>${cssAsset.source}</style>\n`)
      },
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
