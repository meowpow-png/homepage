import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { RouterContext, useRouter } from '@/shared/routing'
import type { RouterContextValue } from '@/shared/routing'

function ComponentUsingRouter() {
    useRouter()
    return null
}

function RouterReader({ onRouter }: { onRouter: (router: RouterContextValue) => void }) {
    onRouter(useRouter())
    return null
}

describe('useRouter', () => {
    it('returns the router value when used within RouterContext', () => {
        const value: RouterContextValue = { navigate: () => {} }
        let received: RouterContextValue | undefined

        renderToStaticMarkup(
            <RouterContext.Provider value={value}>
                <RouterReader onRouter={(router) => { received = router }}/>
            </RouterContext.Provider>,
        )
        expect(received).toBe(value)
    })

    it('throws when used outside RouterContext', () => {
        expect(() => renderToStaticMarkup(<ComponentUsingRouter/>)).toThrow(
            'useRouter must be used within RouterContext',
        )
    })
})
