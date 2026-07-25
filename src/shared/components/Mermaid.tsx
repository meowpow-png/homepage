import mermaid from 'mermaid'
import { useEffect, useId, useRef } from 'react'

mermaid.initialize({
    startOnLoad: false,
    theme: 'base',
    themeVariables: {
        background: '#1e1e2e',
        primaryColor: '#313244',
        secondaryColor: '#45475a',
        tertiaryColor: '#585b70',

        primaryTextColor: '#cdd6f4',
        secondaryTextColor: '#bac2de',

        primaryBorderColor: '#89b4fa',
        lineColor: '#89b4fa',

        clusterBkg: '#181825',
        clusterBorder: '#89b4fa',

        edgeLabelBackground: '#1e1e2e',

        fontFamily: 'JetBrains Mono, monospace',
    },
})

type Props = {
    children: string
}

export function Mermaid({ children }: Props) {
    const id = useId()
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        let mounted = true

        mermaid.render(`mermaid-${id}`, children).then(({ svg }) => {
            if (mounted && ref.current) {
                ref.current.innerHTML = svg
            }
        })

        return () => {
            mounted = false
        }
    }, [children, id])

    return <div ref={ref} className="mermaid" />
}
