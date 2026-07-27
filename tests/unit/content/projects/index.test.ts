import { describe, expect, it } from 'vitest'

import { byDateDescending, byPinnedThenDate, type ProjectMetadata } from '@/content/projects'

function makeProject(overrides: Partial<ProjectMetadata> = {}): { metadata: ProjectMetadata } {
    return {
        metadata: {
            date: '2024-01-01',
            id: 'project',
            links: [],
            status: 'active',
            title: 'Project',
            ...overrides,
        },
    }
}

describe('byDateDescending', () => {
    it('orders later dates before earlier ones', () => {
        const earlier = makeProject({ date: '2024-01-01' })
        const later = makeProject({ date: '2024-06-01' })

        expect(byDateDescending(later, earlier)).toBeLessThan(0)
        expect(byDateDescending(earlier, later)).toBeGreaterThan(0)
    })

    it('returns 0 for equal dates', () => {
        const a = makeProject({ date: '2024-01-01' })
        const b = makeProject({ date: '2024-01-01' })

        expect(byDateDescending(a, b)).toBe(0)
    })
})

describe('byPinnedThenDate', () => {
    it('orders pinned projects before unpinned ones', () => {
        const pinned = makeProject({ pinned: true })
        const unpinned = makeProject({ pinned: false })

        expect(byPinnedThenDate(pinned, unpinned)).toBeLessThan(0)
        expect(byPinnedThenDate(unpinned, pinned)).toBeGreaterThan(0)
    })

    it('orders pinned projects by pinIndex ascending', () => {
        const first = makeProject({ pinned: true, pinIndex: 0 })
        const second = makeProject({ pinned: true, pinIndex: 1 })

        expect(byPinnedThenDate(first, second)).toBeLessThan(0)
        expect(byPinnedThenDate(second, first)).toBeGreaterThan(0)
    })

    it('treats a missing pinIndex as sorting after any defined pinIndex', () => {
        const withIndex = makeProject({ pinned: true, pinIndex: 0 })
        const withoutIndex = makeProject({ pinned: true })

        expect(byPinnedThenDate(withIndex, withoutIndex)).toBeLessThan(0)
        expect(byPinnedThenDate(withoutIndex, withIndex)).toBeGreaterThan(0)
    })

    it('falls back to date descending when pinIndex is equal', () => {
        const earlier = makeProject({ pinned: true, pinIndex: 0, date: '2024-01-01' })
        const later = makeProject({ pinned: true, pinIndex: 0, date: '2024-06-01' })

        expect(byPinnedThenDate(later, earlier)).toBeLessThan(0)
        expect(byPinnedThenDate(earlier, later)).toBeGreaterThan(0)
    })

    it('falls back to date descending when both are unpinned', () => {
        const earlier = makeProject({ date: '2024-01-01' })
        const later = makeProject({ date: '2024-06-01' })

        expect(byPinnedThenDate(later, earlier)).toBeLessThan(0)
        expect(byPinnedThenDate(earlier, later)).toBeGreaterThan(0)
    })
})
