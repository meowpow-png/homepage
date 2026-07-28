import { readdir, readFile } from 'node:fs/promises'
import libCoverage from 'istanbul-lib-coverage'
import { createContext } from 'istanbul-lib-report'
import { create } from 'istanbul-reports'

async function readCoverageFile(path) {
  return JSON.parse(await readFile(path, 'utf8'))
}

async function readCoverageDir(dir) {
  const map = libCoverage.createCoverageMap({})
  for (const file of await readdir(dir)) {
    map.merge(await readCoverageFile(`${dir}/${file}`))
  }
  return map
}

function report(coverageMap, dir, reporters) {
  const context = createContext({ dir, coverageMap })
  for (const reporter of reporters) {
    create(reporter).execute(context)
  }
}

// e2e only instruments files the browser loads, so seed unit's
// full file set as a zeroed baseline first, or e2e-only coverage
// measures against its own subset, not src/
function zeroedBaseline(coverageMap) {
  const baseline = libCoverage.createCoverageMap({})
  for (const filePath of coverageMap.files()) {
    const file = coverageMap.fileCoverageFor(filePath).toJSON()
    const zero = (counts) => Object.fromEntries(Object.keys(counts).map((key) => [key, 0]))
    baseline.addFileCoverage({
      ...file,
      s: zero(file.s),
      f: zero(file.f),
      b: Object.fromEntries(Object.entries(file.b).map(([key, arr]) => [key, arr.map(() => 0)])),
    })
  }
  return baseline
}

const unitMap = libCoverage.createCoverageMap({})
unitMap.merge(await readCoverageFile('tests/output/coverage/coverage-final.json'))

const e2eMap = zeroedBaseline(unitMap)
e2eMap.merge(await readCoverageDir('tests/output/coverage-e2e/raw'))
report(e2eMap, 'tests/output/coverage-e2e', ['json-summary'])

const combinedMap = libCoverage.createCoverageMap({})
combinedMap.merge(unitMap)
combinedMap.merge(e2eMap)
report(combinedMap, 'tests/output/coverage-combined', ['text', 'html', 'json-summary'])
