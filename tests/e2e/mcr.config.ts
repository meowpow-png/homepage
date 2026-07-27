export default {
    name: 'E2E Coverage Report',
    outputDir: 'tests/output/coverage-e2e',
    reports: ['v8', 'raw'],
    entryFilter: {
        '**/src/**': true,
    },
}
