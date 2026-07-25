import { createContext, useContext } from 'react'

type RouterContextValue = {
    navigate: (path: string) => void
}

const RouterContext = createContext<RouterContextValue | null>(null)

export function useRouter() {
    const context = useContext(RouterContext)
    if (!context) {
        throw new Error('useRouter must be used within RouterContext')
    }
    return context
}

export { RouterContext }
