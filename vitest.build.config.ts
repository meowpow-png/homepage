import { defineConfig } from 'vitest/config'

import viteConfig from './vite.config'

// separate from vite.config.ts's own `test` block: these tests read the
// already-built dist/ output, so they must run after `npm run build`,
// never mixed into the pre-build tests/unit suite. A plain spread fully
// replaces `test` instead of merging, since mergeConfig concatenates
// `include` arrays rather than swapping them
export default defineConfig({
  ...viteConfig,
  test: {
    include: ['tests/build/**/*.test.ts'],
  },
})
