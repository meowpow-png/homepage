import { createReporter, STAGING_URL } from './staging-check.js'

const { report, summarize } = createReporter()

async function checkUnknownPath(path) {
  const response = await fetch(`${STAGING_URL}${path}`)
  report(`Unknown path ${path}`, response.status === 404, 404, response.status)
}

await checkUnknownPath('/this-page-does-not-exist')
await checkUnknownPath('/blog/this-post-does-not-exist')

summarize()
