import { createReporter, STAGING_URL } from './staging-check.js'

const { report, summarize } = createReporter()

async function checkRedirectsTo(from, expectedUrl) {
  const response = await fetch(from)
  const actual = response.redirected ? response.url : `no redirect (${response.status})`
  report(`Redirect from ${from}`, actual === expectedUrl, expectedUrl, actual)
}

// noinspection HttpUrlsUsage
await checkRedirectsTo(STAGING_URL.replace('https://', 'http://'), `${STAGING_URL}/`)
await checkRedirectsTo(`${STAGING_URL}/about/`, `${STAGING_URL}/about`)
await checkRedirectsTo(`${STAGING_URL}/projects/`, `${STAGING_URL}/projects`)

summarize()
