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

const unitMap = libCoverage.createCoverageMap({})
unitMap.merge(await readCoverageFile('tests/output/coverage/coverage-final.json'))

const e2eMap = await readCoverageDir('tests/output/coverage-e2e/raw')
report(e2eMap, 'tests/output/coverage-e2e', ['json-summary'])

const combinedMap = libCoverage.createCoverageMap({})
combinedMap.merge(unitMap)
combinedMap.merge(e2eMap)
report(combinedMap, 'tests/output/coverage-combined', ['text', 'html', 'json-summary'])
