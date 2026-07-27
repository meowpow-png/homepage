import MCR from 'monocart-coverage-reports'

import coverageOptions from './mcr.config'

export default async function globalTeardown(): Promise<void> {
    const mcr = MCR(coverageOptions)
    await mcr.generate()
}
