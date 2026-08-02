export const STAGING_URL = 'https://staging.meowpow.dev'

// keeps pass/fail counts scoped per script
export function createReporter() {
  let passes = 0
  let failures = 0

  function report(name, passed, expected, actual) {
    if (passed) {
      passes += 1
      return
    }
    console.log(`❌ ${name}`)
    console.log(`  - Expected: ${expected}`)
    console.log(`  - Actual: ${actual}`)
    failures += 1
  }

  function summarize() {
    if (passes > 0) {
      console.log(`✅ ${passes} check(s) passed`)
    }
    if (failures > 0) {
      console.error(`❌ ${failures} check(s) failed`)
      process.exit(1)
    }
  }
  return { report, summarize }
}
