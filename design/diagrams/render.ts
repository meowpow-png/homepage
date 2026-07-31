import mermaid from 'mermaid'
import { mermaidTheme } from 'virtual:mermaid-theme'

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

declare global {
  interface Window {
    renderDiagram(id: string, source: string): Promise<string>
  }
}

// gives standalone <img> use an intrinsic size instead of mermaid's inline-only width:100%
function withIntrinsicSize(svg: string): string {
  const container = document.createElement('div')
  container.innerHTML = svg
  const root = container.querySelector('svg')!
  const viewBox = root.getAttribute('viewBox')?.split(/\s+/).map(Number)

  if (viewBox?.length === 4) {
    root.setAttribute('width', String(viewBox[2]))
    root.setAttribute('height', String(viewBox[3]))
  }
  root.removeAttribute('style')
  return new XMLSerializer().serializeToString(root)
}

// called from generate-diagram-svg.js; id must be unique, mermaid scopes styles to it
window.renderDiagram = async (id, source) => {
  const { svg } = await mermaid.render(id, source)
  return withIntrinsicSize(svg)
}
