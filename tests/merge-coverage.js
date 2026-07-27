import { readFile } from 'node:fs/promises'
import MCR from 'monocart-coverage-reports'

import coverageOptions from './mcr.config.js'

const unitCoverage = JSON.parse(
    await readFile('tests/output/coverage/coverage-final.json', 'utf8'),
)

const mcr = MCR(coverageOptions)
await mcr.add(unitCoverage)
