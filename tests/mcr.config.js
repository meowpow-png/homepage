export default {
    name: 'Combined Coverage Report',
    outputDir: 'tests/output/coverage-combined',
    reports: ['v8', 'raw'],
    entryFilter: {
        '**/src/**': true,
    },
}
