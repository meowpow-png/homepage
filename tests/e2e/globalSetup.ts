import { rm } from 'node:fs/promises'

export default async function globalSetup(): Promise<void> {
  await rm('tests/output/coverage/e2e', { recursive: true, force: true })
}
