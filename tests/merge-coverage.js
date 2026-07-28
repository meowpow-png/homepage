import { readdir, readFile } from 'node:fs/promises'
import libCoverage from 'istanbul-lib-coverage'
import { createContext } from 'istanbul-lib-report'
import { create } from 'istanbul-reports'

const coverageMap = libCoverage.createCoverageMap({})

async function addCoverageFile(path) {
  const data = JSON.parse(await readFile(path, 'utf8'))
  coverageMap.merge(data)
}

await addCoverageFile('tests/output/coverage/coverage-final.json')

const e2eDir = 'tests/output/coverage-e2e/raw'
for (const file of await readdir(e2eDir)) {
  await addCoverageFile(`${e2eDir}/${file}`)
}

const context = createContext({
  dir: 'tests/output/coverage-combined',
  coverageMap,
})

create('text').execute(context)
create('html').execute(context)
