import { describe, expect, it } from 'vitest'

import { resolveRoute, routes } from '@/shared/routing'

describe('resolveRoute', () => {
    it('returns the route for a known path', () => {
        expect(resolveRoute('/about')).toBe(routes['/about'])
    })

    it('returns undefined for an unknown path', () => {
        expect(resolveRoute('/unknown')).toBeUndefined()
    })
})
