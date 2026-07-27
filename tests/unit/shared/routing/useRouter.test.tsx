import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { useRouter } from '@/shared/routing'

function ComponentUsingRouter() {
    useRouter()
    return null
}

describe('useRouter', () => {
    it('throws when used outside RouterContext', () => {
        expect(() => renderToStaticMarkup(<ComponentUsingRouter/>)).toThrow(
            'useRouter must be used within RouterContext',
        )
    })
})
