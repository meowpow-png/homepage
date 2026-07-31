/// <reference types="vite/client" />

declare module 'virtual:mermaid-theme' {
  export const mermaidTheme: Record<
    'base' | 'mantle' | 'surface0' | 'surface1' | 'surface2' | 'text' | 'subtext1' | 'blue',
    string
  >
}
