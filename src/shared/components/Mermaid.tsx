import mermaid from 'mermaid'
import {useEffect, useId, useRef} from 'react'
import {mermaidTheme} from 'virtual:mermaid-theme'

mermaid.initialize({
    startOnLoad: false,
    theme: 'base',
    themeVariables: {
        background: mermaidTheme.base,
        primaryColor: mermaidTheme.surface0,
        secondaryColor: mermaidTheme.surface1,
        tertiaryColor: mermaidTheme.surface2,

        primaryTextColor: mermaidTheme.text,
        secondaryTextColor: mermaidTheme.subtext1,

        primaryBorderColor: mermaidTheme.blue,
        lineColor: mermaidTheme.blue,

        clusterBkg: mermaidTheme.mantle,
        clusterBorder: mermaidTheme.blue,

        edgeLabelBackground: mermaidTheme.base,

        fontFamily: 'JetBrains Mono, monospace',
    },
})

type Props = {
    children: string
}

export function Mermaid({children}: Props) {
    const id = useId()
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        let mounted = true

        mermaid.render(`mermaid-${id}`, children).then(({svg}) => {
            if (mounted && ref.current) {
                ref.current.innerHTML = svg
            }
        })

        return () => {
            mounted = false
        }
    }, [children, id])

    return <div ref={ref} className="mermaid"/>
}
