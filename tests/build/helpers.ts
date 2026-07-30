import { access, readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'

const DIST = 'dist'

export function readDistFile(relativePath: string): Promise<string> {
  return readFile(join(DIST, relativePath), 'utf8')
}

export async function distFileExists(relativePath: string): Promise<boolean> {
  try {
    await access(join(DIST, relativePath))
    return true
  } catch {
    return false
  }
}

export async function listDistHtmlFiles(dir = '.'): Promise<string[]> {
  const entries = await readdir(join(DIST, dir), { withFileTypes: true })
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = join(dir, entry.name)

      if (entry.isDirectory()) {
        return listDistHtmlFiles(entryPath)
      }
      return entry.name.endsWith('.html') ? [entryPath] : []
    }),
  )
  return nested.flat()
}
